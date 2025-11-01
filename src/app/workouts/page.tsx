"use client";
import React, { useEffect, useMemo, useState } from "react";
import BodyMorph, { LengthUnit, MeasureKey } from "@/components/BodyMorph";
import { bodyFatFromBMI, bmiFromLbIn } from "@/lib/formulas";

type Activity = "sedentary"|"light"|"moderate"|"active"|"athlete";
type Sex = "male"|"female";

type WeightEntry = { date: string; weightLb: number };
type MeasureEntry = {
  date: string;
  chestIn?: number; waistIn?: number; hipsIn?: number; shouldersIn?: number; neckIn?: number;
  bicepsLIn?: number; bicepsRIn?: number; forearmLIn?: number; forearmRIn?: number;
  thighLIn?: number; thighRIn?: number; calfLIn?: number; calfRIn?: number;
};
type State = {
  name?: string;
  profile: { sex: Sex; age: number; heightIn: number; activity: Activity };
  startDate?: string; targetDate?: string;
  startWeightLb: number; targetWeightLb: number;
  entries: WeightEntry[];
  measures?: MeasureEntry[];
};

const KEY = "neon_weight_state_v1";
const LENGTH_UNIT_KEY = "neon_length_unit";
const CM_PER_IN = 2.54;

const FIELD_LIST: (keyof MeasureEntry)[] = [
  "chestIn","waistIn","hipsIn","shouldersIn","neckIn",
  "bicepsLIn","bicepsRIn","forearmLIn","forearmRIn",
  "thighLIn","thighRIn","calfLIn","calfRIn",
];

function toInches(v:number, unit:LengthUnit){ return unit==="cm" ? v/CM_PER_IN : v; }
function displayInches(v?:number, unit:LengthUnit="in", dp=1){ if(v==null) return ""; const val = unit==="cm"? v*CM_PER_IN : v; return val.toFixed(dp); }

export default function WorkoutsPage(){
  const [state, setState] = useState<State | null>(null);
  const [unit, setUnit] = useState<LengthUnit>("in");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [form, setForm] = useState<Partial<Record<keyof MeasureEntry, string>>>({});
  const [lastDeleted, setLastDeleted] = useState<null | { entry: MeasureEntry; index: number }>(null);

  // hydrate
  useEffect(()=>{ try{ const s=localStorage.getItem(KEY); if(s) setState(JSON.parse(s)); }catch{} },[]);
  useEffect(()=>{ try{ const u=localStorage.getItem(LENGTH_UNIT_KEY) as LengthUnit|null; if(u) setUnit(u); }catch{} },[]);

  const measures = state?.measures ?? [];
  const heightIn = state?.profile.heightIn ?? 70;

  // derive BMI/BF for morph tint
  const latestLb = state?.entries?.[state.entries.length-1]?.weightLb ?? state?.startWeightLb ?? 0;
  const bmi = useMemo(()=> bmiFromLbIn(latestLb, heightIn), [latestLb, heightIn]);
  const bf  = useMemo(()=> state ? Math.max(0, bodyFatFromBMI(bmi, state.profile.age, state.profile.sex)) : 20, [state, bmi]);

  function persist(next: State){
    setState(next);
    try{ localStorage.setItem(KEY, JSON.stringify(next)); }catch{}
  }

  // get or synthesize a "current" measure set for the selected date (merge last known as defaults)
  const currentForDate: MeasureEntry = useMemo(()=>{
    const day = measures.find(m=>m.date===date) ?? { date };
    // optional: prefill with MOST RECENT prior measures so the morph looks continuous
    const historical = measures.slice().sort((a,b)=>a.date.localeCompare(b.date));
    const prior = historical.filter(m=>m.date <= date).pop();
    return { ...prior, ...day, date };
  }, [measures, date]);

  // click-to-edit handler from BodyMorph (writes straight to storage)
  function handleEdit(key:MeasureKey, valInUnit:number){
    if(!state) return;
    const inches = toInches(valInUnit, unit);
    const idx = measures.findIndex(m=>m.date===date);
    const next = [...measures];
    if(idx >= 0) next[idx] = { ...next[idx], [key]: inches };
    else next.push({ date, [key]: inches });
    persist({ ...state, measures: next });
  }

  function saveEntryFromForm(){
    if(!state) return;
    const next = [...measures];
    const idx = next.findIndex(m=>m.date===date);
    const patch: Partial<MeasureEntry> = { date };
    for(const k of FIELD_LIST){
      const raw = form[k];
      if(raw && raw.trim()!==""){
        const num = parseFloat(raw);
        if(isFinite(num)) (patch as any)[k] = toInches(num, unit);
      }
    }
    if(idx>=0) next[idx] = { ...next[idx], ...patch } as MeasureEntry;
    else next.push(patch as MeasureEntry);
    persist({ ...state, measures: next });
    setForm({});
  }

  function removeAt(realIdx: number){
    if(!state) return;
    const entry = measures[realIdx];
    if(!entry) return;
    const ok = window.confirm(`Delete measurements from ${entry.date}?`);
    if(!ok) return;
    const next = measures.filter((_,i)=>i!==realIdx);
    setLastDeleted({ entry, index: realIdx });
    persist({ ...state, measures: next });
  }
  function undoDelete(){
    if(!state || !lastDeleted) return;
    const next = [...measures];
    next.splice(lastDeleted.index, 0, lastDeleted.entry);
    persist({ ...state, measures: next });
    setLastDeleted(null);
  }

  if(!state){
    return <main className="max-w-[720px] mx-auto p-4">No data yet. Log a weight on Home.</main>;
  }

  return (
    <main className="max-w-[720px] mx-auto p-4 space-y-4 pb-28">
      <header className="flex items-center justify-between">
        <h1 className="text-[#9BEFFF] text-lg font-black tracking-wider">WORKOUTS</h1>
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#8EA4D2]">Date</label>
          <input className="input w-[160px]" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <div className="text-xs text-[#8EA4D2]">Units</div>
          <div className="flex gap-2">
            <button onClick={()=>{ setUnit("in"); try{ localStorage.setItem(LENGTH_UNIT_KEY,"in"); }catch{} }}
                    className={"px-3 py-1 rounded-lg text-xs font-black " + (unit==="in"?"bg-[#0CF] text-black":"border border-white/20 text-[#9BEFFF]")}>IN</button>
            <button onClick={()=>{ setUnit("cm"); try{ localStorage.setItem(LENGTH_UNIT_KEY,"cm"); }catch{} }}
                    className={"px-3 py-1 rounded-lg text-xs font-black " + (unit==="cm"?"bg-[#0CF] text-black":"border border-white/20 text-[#9BEFFF]")}>CM</button>
          </div>
        </div>
      </header>

      {/* Interactive body morph */}
      <section className="card space-y-2">
        <div className="font-black">Visual</div>
        <BodyMorph
          unit={unit}
          measures={currentForDate}
          bodyFatPct={bf}
          onEdit={handleEdit}
        />
        <div className="text-xs text-[#8EA4D2]">Muscle (cyan) · Fat (pink) intensity scales with body-fat%.</div>
      </section>

      {/* Manual entry form (kept) */}
      <section className="card space-y-3">
        <div className="font-black">Body Measurements</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FIELD_LIST.map((key)=>(
            <div key={String(key)}>
              <label className="text-xs text-[#8EA4D2]">{key.replace("In","").replace(/([A-Z])/g," $1").trim()} ({unit})</label>
              <input
                className="input"
                inputMode="decimal"
                placeholder={key}
                value={form[key] ?? ""}
                onChange={e=>setForm(f=>({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button className="btn" onClick={saveEntryFromForm}>Save</button>
          <button className="btn" onClick={()=>setForm({})}>Clear</button>
        </div>
      </section>

      {/* History table (unchanged + delete/undo) */}
      <section className="card p-3">
        <div className="font-black mb-2">History</div>
        {measures.length === 0 ? (
          <div className="text-sm text-[#8EA4D2]">No measurements yet.</div>
        ) : (
          <div className="max-h-[40vh] overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-[#8EA4D2] sticky top-0 bg-[rgba(11,15,30,.9)] backdrop-blur-md">
                <tr>
                  <th className="text-left py-1">Date</th>
                  <th className="text-left py-1">Chest</th>
                  <th className="text-left py-1">Waist</th>
                  <th className="text-left py-1">Hips</th>
                  <th className="text-left py-1">Biceps L/R</th>
                  <th className="text-left py-1">Thigh L/R</th>
                  <th className="text-right py-1 pr-2"></th>
                </tr>
              </thead>
              <tbody>
                {measures.slice().sort((a,b)=>a.date.localeCompare(b.date)).reverse().map((m,i)=>{
                  const realIdx = measures.findIndex(x=>x.date===m.date);
                  const fmt = (v?:number)=>displayInches(v, unit);
                  const pair = (l?:number,r?:number)=>[fmt(l),fmt(r)].filter(Boolean).join(" / ");
                  return (
                    <tr key={m.date+"-"+i} className="border-t border-white/10">
                      <td className="py-1">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="py-1">{fmt(m.chestIn)}</td>
                      <td className="py-1">{fmt(m.waistIn)}</td>
                      <td className="py-1">{fmt(m.hipsIn)}</td>
                      <td className="py-1">{pair(m.bicepsLIn, m.bicepsRIn)}</td>
                      <td className="py-1">{pair(m.thighLIn, m.thighRIn)}</td>
                      <td className="py-1 pr-2 text-right">
                        <button
                          aria-label="Delete"
                          onClick={()=>removeAt(realIdx)}
                          className="px-2 py-1 rounded-md border border-white/15 hover:border-pink-400/60 text-pink-300 hover:text-pink-200 transition"
                          title="Delete">
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
        )}
      </section>

      {lastDeleted && (
        <div className="fixed left-0 right-0 bottom-[90px] z-40">
          <div className="mx-auto max-w-[720px] px-3">
            <div className="rounded-xl bg-[rgba(6,8,20,.95)] border border-white/15 backdrop-blur-md p-3 flex items-center justify-between">
              <div className="text-sm text-[#D6E2FF]">
                Deleted measurements from {new Date(lastDeleted.entry.date).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg text-xs font-black bg-[#0CF] text-black shadow-[0_0_16px_rgba(0,240,255,.6)]" onClick={undoDelete}>Undo</button>
                <button className="px-3 py-1 rounded-lg text-xs font-black border border-white/15 text-[#9BEFFF]" onClick={()=>setLastDeleted(null)}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
