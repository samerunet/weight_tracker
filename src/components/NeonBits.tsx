"use client";
import React from "react";
import Link from "next/link";

export function NeonButton({label, tone="cyan"}:{label:string; tone?:"cyan"|"pink"}) {
  return <button className={`btn-neon ${tone} w-full text-[15px] tracking-wide`}>{label}</button>;
}
export function Tile({children, tone="cyan"}:{children:React.ReactNode; tone?:"cyan"|"pink"}) {
  return <div className={`tile ${tone}`}>{children}</div>;
}

function NavIcon({name}:{name:"home"|"log"|"trends"|"workouts"|"coach"}){
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="navg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F0FF"/><stop offset="60%" stopColor="#7A77FF"/><stop offset="100%" stopColor="#FF00E5"/>
        </linearGradient>
      </defs>
      {name==="home"     && <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-8z" fill="none" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {name==="log"      && <path d="M4 4h10l6 6v10H4z M14 4v6h6" fill="none" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {name==="trends"   && <path d="M4 18l5-6 3 3 6-8" fill="none" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {name==="workouts" && <path d="M6 9h12M6 15h12M9 6v12M15 6v12" fill="none" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
      {name==="coach"    && <path d="M12 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm7 12a7 7 0 1 0-14 0" fill="none" stroke="url(#navg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  );
}

export function BottomNav({active="Home"}:{active?:"Home"|"Log"|"Trends"|"Workouts"|"Coach"}) {
  const items = ["Home","Log","Trends","Workouts","Coach"] as const;
  const href = (x:string)=> x==="Home" ? "/" : `/${x.toLowerCase()}`;
  const icon: Record<typeof items[number], any> = {Home:"home",Log:"log",Trends:"trends",Workouts:"workouts",Coach:"coach"};
  return (
    <div className="bottom-nav">
      {items.map(x=>(
        <Link key={x} href={href(x)} className={`flex flex-col items-center gap-1 ${active===x?"text-[--baby]":"text-[--sub]"}`}>
          <NavIcon name={icon[x] as any} /><span className="text-[11px] font-bold">{x}</span>
        </Link>
      ))}
    </div>
  );
}
