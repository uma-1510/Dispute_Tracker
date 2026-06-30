"use client";

import { theme } from "@/lib/theme";

export default function Nav() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: "rgba(10, 13, 20, 0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.blue}, ${theme.blueLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "#fff",
            boxShadow: `0 0 16px rgba(37, 99, 235, 0.5)`,
          }}
        >
          S
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>
          Stuut
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.blueLight,
            background: "rgba(37, 99, 235, 0.12)",
            border: `1px solid rgba(59, 130, 246, 0.3)`,
            padding: "3px 9px",
            borderRadius: 999,
            letterSpacing: 0.2,
          }}
        >
          Disputes · Preview
        </span>
      </div>
      <span style={{ fontSize: 12.5, color: theme.textDim, fontWeight: 500 }}>
        Built by Uma
      </span>
    </div>
  );
}
