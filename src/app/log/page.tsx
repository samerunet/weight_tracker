"use client";
import React, { useEffect, useMemo, useState } from "react";
import HistoryChart from "@/components/HistoryChart";
import { Activity, Sex, Unit, bmiFromLbIn } from "@/lib/formulas";

type Entry = { date: string; weightLb: number };
type State = {
  name: string;
  profile: { sex: Sex; age: number; heightIn: number; activity: Activity };
  startDate: string;
  targetDate: string;
  startWeightLb: number;
  targetWeightLb: number;
  entries: Entry[];
};
const KEY = "neon_weight_state_v1";
const UNIT_KEY = "neon_weight_unit";

export default function LogPage() {
  const [unit, setUnit] = useState<Unit>("lb");
  const [state, setState] = useState<State | null>(null);

  // for undo
  const [lastDeleted, setLastDeleted] = useState<null | { entry: Entry; index: number }>(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setState(JSON.parse(s)); } catch {}
    try { const u = localStorage.getItem(UNIT_KEY) as Unit | null; if (u) setUnit(u); } catch {}
  }, []);

  const entries = state?.entries ?? [];
  const heightIn = state?.profile.heightIn ?? 70;

  const [range, setRange] = useState<number | "all">("all");
  const [showBMI, setShowBMI] = useState(true);
  const [smooth, setSmooth] = useState(1);

  const latest = entries.length ? entries[entries.length - 1].weightLb : state?.startWeightLb ?? 0;
  const bmi = useMemo(() => (heightIn ? Math.round(bmiFromLbIn(latest, heightIn) * 10) / 10 : 0), [latest, heightIn]);

  function persist(newState: State) {
    setState(newState);
    try { localStorage.setItem(KEY, JSON.stringify(newState)); } catch {}
  }

  function removeAt(realIdx: number) {
    if (!state) return;
    const entry = state.entries[realIdx];
    if (!entry) return;
    const ok = window.confirm(`Delete entry from ${entry.date}?`);
    if (!ok) return;
    const newEntries = state.entries.filter((_, i) => i !== realIdx);
    const newState = { ...state, entries: newEntries };
    setLastDeleted({ entry, index: realIdx });
    persist(newState);
  }

  function undoDelete() {
    if (!state || !lastDeleted) return;
    const newEntries = [...state.entries];
    newEntries.splice(lastDeleted.index, 0, lastDeleted.entry);
    persist({ ...state, entries: newEntries });
    setLastDeleted(null);
  }

  if (!state) {
    return <main className="max-w-[720px] mx-auto p-4">No data yet. Log a weight on Home.</main>;
  }

  return (
    <main className="max-w-[720px] mx-auto p-4 space-y-4 pb-28">
      <header className="flex items-center justify-between">
        <h1 className="text-[#9BEFFF] text-lg font-black tracking-wider">LOG</h1>
        <div className="text-[#8EA4D2] text-sm">
          Latest BMI: <span className="text-[#D6E2FF] font-bold">{bmi}</span>
        </div>
      </header>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        {(["7","30","90","180","365"] as const).map((d) => (
          <button key={d}
            onClick={()=>setRange(parseInt(d))}
            className={"px-3 py-1 rounded-lg text-xs font-black " + (range===parseInt(d) ? "bg-[#0CF] text-black" : "border border-white/15 text-[#9BEFFF]")}>
            {d}d
          </button>
        ))}
        <button onClick={()=>setRange("all")}
          className={"px-3 py-1 rounded-lg text-xs font-black " + (range==="all" ? "bg-[#0CF] text-black" : "border border-white/15 text-[#9BEFFF]")}>
          All
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-[#8EA4D2] flex items-center gap-1">
            <input type="checkbox" checked={showBMI} onChange={e=>setShowBMI(e.target.checked)} />
            Show BMI
          </label>
          <label className="text-xs text-[#8EA4D2] flex items-center gap-1">
            Smooth
            <select className="bg-transparent border border-white/15 rounded px-1 py-0.5 text-[#D6E2FF]"
              value={smooth} onChange={e=>setSmooth(parseInt(e.target.value))}>
              <option value={1}>Off</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </label>
        </div>
      </div>

      {/* chart */}
      <section className="rounded-2xl border border-white/10 bg-[rgba(11,15,30,.65)] backdrop-blur-md p-3">
        <HistoryChart
          entries={entries}
          unit={unit}
          heightIn={heightIn}
          showBMI={showBMI}
          rangeDays={range}
          smoothWindow={smooth}
        />
      </section>

      {/* history table with delete */}
      <section className="rounded-2xl border border-white/10 bg-[rgba(11,15,30,.65)] backdrop-blur-md p-3">
        <div className="font-black mb-2">History</div>
        <div className="max-h-[40vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-[#8EA4D2] sticky top-0 bg-[rgba(11,15,30,.9)] backdrop-blur-md">
              <tr>
                <th className="text-left py-1">Date</th>
                <th className="text-left py-1">Weight ({unit})</th>
                <th className="text-left py-1">BMI</th>
                <th className="text-right py-1 pr-2"> </th>
              </tr>
            </thead>
            <tbody>
              {entries.slice().reverse().map((e, i) => {
                const realIdx = entries.length - 1 - i; // index in original (oldest->newest)
                const w = unit==="kg" ? (e.weightLb*0.45359237).toFixed(1) : e.weightLb.toFixed(1);
                const b = bmiFromLbIn(e.weightLb, heightIn).toFixed(1);
                return (
                  <tr key={e.date+"-"+i} className="border-t border-white/10">
                    <td className="py-1">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="py-1">{w}</td>
                    <td className="py-1">{b}</td>
                    <td className="py-1 pr-2 text-right">
                      <button
                        aria-label="Delete entry"
                        onClick={()=>removeAt(realIdx)}
                        className="px-2 py-1 rounded-md border border-white/15 hover:border-pink-400/60 text-pink-300 hover:text-pink-200 transition"
                        title="Delete"
                      >
                        {/* trash icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4h8v2m-1 0v13a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6"
                                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* undo snackbar */}
      {lastDeleted && (
        <div className="fixed left-0 right-0 bottom-[90px] z-40">
          <div className="mx-auto max-w-[720px] px-3">
            <div className="rounded-xl bg-[rgba(6,8,20,.95)] border border-white/15 backdrop-blur-md p-3 flex items-center justify-between">
              <div className="text-sm text-[#D6E2FF]">
                Deleted entry from {new Date(lastDeleted.entry.date).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded-lg text-xs font-black bg-[#0CF] text-black shadow-[0_0_16px_rgba(0,240,255,.6)]"
                  onClick={undoDelete}>
                  Undo
                </button>
                <button
                  className="px-3 py-1 rounded-lg text-xs font-black border border-white/15 text-[#9BEFFF]"
                  onClick={()=>setLastDeleted(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
