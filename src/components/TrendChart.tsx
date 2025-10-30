"use client";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const progressData = [210, 206, 202, 198, 200, 205, 209];

export default function TrendChart() {
  const stroke = (context: ScriptableContext<"line">) => {
    const { chart } = context;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return "#00F0FF";
    }
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, "#00F0FF");
    gradient.addColorStop(0.5, "#7A77FF");
    gradient.addColorStop(1, "#FF00E5");
    return gradient;
  };

  const fill = (context: ScriptableContext<"line">) => {
    const { chart } = context;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return "rgba(0,240,255,0.18)";
    }
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(0,240,255,0.22)");
    gradient.addColorStop(1, "rgba(255,0,229,0)");
    return gradient;
  };

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: progressData,
          tension: 0.52,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          borderColor: stroke,
          backgroundColor: fill,
        },
        {
          data: [208, 208, 208, 208, 208, 208, 208],
          borderColor: "rgba(255,0,229,0.45)",
          borderWidth: 2,
          borderDash: [6, 6],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(13,20,43,0.96)",
          borderColor: "rgba(0,240,255,0.4)",
          borderWidth: 1,
          titleColor: "#9BEFFF",
          bodyColor: "#D6E2FF",
          displayColors: false,
          callbacks: {
            title: () => "Daily Weight",
            label: (ctx: any) => `${ctx.formattedValue} lb`,
          },
        },
      },
      interaction: { mode: "index" as const, intersect: false },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
          min: 160,
          max: 212,
        },
      },
      layout: {
        padding: {
          top: 8,
          right: 4,
          bottom: 10,
          left: 4,
        },
      },
    }),
    []
  );

  return (
    <div className="chart-panel">
      <div className="chart-axis chart-axis-top">210</div>
      <div className="chart-axis chart-axis-mid">185</div>
      <div className="chart-axis chart-axis-bottom">160</div>
      <div className="chart-inner">
        <Line data={data} options={options} />
      </div>
      <div className="chart-footer">
        <span>Start</span>
        <span>Goal</span>
      </div>
    </div>
  );
}
