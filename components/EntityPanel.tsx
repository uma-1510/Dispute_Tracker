"use client";

import { ENTITY_META, EntityType, ParseResult } from "@/lib/parser";
import { theme } from "@/lib/theme";

const TYPE_ORDER: EntityType[] = ["invoice", "amount", "date", "name", "keyword"];

function confidenceColor(pct: number) {
  if (pct >= 80) return theme.green;
  if (pct >= 50) return theme.yellow;
  if (pct > 0) return theme.blue;
  return theme.textDim;
}

export default function EntityPanel({ result }: { result: ParseResult }) {
  const hasAny = result.entities.length > 0;
  const color = confidenceColor(result.confidence);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.6,
              color: theme.textMuted,
              textTransform: "uppercase",
            }}
          >
            Parse confidence
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>
            {result.confidence}%
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: theme.cardAlt,
            overflow: "hidden",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${result.confidence}%`,
              background: `linear-gradient(90deg, ${theme.blue}, ${color})`,
              borderRadius: 999,
              transition: "width 200ms ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!hasAny && (
          <p style={{ color: theme.textDim, fontSize: 13, margin: 0 }}>
            Entities will appear here as you type or paste an email.
          </p>
        )}
        {TYPE_ORDER.map((type) => {
          const values = result.byType[type];
          if (!values || values.length === 0) return null;
          const meta = ENTITY_META[type];
          return (
            <div key={type}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: theme.textDim,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {meta.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {values.map((v, i) => (
                  <span
                    key={`${type}-${i}-${v}`}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.border}`,
                      animation: "fadeIn 180ms ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
