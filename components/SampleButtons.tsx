"use client";

import { useState } from "react";
import { SAMPLE_DISPUTES } from "@/lib/samples";
import { theme } from "@/lib/theme";

export default function SampleButtons({
  onSelect,
}: {
  onSelect: (email: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {SAMPLE_DISPUTES.map((sample) => (
        <button
          key={sample.id}
          onClick={() => onSelect(sample.email)}
          onMouseEnter={() => setHovered(sample.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: hovered === sample.id ? "#fff" : theme.textMuted,
            background:
              hovered === sample.id ? theme.blue : "rgba(255,255,255,0.03)",
            border: `1px solid ${
              hovered === sample.id ? theme.blue : theme.border
            }`,
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            transition: "all 150ms ease",
          }}
        >
          <span>{sample.icon}</span>
          <span>{sample.label}</span>
        </button>
      ))}
    </div>
  );
}
