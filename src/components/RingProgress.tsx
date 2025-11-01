"use client";
import React from "react";

type Props = {
	/** 0..1 progress */
	value?: number;
	/** square size in px */
	size?: number;
	/** ring thickness in px */
	thickness?: number;
	/** where the arc starts (deg). -135 ≈ teal start low-left like your shot */
	startAngle?: number;
	/** length of the hot (red) segment in degrees */
	hotSpanDeg?: number;
};

export default function RingProgress({
	value = 0.67,
	size = 252,
	thickness = 22,
	startAngle = -135,
	hotSpanDeg = 44, // how much of the end is red/orange
}: Props) {
	const v = Math.max(0, Math.min(1, value));
	const r = (size - thickness) / 2;
	const cx = size / 2;
	const cy = size / 2;

	// helpers for arc paths (so we can precisely place the red cap)
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const pt = (deg: number, radius = r) => ({
		x: cx + radius * Math.cos(toRad(deg)),
		y: cy + radius * Math.sin(toRad(deg)),
	});
	const arcPath = (a0: number, a1: number, radius = r) => {
		const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
		const p0 = pt(a0, radius);
		const p1 = pt(a1, radius);
		// Always sweep clockwise (flag 1)
		return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
	};

	// angles for main & hot segments
	const endDeg = startAngle + 360 * v;
	const hotStart = Math.max(startAngle, endDeg - hotSpanDeg); // clamp inside progress
	const coolEnd = Math.max(startAngle, hotStart); // cool (cyan→violet) goes up to start of hot

	// flare position
	const flare = pt(endDeg);

	// small glossy shine path slightly outside the ring
	const shineRadius = r + thickness * 0.28;
	const shineStart = endDeg - Math.min(18, hotSpanDeg * 0.5);
	const shineEnd = endDeg + 6; // tiny overshoot for glint

	return (
		<div style={{ width: size, height: size }} className='relative mx-auto'>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<defs>
					{/* main arc gradient: cyan -> violet -> magenta */}
					<linearGradient id='coolGrad' x1='0' y1='0' x2='1' y2='1'>
						<stop offset='0%' stopColor='#00F0FF' />
						<stop offset='58%' stopColor='#7A77FF' />
						<stop offset='100%' stopColor='#C855FF' />
					</linearGradient>

					{/* hot cap gradient: red/orange -> pink/magenta */}
					<linearGradient id='hotGrad' x1='0' y1='0' x2='1' y2='1'>
						<stop offset='0%' stopColor='#FF5A3D' />
						<stop offset='55%' stopColor='#FF3B83' />
						<stop offset='100%' stopColor='#FF4DFF' />
					</linearGradient>

					{/* glossy shine (white → transparent) */}
					<linearGradient id='shineGrad' x1='0' y1='0' x2='1' y2='1'>
						<stop offset='0%' stopColor='rgba(255,255,255,.85)' />
						<stop offset='60%' stopColor='rgba(255,255,255,.15)' />
						<stop offset='100%' stopColor='rgba(255,255,255,0)' />
					</linearGradient>

					{/* depth glows */}
					<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
						<feGaussianBlur stdDeviation='3' result='b' />
						<feMerge>
							<feMergeNode in='b' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>
					<filter id='hotGlow' x='-50%' y='-50%' width='200%' height='200%'>
						<feGaussianBlur stdDeviation='4.5' result='b' />
						<feMerge>
							<feMergeNode in='b' />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>

					{/* soft halo behind ring */}
					<radialGradient id='sunHalo' cx='50%' cy='50%' r='52%'>
						<stop offset='0%' stopColor='#00F0FF' stopOpacity='.20' />
						<stop offset='45%' stopColor='#7A77FF' stopOpacity='.14' />
						<stop offset='100%' stopColor='#000' stopOpacity='0' />
					</radialGradient>

					{/* bright flare dot */}
					<radialGradient id='flare' cx='50%' cy='50%' r='50%'>
						<stop offset='0%' stopColor='#FFFFFF' stopOpacity='.95' />
						<stop offset='60%' stopColor='#FF4DFF' stopOpacity='.55' />
						<stop offset='100%' stopColor='#000' stopOpacity='0' />
					</radialGradient>
				</defs>

				{/* depth + halo */}
				<circle cx={cx} cy={cy} r={r + thickness * 0.62} fill='url(#sunHalo)' />
				<circle
					cx={cx}
					cy={cy}
					r={r - thickness * 0.5}
					fill='rgba(0,0,0,.35)'
				/>

				{/* base track (full circle) */}
				<circle
					cx={cx}
					cy={cy}
					r={r}
					stroke='#101527'
					strokeWidth={thickness}
					fill='none'
				/>

				{/* COOL segment (cyan→violet), only if there's room before the hot cap */}
				{coolEnd > startAngle && (
					<path
						d={arcPath(startAngle, coolEnd)}
						stroke='url(#coolGrad)'
						strokeWidth={thickness}
						strokeLinecap='round'
						fill='none'
						filter='url(#glow)'
					/>
				)}

				{/* HOT segment (red/orange → magenta) with stronger glow */}
				{v > 0 && (
					<path
						d={arcPath(hotStart, endDeg)}
						stroke='url(#hotGrad)'
						strokeWidth={thickness}
						strokeLinecap='round'
						fill='none'
						filter='url(#hotGlow)'
					/>
				)}

				{/* glossy shine line slightly outside the ring, short sweep */}
				{v > 0 && (
					<path
						d={arcPath(shineStart, shineEnd, shineRadius)}
						stroke='url(#shineGrad)'
						strokeWidth={Math.max(6, thickness * 0.28)}
						strokeLinecap='round'
						fill='none'
						opacity='.9'
						filter='url(#glow)'
					/>
				)}

				{/* flare dot at arc end */}
				<circle cx={flare.x} cy={flare.y} r={9} fill='url(#flare)' />
			</svg>

			{/* center copy */}
			<div className='absolute inset-0 flex flex-col items-center justify-center'>
				<div className='text-[18px] font-extrabold tracking-wide text-[var(--text)] drop-shadow-[0_0_8px_rgba(125,234,255,.75)]'>
					Progress
				</div>
				<div className='text-[44px] leading-none font-black text-[#9BEFFF] drop-shadow-[0_0_12px_rgba(0,240,255,.75)] mt-1'>
					{Math.round(v * 100)}%
				</div>
				<div className='text-[var(--sub)] text-[16px] mt-1'>· To Goal</div>
			</div>
		</div>
	);
}
