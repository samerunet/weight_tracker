"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import Sparkline from "@/components/Sparkline";
import { bmiFromLbIn, bodyFatFromBMI, bmr, tdee } from "@/lib/formulas";

type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "athlete";

const KEY = "neon_weight_state_v1";
const UNIT_KEY = "neon_weight_unit";

type State = {
  profile: { sex: Sex; age: number; heightIn: number; activity: Activity };
  startWeightLb: number;
  goalWeightLb: number;
  entries: { date: string; weightLb: number }[];
};

const defaultState: State = {
  profile: { sex:"male", age:30, heightIn:70, activity:"moderate" },
  startWeightLb: 200,
  goalWeightLb: 170,
  entries: [
    { date: new Date(Date.now()-1000*60*60*24*14).toISOString().slice(0,10), weightLb: 200 },
    { date: new Date(Date.now()-1000*60*60*24*12).toISOString().slice(0,10), weightLb: 198 },
    { date: new Date(Date.now()-1000*60*60*24*10).toISOString().slice(0,10), weightLb: 197 },
    { date: new Date(Date.now()-1000*60*60*24*7).toISOString().slice(0,10), weightLb: 194 },
    { date: new Date(Date.now()-1000*60*60*24*3).toISOString().slice(0,10), weightLb: 191 },
  ]
};

// ---- Neon badge color logic for BMI category ----
function getBmiBadge(bmi: number) {
  // fallbacks
  if (!isFinite(bmi) || bmi <= 0) {
    return { label: "—", bg: "rgba(255,255,255,.06)", color: "#D6E2FF", shadow: "0 0 0 rgba(0,0,0,0)" };
  }
  if (bmi < 18.5) {
    return {
      label: "Underweight",
      bg: "linear-gradient(90deg,#00F0FF,#7AE1FF)",
      color: "#001018",
      shadow: "0 0 14px rgba(0,240,255,.55)"
    };
  }
  if (bmi < 25) {
    return {
      label: "Healthy",
      bg: "linear-gradient(90deg,#00F5C8,#3BFF7E)",
      color: "#00150E",
      shadow: "0 0 14px rgba(0,255,183,.55)"
    };
  }
  if (bmi < 30) {
    return {
      label: "Overweight",
      bg: "linear-gradient(90deg,#FFD34D,#FF8A00)",
      color: "#1A0E00",
      shadow: "0 0 14px rgba(255,170,0,.55)"
    };
  }
  return {
    label: "Obese",
    bg: "linear-gradient(90deg,#FF4DFF,#FF2D55)",
    color: "#1A0012",
    shadow: "0 0 14px rgba(255,45,85,.55)"
  };
}

export default function Page(){
  const [unit, setUnit] = useState<"lb"|"kg">("lb");
  const [state, setState] = useState<State>(defaultState);
  const [todayWeight, setTodayWeight] = useState("");

  // hydrate
  useEffect(()=>{ try{ const s = localStorage.getItem(KEY); if(s) setState(JSON.parse(s)); }catch{} },[]);
  useEffect(()=>{ try{ const u = localStorage.getItem(UNIT_KEY) as "lb"|"kg"|null; if(u) setUnit(u); }catch{} },[]);
  // persist
  useEffect(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch{} },[state]);

  const latestWeight = state.entries.length ? state.entries[state.entries.length-1].weightLb : state.startWeightLb;
  const bmi = useMemo(()=>Math.round(bmiFromLbIn(latestWeight, state.profile.heightIn)*10)/10,[latestWeight, state.profile.heightIn]);
  const bf = useMemo(()=>Math.max(0, Math.round(bodyFatFromBMI(bmi, state.profile.age, state.profile.sex)*10)/10),[bmi, state.profile]);
  const badge = useMemo(()=>getBmiBadge(bmi),[bmi]);

  const prog = useMemo(()=>{
    const s = state.startWeightLb, g = state.goalWeightLb, c = latestWeight;
    const span = s - g || 1; const done = s - c;
    return Math.min(1, Math.max(0, done / span));
  },[state.startWeightLb, state.goalWeightLb, latestWeight]);

  const bmrVal = bmr(latestWeight, state.profile.heightIn, state.profile.age, state.profile.sex);
  const tdeeVal = tdee(bmrVal, state.profile.activity);
  const cut = Math.max(1200, tdeeVal - 500);
  const gain = tdeeVal + 300;

  const weights = state.entries.map(e => e.weightLb);

  function addToday(){
    const w = parseFloat(todayWeight);
    if(!w) return;
    const isKg = unit === "kg";
    const lb = isKg ? w * 2.2046226218 : w;
    const d = new Date().toISOString().slice(0,10);
    const exists = state.entries.find(e => e.date === d);
    const newEntries = exists
      ? state.entries.map(e => e.date===d ? {...e, weightLb:lb} : e)
      : [...state.entries, {date:d, weightLb:lb}];
    setState({...state, entries:newEntries});
    setTodayWeight("");
  }

  function editProfile(p: Partial<State["profile"]>){ setState({...state, profile:{...state.profile, ...p}}); }
  function editTargets(p: Partial<Pick<State,"startWeightLb"|"goalWeightLb">>){ setState({...state, ...p}); }

  const display = (lbValue:number, dp=1) => unit === "kg" ? (lbValue * 0.45359237).toFixed(dp) : lbValue.toFixed(dp);

  return (
    <main className="container space-y-4 pb-28">
      <header className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-black tracking-[0.3em] text-[#9BEFFF]">WEIGHT TRACKER</h1>
      </header>

      {/* Top stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="card">
          <div className="text-[#8EA4D2] text-xs font-bold">Weight</div>
          <div className="text-[#9BEFFF] font-black text-xl">
            {display(latestWeight)} <span className="text-[#8EA4D2] text-sm font-bold">{unit}</span>
          </div>
        </div>
        <div className="card">
          <div className="text-[#8EA4D2] text-xs font-bold">BMI</div>
          <div className="text-[#9BEFFF] font-black text-xl">{bmi}</div>
        </div>
        <div className="card">
          <div className="text-[#8EA4D2] text-xs font-bold">Body Fat</div>
          <div className="text-[#9BEFFF] font-black text-xl">{bf}%</div>
        </div>
      </section>

      {/* Progress */}
      <section className="card">
        <div className="flex items-center justify-between">
          <div className="font-black">Progress</div>
          <div className="text-[#8EA4D2]">{Math.round(prog*100)}%</div>
        </div>
        <ProgressBar value={prog} />
        <div className="mt-2 text-xs text-[#8EA4D2]">
          Start: {display(state.startWeightLb)} {unit} → Goal: {display(state.goalWeightLb)} {unit}
        </div>
      </section>

      {/* Log weight */}
      <section className="card">
        <div className="font-black mb-2">Log today</div>
        <div className="flex gap-2">
          <input className="input" placeholder={`Weight in ${unit}`} value={todayWeight} onChange={e=>setTodayWeight(e.target.value)} />
          <button className="btn" onClick={addToday}>Save</button>
        </div>
      </section>

      {/* Trend */}
      <section className="card">
        <div className="font-black mb-2">Trend</div>
        <Sparkline data={weights} />
        <div className="mt-2 text-xs text-[#8EA4D2]">Last {weights.length} entries</div>
      </section>

      {/* Targets & Profile */}
      <section className="grid grid-cols-2 gap-3">
        <div className="card space-y-2">
          <div className="font-black">Targets</div>
          <div className="flex gap-2">
            <input className="input" placeholder="Start lb" type="number"
              value={state.startWeightLb} onChange={e=>editTargets({startWeightLb: parseFloat(e.target.value)||0})}/>
            <input className="input" placeholder="Goal lb" type="number"
              value={state.goalWeightLb} onChange={e=>editTargets({goalWeightLb: parseFloat(e.target.value)||0})}/>
          </div>
        </div>
        <div className="card space-y-2">
          <div className="font-black">Profile</div>
          <div className="grid grid-cols-2 gap-2">
            <select className="input" value={state.profile.sex} onChange={e=>editProfile({sex: e.target.value as Sex})}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select className="input" value={state.profile.activity} onChange={e=>editProfile({activity: e.target.value as Activity})}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="athlete">Athlete</option>
            </select>
            <input className="input" placeholder="Age" type="number"
              value={state.profile.age} onChange={e=>editProfile({age: parseInt(e.target.value)||0})}/>
            <input className="input" placeholder="Height (in)" type="number"
              value={state.profile.heightIn} onChange={e=>editProfile({heightIn: parseFloat(e.target.value)||0})}/>
          </div>
        </div>
      </section>

      {/* Calories + BMI badge */}
      <section className="card">
        <div className="font-black mb-1">Calories</div>
        <div className="text-sm text-[#8EA4D2]">
          BMR: <span className="text-white font-bold">{bmrVal}</span> kcal · TDEE: <span className="text-white font-bold">{tdeeVal}</span> kcal
        </div>
        <div className="text-sm text-[#8EA4D2] mt-1">
          Cut (≈ -1 lb/week): <span className="text-white font-bold">{cut}</span> kcal · Gain: <span className="text-white font-bold">{gain}</span> kcal
        </div>

        {/* BMI row with colored badge */}
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="text-[#8EA4D2]">BMI:</div>
          <div className="text-2xl font-black">{bmi}</div>
          <span
            className="ml-1 px-2.5 py-1 rounded-full text-[11px] font-black border border-white/10"
            style={{ background: badge.bg, color: badge.color, boxShadow: badge.shadow }}
          >
            {badge.label}
          </span>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-[#8EA4D2]">Baseline ready. Neon/3D comes next.</footer>
    </main>
  );
}
