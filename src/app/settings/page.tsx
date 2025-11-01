"use client";
import React, { useEffect, useMemo, useState } from "react";
import UnitToggle from "@/components/UnitToggle";
import { Activity, Sex, Unit } from "@/lib/formulas";

type Entry = { date: string; weightLb: number };
type State = {
  name?: string;
  profile: { sex: Sex; age: number; heightIn: number; activity: Activity };
  startDate?: string;
  targetDate?: string;
  startWeightLb: number;
  targetWeightLb: number;
  entries: Entry[];
};

const KEY = "neon_weight_state_v1";
const UNIT_KEY = "neon_weight_unit";

export default function SettingsPage(){
  const [unit, setUnit] = useState<Unit>("lb");
  const [state, setState] = useState<State | null>(null);

  useEffect(()=>{ try{ const s=localStorage.getItem(KEY); if(s) setState(JSON.parse(s)); }catch{} },[]);
  useEffect(()=>{ try{ const u=localStorage.getItem(UNIT_KEY) as Unit|null; if(u) setUnit(u); }catch{} },[]);

  const latestLb = state?.entries?.[state.entries.length-1]?.weightLb ?? state?.startWeightLb ?? 0;

  const display = (lb:number, dp=1)=> unit==="kg" ? (lb*0.45359237).toFixed(dp) : lb.toFixed(dp);
  const parseToLb = (str:string)=> {
    const v = parseFloat(str);
    if (!isFinite(v)) return 0;
    return unit==="kg" ? v/0.45359237 : v;
  };

  function save(){
    if(!state) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    try { localStorage.setItem(UNIT_KEY, unit); } catch {}
    alert("Settings saved.");
  }

  if(!state){
    return <main className="max-w-[720px] mx-auto p-4">No data yet. Log a weight on Home.</main>;
  }

  return (
    <main className="max-w-[720px] mx-auto p-4 space-y-4 pb-28">
      <header className="flex items-center justify-between">
        <h1 className="text-[#9BEFFF] text-lg font-black tracking-wider">SETTINGS</h1>
        <UnitToggle unit={unit} onChange={setUnit}/>
      </header>

      <section className="card space-y-3">
        <div className="font-black">Profile</div>
        <div className="grid grid-cols-2 gap-2">
          <input className="input col-span-2" placeholder="Name"
                 value={state.name ?? ""} onChange={e=>setState({...state, name:e.target.value})}/>
          <select className="input" value={state.profile.sex} onChange={e=>setState({...state, profile:{...state.profile, sex:e.target.value as Sex}})}>
            <option value="male">Male</option><option value="female">Female</option>
          </select>
          <select className="input" value={state.profile.activity} onChange={e=>setState({...state, profile:{...state.profile, activity:e.target.value as Activity}})}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="athlete">Athlete</option>
          </select>
          <input className="input" type="number" placeholder="Age"
                 value={state.profile.age} onChange={e=>setState({...state, profile:{...state.profile, age: parseInt(e.target.value)||0}})}/>
          <input className="input" type="number" placeholder="Height (in)"
                 value={state.profile.heightIn} onChange={e=>setState({...state, profile:{...state.profile, heightIn: parseFloat(e.target.value)||0}})}/>
        </div>
      </section>

      <section className="card space-y-3">
        <div className="font-black">Targets</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[#8EA4D2]">Start weight ({unit})</label>
            <input className="input" type="number"
                   value={display(state.startWeightLb)}
                   onChange={e=>setState({...state, startWeightLb: parseToLb(e.target.value)})}/>
          </div>
          <div>
            <label className="text-xs text-[#8EA4D2]">Target weight ({unit})</label>
            <input className="input" type="number"
                   value={display(state.targetWeightLb)}
                   onChange={e=>setState({...state, targetWeightLb: parseToLb(e.target.value)})}/>
          </div>
        </div>
        <div className="text-xs text-[#8EA4D2]">
          Current weight: <span className="text-[#D6E2FF] font-bold">{display(latestLb)}</span> {unit}
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={save} className="btn">Save Settings</button>
      </div>
    </main>
  );
}
