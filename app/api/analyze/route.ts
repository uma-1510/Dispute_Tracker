import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ParseResult } from "@/lib/parser";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    disputeType: {
      type: "string",
      enum: ["duplicate", "pricing", "not_received", "short_pay", "other"],
    },
    priority: { type: "string", enum: ["High", "Medium", "Low"] },
    summary: { type: "string" },
    recommendation: {
      type: "string",
      enum: ["Approve", "Request Docs", "Escalate"],
    },
    recommendationReason: { type: "string" },
    nextSteps: { type: "array", items: { type: "string" } },
    responseEmail: { type: "string" },
    estimatedResolutionDays: { type: "integer" },
  },
  required: [
    "disputeType",
    "priority",
    "summary",
    "recommendation",
    "recommendationReason",
    "nextSteps",
    "responseEmail",
    "estimatedResolutionDays",
  ],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { email?: string; entities?: ParseResult };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Missing email text." }, { status: 400 });
  }

  const entities = body.entities;
  const entitiesSummary = entities
    ? JSON.stringify(entities.byType, null, 2)
    : "{}";

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "disabled" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: ANALYSIS_SCHEMA },
      },
      system: `You are an AR (accounts receivable) dispute resolution analyst at a B2B finance team. You classify incoming customer dispute emails, recommend a course of action, and draft a professional response.

A deterministic parser has already extracted structured entities from the email before you see it. Treat these as verified, high-confidence facts — use them to ground your classification rather than re-deriving them from scratch.

Extracted entities (by type):
${entitiesSummary}

Classify the dispute into exactly one of: duplicate (same invoice/charge billed twice), pricing (billed amount disagrees with contract rate), not_received (goods/services never delivered), short_pay (customer intentionally paid less, e.g. due to an SLA penalty), or other.

Set priority based on dollar amount and severity (High for large amounts or goods-not-received, Medium for typical pricing/duplicate disputes, Low for small or low-risk discrepancies).

Set recommendation to exactly one of: "Approve" (issue credit/adjustment, the customer is clearly right), "Request Docs" (need more evidence before deciding), or "Escalate" (requires manager/legal review, e.g. large dollar amount or contract dispute).

responseEmail should be a complete, professional, ready-to-send email reply to the customer, written from the AR team's perspective, referencing the specific invoice numbers and amounts involved.

estimatedResolutionDays should be a realistic integer estimate of business days to resolve.`,
      messages: [
        {
          role: "user",
          content: `Here is the raw customer email:\n\n${email}`,
        },
      ],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      return NextResponse.json(
        { error: "Claude did not return a text response." },
        { status: 502 }
      );
    }

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "The request was declined by Claude's safety system." },
        { status: 422 }
      );
    }

    const parsed = JSON.parse(block.text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Claude analysis failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
