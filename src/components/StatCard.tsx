"use client";
import React from "react";
type Variant = "blue" | "magenta" | "violet";

export default function StatCard({
  label,
  value,
  unit,
  footnote,
  variant = "blue",
}: {
  label: string;
  value: string;
  unit?: string;
  footnote?: string;
  variant?: Variant;
}) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit ? (
          <span className="stat-unit">{unit}</span>
        ) : null}
      </div>
      <div className="stat-accent" />
      {footnote ? <div className="stat-footnote">{footnote}</div> : null}
    </div>
  );
}
