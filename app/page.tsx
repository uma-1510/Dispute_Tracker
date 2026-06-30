"use client";

import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import SampleButtons from "@/components/SampleButtons";
import EntityPanel from "@/components/EntityPanel";
import Stepper from "@/components/Stepper";
import ResultsPanel from "@/components/ResultsPanel";
import { parseEmail } from "@/lib/parser";
import { theme } from "@/lib/theme";
import { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [email, setEmail] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  const parsed = useMemo(() => parseEmail(email), [email]);

  const step = loading ? 2 : analysis ? (resolved ? 4 : 3) : email.trim() ? 1 : 0;

  function updateEmail(value: string) {
    setEmail(value);
    setAnalysis(null);
    setError(null);
    setResolved(false);
  }

  async function handleAnalyze() {
    if (!email.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setResolved(false);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, entities: parsed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }
      setAnalysis(data as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text }}>
      <Nav />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "28px 28px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>
            AR Dispute Resolution
          </h1>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0 }}>
            Paste a customer dispute email — entities are extracted instantly,
            then Claude classifies the dispute and drafts a response.
          </p>
        </div>

        <Stepper currentStep={step} />

        <div
          className="two-col-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: theme.textDim,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Sample disputes
              </div>
              <SampleButtons onSelect={updateEmail} />
            </div>

            <textarea
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder="Paste or type a customer dispute email here..."
              style={{
                width: "100%",
                minHeight: 320,
                resize: "vertical",
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: 16,
                fontSize: 13.5,
                lineHeight: 1.6,
                color: theme.text,
                fontFamily: "inherit",
                transition: "border-color 150ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = theme.blue)}
              onBlur={(e) => (e.currentTarget.style.borderColor = theme.border)}
            />

            <EntityPanel result={parsed} />

            <button
              onClick={handleAnalyze}
              disabled={!email.trim() || loading}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                background:
                  !email.trim() || loading
                    ? "rgba(37, 99, 235, 0.4)"
                    : theme.blue,
                border: "none",
                borderRadius: 10,
                padding: "13px 20px",
                cursor: !email.trim() || loading ? "not-allowed" : "pointer",
                transition: "background 150ms ease, transform 100ms ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseDown={(e) => {
                if (!loading && email.trim())
                  e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Analyzing with Claude...
                </>
              ) : (
                "Analyze Dispute"
              )}
            </button>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: `1px solid rgba(239, 68, 68, 0.35)`,
                  color: theme.red,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {analysis ? (
              <ResultsPanel
                result={analysis}
                onResolve={() => setResolved(true)}
                resolved={resolved}
              />
            ) : (
              <div
                style={{
                  background: theme.card,
                  border: `1px dashed ${theme.border}`,
                  borderRadius: 12,
                  padding: 40,
                  textAlign: "center",
                  color: theme.textDim,
                  fontSize: 13.5,
                }}
              >
                {loading
                  ? "Claude is classifying the dispute and drafting a response..."
                  : "Results will appear here after you analyze a dispute."}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
