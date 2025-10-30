"use client";
import RingProgress from "@/components/RingProgress";
import StatCard from "@/components/StatCard";
import TrendChart from "@/components/TrendChart";
import { NeonButton, NeonTile, BottomNav } from "@/components/NeonBits";

export default function Page() {
  const kg = 84.4, cm = 178;
  const lb = Math.round(kg * 2.20462);
  const _bmi = Math.round((kg / Math.pow(cm/100,2)) * 10) / 10;
  const bf = "22,5";

  return (
    <main className="relative min-h-screen max-w-[720px] mx-auto px-3 sm:px-4">
      <div className="neon-vignette" />
      <div className="device-frame" />

      <div className="safe-wrap pt-5 pb-24">
        <header className="status-bar">
          <span className="status-time">11:11</span>
          <span className="moon-icon" aria-hidden />
        </header>

        <h1 className="mt-4 text-center text-[28px] sm:text-[34px] font-black tracking-[0.34em] text-[--baby]
                       drop-shadow-[0_0_22px_rgba(0,240,255,0.85)]">
          NEON FIT
        </h1>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          <StatCard
            label="Weight"
            value={String(lb)}
            unit="lb"
            variant="blue"
          />
          <StatCard
            label="BMI"
            value={String(_bmi)}
            variant="magenta"
          />
          <StatCard
            label="Body Fat"
            value={bf}
            unit="%"
            variant="violet"
          />
        </div>

        <div className="mt-7">
          <RingProgress value={0.67}/>
          <div className="mt-6">
            <TrendChart />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <NeonButton label="Add Weight" variant="cyan" icon="plus" />
          <NeonButton label="Log Meal" variant="pink" icon="utensils" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <NeonTile tone="cyan" icon="qr">
            <div className="tile-heading">Scan Food</div>
            <div className="tile-body">
              <div className="tile-number">2850 kcal</div>
              <div className="tile-caption">Daily Calorie Target</div>
            </div>
          </NeonTile>
          <NeonTile tone="pink" icon="dumbbell">
            <div className="tile-heading">Full Body</div>
            <div className="tile-meta">(3×/Week)</div>
            <div className="tile-caption">Intermediate Workout Plan</div>
            <div className="tile-mini-ring" />
          </NeonTile>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="pill neon">Targets</button>
          <button className="pill ghost">Coach</button>
        </div>
      </div>

      <BottomNav active="Home"/>
    </main>
  );
}
