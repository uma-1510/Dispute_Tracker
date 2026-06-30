"use client";

import { theme } from "@/lib/theme";

const STEPS = ["Received", "Parsed", "Classified", "Responded", "Resolved"];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {STEPS.map((label, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        const isLast = i === STEPS.length - 1;
        const circleColor = isDone || isActive ? theme.blue : theme.cardAlt;
        const textColor = isDone || isActive ? theme.text : theme.textDim;

        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: isLast ? "0 0 auto" : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                minWidth: 64,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: circleColor,
                  border: isActive
                    ? `2px solid ${theme.blueLight}`
                    : `1px solid ${theme.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: isDone || isActive ? "#fff" : theme.textDim,
                  transition: "all 250ms ease",
                  boxShadow: isActive
                    ? `0 0 0 4px rgba(37, 99, 235, 0.18)`
                    : "none",
                  animation: isActive ? "pulseGlow 1.8s infinite" : "none",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: isActive ? 700 : 500,
                  color: textColor,
                  whiteSpace: "nowrap",
                  transition: "color 250ms ease",
                }}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: isDone ? theme.blue : theme.border,
                  margin: "0 4px",
                  marginBottom: 18,
                  transition: "background 300ms ease",
                  borderRadius: 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
