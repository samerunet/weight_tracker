"use client";
import React from "react";
import Link from "next/link";

type ButtonIconName = "plus" | "utensils";

const ButtonIcon = ({ name }: { name: ButtonIconName }) => {
  if (name === "plus") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
        <defs>
          <linearGradient id="btnGradPlus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#00FFA6" />
          </linearGradient>
        </defs>
        <path
          d="M9 4v10M4 9h10"
          stroke="url(#btnGradPlus)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
      <defs>
        <linearGradient id="btnGradUt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4DFF" />
          <stop offset="100%" stopColor="#FF9A58" />
        </linearGradient>
      </defs>
      <path
        d="M4.5 2.75v4.75a1.75 1.75 0 0 0 1.75 1.75h.5v6.5M9 2.5v6.5c0 1.24.88 2.25 1.96 2.25H12v4"
        stroke="url(#btnGradUt)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* Simple neon outline button */
export function NeonButton({
  label,
  variant = "cyan",
  className = "",
  onClick,
  icon,
}: {
  label: string;
  variant?: "cyan" | "pink";
  className?: string;
  onClick?: () => void;
  icon?: ButtonIconName;
}) {
  const tone = variant === "pink" ? "pink" : "cyan";
  return (
    <button
      onClick={onClick}
      className={`btn-neon ${tone} w-full text-[15px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 ${className}`}
    >
      {icon ? <ButtonIcon name={icon} /> : null}
      <span>{label}</span>
    </button>
  );
}

type TileIconName = "qr" | "dumbbell";

const TileIcon = ({ name }: { name: TileIconName }) => {
  if (name === "qr") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="tileGradQR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#00FFA6" />
          </linearGradient>
        </defs>
        <path
          d="M6 6h6v6H6zM20 6h6v6h-6zM6 20h6v6H6zM18 18h8v10"
          stroke="url(#tileGradQR)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M14 8h4M14 12h4M12 14v4m8-4v4" stroke="url(#tileGradQR)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <defs>
        <linearGradient id="tileGradDb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF00E5" />
          <stop offset="100%" stopColor="#FFA95F" />
        </linearGradient>
      </defs>
      <path
        d="M7 12v10M27 12v10M11 10v14M23 10v14M14 16h6"
        stroke="url(#tileGradDb)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* Glass tile */
export function NeonTile({
  children,
  className = "",
  tone = "cyan",
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "cyan" | "pink";
  icon?: TileIconName;
}) {
  const b = tone === "pink" ? "border-pink" : "border-cyan";
  return (
    <div className={`tile ${b} ${className}`}>
      {icon ? (
        <div className={`tile-icon ${tone === "pink" ? "icon-pink" : "icon-cyan"}`}>
          <TileIcon name={icon} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

/* Inline neon icons */
function Icon({ name }: { name: "home" | "log" | "trends" | "workouts" | "coach" }) {
  const stroke = "url(#g)";
  return (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="60%" stopColor="#7A77FF" />
          <stop offset="100%" stopColor="#FF00E5" />
        </linearGradient>
      </defs>
      {name === "home" && (
        <path
          d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-8z"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "log" && (
        <path
          d="M4 4h10l6 6v10H4z M14 4v6h6"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "trends" && (
        <path
          d="M4 18l5-6 3 3 6-8"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "workouts" && (
        <path
          d="M6 9h12M6 15h12M9 6v12M15 6v12"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {name === "coach" && (
        <path
          d="M12 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm7 12a7 7 0 1 0-14 0"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/* Bottom nav with neon icons */
export function BottomNav({
  active = "Home",
}: {
  active?: "Home" | "Log" | "Trends" | "Workouts" | "Coach" | "Profile";
}) {
  const items = ["Home", "Log", "Trends", "Workouts", "Coach"] as const;
  const href = (x: string) => (x === "Home" ? "/" : `/${x.toLowerCase()}`);
  const mapIcon: Record<(typeof items)[number], any> = {
    Home: "home",
    Log: "log",
    Trends: "trends",
    Workouts: "workouts",
    Coach: "coach",
  };

  return (
    <div
      className="bottom-nav"
    >
      {items.map((x) => (
        <Link
          key={x}
          href={href(x)}
          className={`nav-item ${active === x ? "active" : ""}`}
        >
          <Icon name={mapIcon[x]} />
          <span>{x}</span>
        </Link>
      ))}
    </div>
  );
}
