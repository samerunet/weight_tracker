"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = { href:string; label:string; color:string; icon:(active:boolean)=>JSX.Element };

const StrokeIcon = ({d, active, strokeWidth=2}:{d:string; active:boolean; strokeWidth?:number}) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
       className="mx-auto" style={{filter: active ? "drop-shadow(0 0 8px rgba(0,240,255,.9))" : "drop-shadow(0 0 6px rgba(255,255,255,.08))"}}>
    <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const items: Item[] = [
  {
    href:"/",
    label:"Home",
    color:"#00F5C8",
    icon:(a)=> <StrokeIcon active={a} d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5h-5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8.5z" />
  },
  {
    href:"/log",
    label:"Log",
    color:"#FF00E5",
    icon:(a)=> <StrokeIcon active={a} d="M3 16l4-4 3 3 5-6 6 6" />
  },
  {
    href:"/trends",
    label:"Trends",
    color:"#7A77FF",
    icon:(a)=> <StrokeIcon active={a} d="M4 16V8m0 8l4-2 4-5 4 3 4-6" />
  },
  {
    href:"/workouts",
    label:"Workouts",
    color:"#00F0FF",
    icon:(a)=> <StrokeIcon active={a} d="M7 12a3 3 0 1 0 6 0m-3-5a3 3 0 1 0 0 6m8 7H6" />
  },
  {
    href:"/settings",
    label:"Settings",
    color:"#FF4DFF",
    icon:(a)=> <StrokeIcon active={a} d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 0v2l-2 1-1 2h-2l-2-1-2 1H8l-1-2-2-1v-2l2-1 .5-1.5L6 11v-2l2-1 1-2h2l2 1 2-1h2l1 2 2 1v2l-2 1-.5 1.5.5 1.5 2 1Z" strokeWidth={1.4} />
  },
];

export default function BottomNav(){
  const path = usePathname();
  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-[720px] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pointer-events-auto">
        <div className="relative rounded-[18px] bg-[rgba(6,8,20,.88)] border border-white/10 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 rounded-[18px]"
               style={{boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 36px rgba(255,0,229,0.12), 0 0 42px rgba(0,240,255,0.12)"}}/>
          <nav className="relative grid grid-cols-5 gap-1 py-3">
            {items.map((it)=> {
              const active = path === it.href;
              return (
                <Link key={it.href} href={it.href}
                      className="group flex flex-col items-center gap-1 py-1 text-[13px] font-semibold">
                  <span className="transition" style={{color: it.color}}>
                    {it.icon(active)}
                  </span>
                  <span className="text-[13px]"
                        style={{color: active ? "#D6E2FF" : "rgba(214,226,255,.85)", textShadow: active ? "0 0 10px rgba(155,239,255,.75)" : "none"}}>
                    {it.label}
                  </span>
                </Link>
              );
            })}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1 h-[6px] w-[120px] rounded-full"
                 style={{background:"linear-gradient(90deg,rgba(0,240,255,.0),rgba(0,240,255,.9),rgba(0,240,255,.0))",
                         boxShadow:"0 0 14px rgba(0,240,255,.75), 0 0 28px rgba(0,240,255,.35)"}}/>
          </nav>
        </div>
      </div>
    </div>
  );
}
