"use client";
type Variant = "blue"|"magenta";
export default function StatCard({ label, value, unit, variant="blue" }:{
  label:string; value:string; unit?:string; variant?:Variant;
}) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}{unit && <span className="text-[13px] text-[var(--sub)] font-extrabold ml-1">{unit}</span>}
      </div>
      <div className="mt-1 h-[2px] w-10 rounded-full"
           style={{background:"linear-gradient(90deg, rgba(155,239,255,.85), transparent)"}}/>
    </div>
  );
}
