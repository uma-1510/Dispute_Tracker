"use client";

import { useState } from "react";
import { AnalysisResult, Priority, Recommendation } from "@/lib/types";
import { theme, fontMono } from "@/lib/theme";

const DISPUTE_META: Record<string, { icon: string; label: string }> = {
  duplicate: { icon: "🔄", label: "Duplicate Charge" },
  pricing: { icon: "💰", label: "Pricing Dispute" },
  not_received: { icon: "📦", label: "Goods Not Received" },
  short_pay: { icon: "✂️", label: "SLA Short-Pay" },
  other: { icon: "❓", label: "Other" },
};

const PRIORITY_COLOR: Record<Priority, string> = {
  High: theme.red,
  Medium: theme.yellow,
  Low: theme.green,
};

const RECOMMENDATION_STYLE: Record<
  Recommendation,
  { color: string; bg: string; border: string }
> = {
  Approve: {
    color: theme.green,
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.35)",
  },
  "Request Docs": {
    color: theme.yellow,
    bg: "rgba(234, 179, 8, 0.1)",
    border: "rgba(234, 179, 8, 0.35)",
  },
  Escalate: {
    color: theme.red,
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.35)",
  },
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: 18,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: theme.textDim,
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

export default function ResultsPanel({
  result,
  onResolve,
  resolved,
}: {
  result: AnalysisResult;
  onResolve: () => void;
  resolved: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const dispute = DISPUTE_META[result.disputeType] ?? DISPUTE_META.other;
  const recStyle = RECOMMENDATION_STYLE[result.recommendation];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.responseEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable; ignore
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        animation: "fadeIn 250ms ease",
      }}
    >
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px" }}>
          <Card>
            <Label>Classification</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>{dispute.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                {dispute.label}
              </span>
            </div>
          </Card>
        </div>

        <div style={{ flex: "1 1 140px" }}>
          <Card>
            <Label>Priority</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: PRIORITY_COLOR[result.priority],
                  boxShadow: `0 0 8px ${PRIORITY_COLOR[result.priority]}`,
                }}
              />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: PRIORITY_COLOR[result.priority],
                }}
              >
                {result.priority}
              </span>
            </div>
          </Card>
        </div>

        <div style={{ flex: "1 1 160px" }}>
          <Card>
            <Label>Est. Resolution</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{ fontSize: 22, fontWeight: 800, color: theme.blueLight }}
              >
                {result.estimatedResolutionDays}
              </span>
              <span style={{ fontSize: 13, color: theme.textMuted }}>
                business day
                {result.estimatedResolutionDays === 1 ? "" : "s"}
              </span>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <Label>Summary</Label>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: theme.text }}>
          {result.summary}
        </p>
      </Card>

      <div
        style={{
          background: recStyle.bg,
          border: `1px solid ${recStyle.border}`,
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: recStyle.color,
              textTransform: "uppercase",
            }}
          >
            Recommendation
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: recStyle.color,
              padding: "3px 10px",
              borderRadius: 999,
              border: `1px solid ${recStyle.border}`,
            }}
          >
            {result.recommendation}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: theme.text }}>
          {result.recommendationReason}
        </p>
      </div>

      <Card>
        <Label>Next Steps</Label>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {result.nextSteps.map((step, i) => (
            <li key={i} style={{ fontSize: 13.5, lineHeight: 1.6, color: theme.text }}>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Label>Drafted Response</Label>
          <button
            onClick={handleCopy}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: copied ? theme.green : theme.blueLight,
              background: "transparent",
              border: `1px solid ${copied ? theme.green : theme.border}`,
              borderRadius: 6,
              padding: "5px 12px",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            background: theme.cardAlt,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: 16,
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "#d1d5db",
            fontFamily: fontMono,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {result.responseEmail}
        </pre>
      </Card>

      <button
        onClick={onResolve}
        disabled={resolved}
        style={{
          alignSelf: "flex-start",
          fontSize: 13,
          fontWeight: 700,
          color: resolved ? theme.green : "#fff",
          background: resolved ? "rgba(34, 197, 94, 0.12)" : theme.blue,
          border: resolved
            ? `1px solid rgba(34, 197, 94, 0.4)`
            : `1px solid ${theme.blue}`,
          borderRadius: 8,
          padding: "10px 18px",
          cursor: resolved ? "default" : "pointer",
          transition: "all 150ms ease",
        }}
      >
        {resolved ? "✓ Marked Resolved" : "Mark as Resolved"}
      </button>
    </div>
  );
}
