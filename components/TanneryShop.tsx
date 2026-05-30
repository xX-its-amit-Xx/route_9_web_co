"use client";
import { useVisible } from "@/hooks/useVisible";
import { useAnimation } from "@/hooks/useAnimation";

const W = 1280, H = 520;

const WALL   = "#221610";
const BEAM_C = "#150c06";
const FLOOR  = "#3c2810";
const BARK   = "#5a3a18";
const STONE  = "#8c8478";
const STONE_D= "#6c6458";
const HIDE_W = "#e8e0cc";   // raw / limed
const HIDE_T = "#c49858";   // bated / mid
const HIDE_L = "#8a5228";   // tanned leather
const IRON   = "#2a2520";

// 3 pit stages: LIMING → BATING → TANNING
const PIT_CXS  = [388, 606, 824] as const;
const PIT_LIQ  = ["#c0d49a", "#b08e44", "#7a4a1a"] as const;
const PIT_DEEP = ["#84a060", "#8a6420", "#502e0c"] as const;
const PIT_LBL  = ["LIMING", "BATING", "TANNING"]  as const;
const PIT_TW   = 156;     // top full-width
const PIT_BW   = 116;
const PIT_TOP_Y = 308;
const PIT_H     = 94;

// Bark grinding mill (left)
const MILL_CX  = 180;
const MILL_GRD = 388;   // ground level of mill bed
const MILL_TRX = 106;   // orbital radius X
const MILL_TRY = 21;    // orbital radius Y (perspective foreshorten)
const STONE_R  = 52;

// Beams above pits for draping hides
const HIDE_BEAM_Y = 142;

// Stretching frames (right)
const FRAME_XS  = [958, 1070, 1182] as const;
const FRAME_Y1  = 152;
const FRAME_W   = 72;
const FRAME_H   = 224;

// Workers
const FLR_Y  = 432;
const WRK1_X = 284;   // mill sweep worker
const WRK2_X = 498;   // pit worker

// Smoke / vapour tuples [phaseOff, xDrift, speed] from lime pit
type VM3 = [number, number, number];
const VAPOURS: VM3[] = [[0, 10, 1.3], [46, -12, 1.0], [90, 6, 1.6]];

// Stone face: radial grooves at 6 fixed angles
const STONE_GROOVES = [0, 60, 120, 180, 240, 300] as const;

export function TanneryShop() {
  const { ref, visible } = useVisible();
  const phase = useAnimation(visible);

  // Bark mill – stone orbiting the central bed
  const millAng   = phase * 0.028;                          // ~0.84 rad/s orbital
  const stoneCX   = MILL_CX + Math.cos(millAng) * MILL_TRX;
  const stoneCY   = MILL_GRD - STONE_R + Math.sin(millAng) * MILL_TRY;
  const stoneRot  = (millAng * (MILL_TRX / STONE_R) * 180 / Math.PI) % 360;
  // Sweep arm end (where worker pushes)
  const sweepEndX = MILL_CX + Math.cos(millAng + 0.38) * (MILL_TRX + 48);
  const sweepEndY = MILL_GRD - STONE_R * 0.5 + Math.sin(millAng + 0.38) * (MILL_TRY + 10);

  // Pit ripple phases (offset per pit)
  const rip0 = Math.sin(phase * 0.17)       * 3;
  const rip1 = Math.sin(phase * 0.21 + 1.2) * 3;
  const rip2 = Math.sin(phase * 0.14 + 2.5) * 3;
  const ripples = [rip0, rip1, rip2] as const;

  // Hide being worked in bating pit (slow up/down)
  const hideOsc = Math.sin(phase * 0.031) * 18;

  // Worker 1 (mill sweep) – arm follows sweep arm end
  const W1_SHD_X = WRK1_X + 6, W1_SHD_Y = FLR_Y - 174;
  const w1dx = sweepEndX - W1_SHD_X, w1dy = sweepEndY - W1_SHD_Y;
  const w1Dist = Math.min(Math.sqrt(w1dx * w1dx + w1dy * w1dy), 74);
  const w1Base = Math.atan2(w1dy, w1dx);
  const w1Cos  = Math.max(-1, Math.min(1, (w1Dist * w1Dist + 38 * 38 - 34 * 34) / (2 * w1Dist * 38)));
  const w1Bend = Math.acos(w1Cos);
  const w1UA   = w1Base - w1Bend;
  const w1ElbX = W1_SHD_X + Math.cos(w1UA) * 38;
  const w1ElbY = W1_SHD_Y + Math.sin(w1UA) * 38;
  const w1FA   = Math.atan2(sweepEndY - w1ElbY, sweepEndX - w1ElbX);

  // Worker 2 (pit paddle) – arm dips into bating pit at oscillating depth
  const W2_SHD_X = WRK2_X - 4, W2_SHD_Y = FLR_Y - 178;
  const padTgtX = (PIT_CXS[1] ?? 606) + Math.sin(phase * 0.028) * 22;
  const padTgtY = PIT_TOP_Y + 38 + hideOsc * 0.4;
  const w2dx = padTgtX - W2_SHD_X, w2dy = padTgtY - W2_SHD_Y;
  const w2Dist = Math.min(Math.sqrt(w2dx * w2dx + w2dy * w2dy), 74);
  const w2Base = Math.atan2(w2dy, w2dx);
  const w2Cos  = Math.max(-1, Math.min(1, (w2Dist * w2Dist + 38 * 38 - 34 * 34) / (2 * w2Dist * 38)));
  const w2Bend = Math.acos(w2Cos);
  const w2UA   = w2Base - w2Bend;
  const w2ElbX = W2_SHD_X + Math.cos(w2UA) * 38;
  const w2ElbY = W2_SHD_Y + Math.sin(w2UA) * 38;
  const w2FA   = Math.atan2(padTgtY - w2ElbY, padTgtX - w2ElbX);

  // Lime pit vapour
  const vap0 = Math.sin(phase * 0.16) * 4;

  return (
    <section className="w-full overflow-hidden" style={{ background: WALL }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-label="Shrewsbury Tannery, colonial leather works, c. 1768"
      >
        <defs>
          {/* Pit liquor gradients */}
          {([0, 1, 2] as const).map(i => (
            <linearGradient key={`tw-pit${i}`} id={`tw-pit${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={PIT_LIQ[i]  ?? "#b08e44"} stopOpacity="0.96" />
              <stop offset="100%" stopColor={PIT_DEEP[i] ?? "#8a6420"} />
            </linearGradient>
          ))}
          {/* Stone face gradient */}
          <radialGradient id="tw-stone" cx="38%" cy="32%" r="64%">
            <stop offset="0%"   stopColor="#b0a898" />
            <stop offset="60%"  stopColor={STONE}   />
            <stop offset="100%" stopColor={STONE_D}  />
          </radialGradient>
          {/* Bark mill bed */}
          <radialGradient id="tw-bed" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#8a6438" />
            <stop offset="100%" stopColor="#4a3018" />
          </radialGradient>
          {/* Leather hide gradient */}
          <linearGradient id="tw-hide-t" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#d8b870" />
            <stop offset="100%" stopColor={HIDE_T}  />
          </linearGradient>
          <linearGradient id="tw-hide-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#a86840" />
            <stop offset="100%" stopColor={HIDE_L}  />
          </linearGradient>
          {/* Oak bark pile shading */}
          <radialGradient id="tw-bark" cx="50%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#8a5a2a" />
            <stop offset="100%" stopColor="#3a2010" />
          </radialGradient>
          {/* Vapour / steam blur */}
          <filter id="tw-vap" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          {/* Stone shadow */}
          <filter id="tw-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="4" dy="6" stdDeviation="4" floodColor="#0a0604" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* ── Background ── */}
        <rect width={W} height={H} fill={WALL} />
        {/* Plank lines */}
        {[52, 104, 156, 208, 260, 312, 364, 416].map((y, i) =>
          <line key={i} x1={0} y1={y} x2={W} y2={y} stroke={BEAM_C} strokeWidth={1.5} opacity={0.45} />
        )}
        {/* Ceiling beams */}
        {[0, 280, 576, 870, 1110].map((x, i) =>
          <rect key={i} x={x} y={0} width={170} height={50} fill={BEAM_C} />
        )}
        {/* Floor */}
        <rect x={0} y={FLR_Y} width={W} height={H - FLR_Y} fill={FLOOR} />
        {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map((x, i) =>
          <line key={i} x1={x} y1={FLR_Y} x2={x} y2={H} stroke={BEAM_C} strokeWidth={1} opacity={0.35} />
        )}

        {/* ── Bark Grinding Mill ── */}
        {/* Elevated mill platform */}
        <rect x={42} y={MILL_GRD - 8} width={298} height={FLR_Y - MILL_GRD + 8} fill="#3a2410" stroke={BEAM_C} strokeWidth={1} />
        <rect x={42} y={MILL_GRD - 12} width={298} height={12} fill="#5a3818" />

        {/* Mill bed – circular bark grinding track */}
        <ellipse cx={MILL_CX} cy={MILL_GRD - 12} rx={MILL_TRX + STONE_R + 12} ry={MILL_TRY + 14} fill="url(#tw-bed)" />
        {/* Central post */}
        <rect x={MILL_CX - 7} y={186} width={14} height={MILL_GRD - 186} fill="#4a2e12" stroke="#2a1808" strokeWidth={1} />
        <circle cx={MILL_CX} cy={186} r={8} fill="#3a2810" />

        {/* Sweep arm (center → slightly past stone) */}
        <line
          x1={MILL_CX} y1={MILL_GRD - 18}
          x2={sweepEndX} y2={sweepEndY}
          stroke="#5a3218" strokeWidth={8} strokeLinecap="round"
        />

        {/* Bark pile on mill bed */}
        <ellipse cx={MILL_CX} cy={MILL_GRD - 16} rx={MILL_TRX - 8} ry={MILL_TRY - 2}
          fill="url(#tw-bark)" opacity={0.7}
        />

        {/* Stone shadow on bed (drawn before stone) */}
        <ellipse cx={stoneCX + 5} cy={MILL_GRD - 10} rx={STONE_R - 6} ry={10}
          fill="#1a0e06" opacity={0.55}
        />

        {/* Rolling stone wheel */}
        <g transform={`translate(${stoneCX}, ${stoneCY})`}>
          <circle r={STONE_R} fill="url(#tw-stone)" filter="url(#tw-shadow)" />
          {/* Face grooves rotating */}
          <g transform={`rotate(${stoneRot})`}>
            {STONE_GROOVES.map(ang => {
              const rad = ang * Math.PI / 180;
              return (
                <line key={ang}
                  x1={0} y1={0}
                  x2={Math.cos(rad) * (STONE_R - 6)} y2={Math.sin(rad) * (STONE_R - 6)}
                  stroke={STONE_D} strokeWidth={2} opacity={0.6}
                />
              );
            })}
            <circle r={8} fill={STONE_D} />
            <circle r={4} fill="#4a4440" />
          </g>
          {/* Stone rim highlight */}
          <circle r={STONE_R} fill="none" stroke="#a09888" strokeWidth={2} opacity={0.5} />
        </g>

        {/* Oak bark pile (left of mill) */}
        <ellipse cx={80} cy={FLR_Y - 18} rx={56} ry={20} fill="url(#tw-bark)" />
        <ellipse cx={76} cy={FLR_Y - 30} rx={36} ry={12} fill="#7a5030" opacity={0.8} />
        {/* Bark texture marks */}
        {([0, 1, 2, 3, 4, 5, 6, 7] as const).map(bi => {
          const bx = 44 + bi * 10 + (bi % 3) * 6;
          return <line key={bi} x1={bx} y1={FLR_Y - 14} x2={bx + 8} y2={FLR_Y - 22} stroke={BARK} strokeWidth={1.5} opacity={0.6} />;
        })}

        {/* ── Worker 1: Mill sweep ── */}
        <line x1={WRK1_X - 7} y1={FLR_Y - 78} x2={WRK1_X - 10} y2={FLR_Y} stroke="#3a2010" strokeWidth={12} strokeLinecap="round" />
        <line x1={WRK1_X + 7} y1={FLR_Y - 78} x2={WRK1_X + 4}  y2={FLR_Y} stroke="#4a2818" strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={WRK1_X - 10} cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <ellipse cx={WRK1_X + 4}  cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <rect x={WRK1_X - 15} y={W1_SHD_Y} width={30} height={FLR_Y - 78 - W1_SHD_Y} fill="#4a2e18" rx={3} />
        {/* Work apron */}
        <path d={`M ${WRK1_X - 12} ${W1_SHD_Y + 18} L ${WRK1_X - 9} ${FLR_Y - 84}
                  L ${WRK1_X + 9} ${FLR_Y - 84} L ${WRK1_X + 12} ${W1_SHD_Y + 18} Z`}
          fill="#6a4020" opacity={0.9}
        />
        {/* Left arm */}
        <line x1={WRK1_X - 10} y1={W1_SHD_Y + 7} x2={WRK1_X - 16} y2={W1_SHD_Y + 52}
          stroke="#3a2010" strokeWidth={10} strokeLinecap="round"
        />
        {/* Right arm IK → sweep */}
        <line x1={W1_SHD_X} y1={W1_SHD_Y + 7} x2={w1ElbX} y2={w1ElbY} stroke="#3a2010" strokeWidth={10} strokeLinecap="round" />
        <line x1={w1ElbX} y1={w1ElbY}
          x2={w1ElbX + Math.cos(w1FA) * 34} y2={w1ElbY + Math.sin(w1FA) * 34}
          stroke="#3a2010" strokeWidth={9} strokeLinecap="round"
        />
        {/* Head */}
        <circle cx={WRK1_X + 2} cy={W1_SHD_Y - 22} r={17} fill="#b87a4a" />
        {/* Felt hat */}
        <ellipse cx={WRK1_X + 2} cy={W1_SHD_Y - 28} rx={20} ry={6} fill="#2a1e12" />
        <rect x={WRK1_X - 11} y={W1_SHD_Y - 48} width={26} height={22} fill="#2a1e12" rx={2} />
        <circle cx={WRK1_X - 4} cy={W1_SHD_Y - 18} r={2} fill="#7a3e1e" />
        <circle cx={WRK1_X + 8} cy={W1_SHD_Y - 18} r={2} fill="#7a3e1e" />

        {/* ── Overhead hide-drying beams ── */}
        <rect x={326} y={HIDE_BEAM_Y} width={636} height={12} fill={BEAM_C} />
        <rect x={326} y={HIDE_BEAM_Y + 56} width={636} height={10} fill={BEAM_C} />
        {/* Vertical supports from ceiling */}
        {([388, 540, 692, 844, 920] as const).map((sx, si) =>
          <rect key={si} x={sx - 4} y={0} width={8} height={HIDE_BEAM_Y + 4} fill={BEAM_C} />
        )}

        {/* Hides draped over top beam */}
        {([0, 1, 2, 3] as const).map(hi => {
          const hx = 348 + hi * 148;
          const sway = Math.sin(phase * 0.024 + hi * 1.3) * 4;
          const clr = [HIDE_W, HIDE_T, HIDE_L, HIDE_T][hi] ?? HIDE_T;
          return (
            <g key={`hd${hi}`} transform={`translate(${sway}, 0)`}>
              {/* Left half drape */}
              <path
                d={`M ${hx - 44} ${HIDE_BEAM_Y + 6} Q ${hx - 52} ${HIDE_BEAM_Y + 88} ${hx - 38} ${HIDE_BEAM_Y + 130}
                    L ${hx - 12} ${HIDE_BEAM_Y + 130} Q ${hx - 10} ${HIDE_BEAM_Y + 80} ${hx} ${HIDE_BEAM_Y + 10} Z`}
                fill={clr} opacity={0.88} stroke="#8a6840" strokeWidth={0.5}
              />
              {/* Right half drape */}
              <path
                d={`M ${hx + 44} ${HIDE_BEAM_Y + 6} Q ${hx + 52} ${HIDE_BEAM_Y + 88} ${hx + 38} ${HIDE_BEAM_Y + 130}
                    L ${hx + 12} ${HIDE_BEAM_Y + 130} Q ${hx + 10} ${HIDE_BEAM_Y + 80} ${hx} ${HIDE_BEAM_Y + 10} Z`}
                fill={clr} opacity={0.85} stroke="#8a6840" strokeWidth={0.5}
              />
              {/* Hide texture (a few wrinkle lines) */}
              <line x1={hx - 28} y1={HIDE_BEAM_Y + 30} x2={hx - 20} y2={HIDE_BEAM_Y + 90}
                stroke="#a08060" strokeWidth={0.8} opacity={0.4}
              />
              <line x1={hx + 20} y1={HIDE_BEAM_Y + 30} x2={hx + 28} y2={HIDE_BEAM_Y + 90}
                stroke="#a08060" strokeWidth={0.8} opacity={0.4}
              />
            </g>
          );
        })}

        {/* ── Tanning Pits ── */}
        {([0, 1, 2] as const).map(pi => {
          const cx  = PIT_CXS[pi] ?? 606;
          const hw  = PIT_TW / 2;
          const bhw = PIT_BW / 2;
          const ty  = PIT_TOP_Y;
          const by  = ty + PIT_H;
          const rip = ripples[pi] ?? 0;

          return (
            <g key={`pit${pi}`}>
              {/* Pit frame (oak timber border) */}
              <rect x={cx - hw - 6} y={ty - 8} width={PIT_TW + 12} height={8} fill="#5a3818" stroke="#3a2010" strokeWidth={1} />
              {/* Pit sides in perspective */}
              <path d={`M ${cx - hw} ${ty} L ${cx - bhw} ${by} L ${cx - bhw - 4} ${by + 8} L ${cx - hw - 4} ${ty} Z`}
                fill="#3a2208"
              />
              <path d={`M ${cx + hw} ${ty} L ${cx + bhw} ${by} L ${cx + bhw + 4} ${by + 8} L ${cx + hw + 4} ${ty} Z`}
                fill="#4a2e10"
              />
              {/* Pit floor */}
              <path d={`M ${cx - bhw} ${by} L ${cx + bhw} ${by} L ${cx + bhw} ${by + 8} L ${cx - bhw} ${by + 8} Z`}
                fill="#2a1608"
              />
              {/* Liquor fill */}
              <path d={`M ${cx - hw} ${ty} L ${cx - bhw} ${by} L ${cx + bhw} ${by} L ${cx + hw} ${ty} Z`}
                fill={`url(#tw-pit${pi})`}
              />
              {/* Liquor surface ripple */}
              <ellipse cx={cx} cy={ty + rip + 4} rx={hw - 4} ry={10}
                fill={PIT_LIQ[pi] ?? "#b08e44"} opacity={0.82}
              />
              <ellipse cx={cx - 18} cy={ty + rip * 0.6 + 3} rx={22} ry={4}
                fill="#fff8d8" opacity={0.20}
              />
              {/* Hide being worked in bating pit */}
              {pi === 1 && (
                <rect
                  x={cx - 34} y={ty + 16 + hideOsc * 0.5}
                  width={68} height={PIT_H - 28}
                  fill={HIDE_T} opacity={0.72} rx={4}
                />
              )}
              {/* Label below pit */}
              <text x={cx} y={by + 24} textAnchor="middle"
                fill="#a07848" fontSize={9} fontFamily="Georgia, serif" letterSpacing="1.5">
                {PIT_LBL[pi] ?? "PIT"}
              </text>
            </g>
          );
        })}

        {/* Lime pit vapour / steam */}
        {VAPOURS.map(([phOff, xDrift, spd], vi) => {
          const pit0cx = PIT_CXS[0] ?? 388;
          const vT  = ((phase * (spd ?? 1.3) + (phOff ?? 0) * 4) % 100) / 100;
          const vY  = PIT_TOP_Y - 4 - vT * 88;
          const vX  = pit0cx + vap0 + Math.sin(vT * Math.PI * 2.8 + (phOff ?? 0)) * (xDrift ?? 10);
          const vOp = vT < 0.18 ? vT / 0.18 * 0.28 : vT > 0.68 ? (1 - vT) / 0.32 * 0.28 : 0.28;
          return (
            <circle key={`v${vi}`} cx={vX} cy={vY} r={9 + vT * 16}
              fill="#c8e8c0" opacity={vOp} filter="url(#tw-vap)"
            />
          );
        })}

        {/* ── Worker 2: Pit paddle ── */}
        <line x1={WRK2_X - 7} y1={FLR_Y - 72} x2={WRK2_X - 10} y2={FLR_Y} stroke="#3a2010" strokeWidth={12} strokeLinecap="round" />
        <line x1={WRK2_X + 7} y1={FLR_Y - 72} x2={WRK2_X + 4}  y2={FLR_Y} stroke="#4a2818" strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={WRK2_X - 10} cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <ellipse cx={WRK2_X + 4}  cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <rect x={WRK2_X - 16} y={W2_SHD_Y} width={32} height={FLR_Y - 72 - W2_SHD_Y} fill="#3a2814" rx={3} />
        <path d={`M ${WRK2_X - 14} ${W2_SHD_Y + 16} L ${WRK2_X - 11} ${FLR_Y - 78}
                  L ${WRK2_X + 11} ${FLR_Y - 78} L ${WRK2_X + 14} ${W2_SHD_Y + 16} Z`}
          fill="#5a3818" opacity={0.88}
        />
        {/* Left arm */}
        <line x1={WRK2_X - 10} y1={W2_SHD_Y + 7} x2={WRK2_X - 22} y2={W2_SHD_Y + 48}
          stroke="#3a2010" strokeWidth={10} strokeLinecap="round"
        />
        {/* Right arm IK → paddle */}
        <line x1={W2_SHD_X} y1={W2_SHD_Y + 7} x2={w2ElbX} y2={w2ElbY} stroke="#3a2010" strokeWidth={10} strokeLinecap="round" />
        <line x1={w2ElbX} y1={w2ElbY}
          x2={w2ElbX + Math.cos(w2FA) * 34} y2={w2ElbY + Math.sin(w2FA) * 34}
          stroke="#3a2010" strokeWidth={9} strokeLinecap="round"
        />
        {/* Paddle handle → into pit */}
        <line
          x1={w2ElbX + Math.cos(w2FA) * 34} y1={w2ElbY + Math.sin(w2FA) * 34}
          x2={padTgtX} y2={padTgtY + 32}
          stroke="#6a4020" strokeWidth={3.5} strokeLinecap="round"
        />
        <ellipse cx={padTgtX} cy={padTgtY + 40} rx={12} ry={5} fill="#3a2010" />
        {/* Head */}
        <circle cx={WRK2_X} cy={W2_SHD_Y - 22} r={17} fill="#c8885a" />
        <ellipse cx={WRK2_X} cy={W2_SHD_Y - 28} rx={21} ry={16} fill="#e8dec8" />
        <ellipse cx={WRK2_X} cy={W2_SHD_Y - 30} rx={14} ry={10} fill="#ddd4be" />
        <circle cx={WRK2_X - 5} cy={W2_SHD_Y - 19} r={2} fill="#7a3e1e" />
        <circle cx={WRK2_X + 7} cy={W2_SHD_Y - 19} r={2} fill="#7a3e1e" />
        <path d={`M ${WRK2_X - 4} ${W2_SHD_Y - 12} Q ${WRK2_X + 1} ${W2_SHD_Y - 8} ${WRK2_X + 6} ${W2_SHD_Y - 12}`}
          fill="none" stroke="#7a3e1e" strokeWidth={1.2}
        />

        {/* ── Stretching Frames (right) ── */}
        {([0, 1, 2] as const).map(fi => {
          const fx = FRAME_XS[fi] ?? 1070;
          const fc = [HIDE_W, HIDE_T, "url(#tw-hide-l)"][fi] ?? "url(#tw-hide-l)";
          const laceColor = ["#c8c0a8", "#a88040", "#7a4828"][fi] ?? "#a88040";
          return (
            <g key={`fr${fi}`}>
              {/* Frame outer border */}
              <rect x={fx - FRAME_W / 2 - 4} y={FRAME_Y1 - 4} width={FRAME_W + 8} height={FRAME_H + 8}
                fill="#4a2a10" stroke="#2a1808" strokeWidth={2} rx={2}
              />
              {/* Stretched hide */}
              <rect x={fx - FRAME_W / 2} y={FRAME_Y1} width={FRAME_W} height={FRAME_H}
                fill={fc} rx={2}
              />
              {/* Hide texture marks */}
              <line x1={fx - 20} y1={FRAME_Y1 + 40}  x2={fx + 20} y2={FRAME_Y1 + 60}
                stroke={laceColor} strokeWidth={0.7} opacity={0.4}
              />
              <line x1={fx - 24} y1={FRAME_Y1 + 100} x2={fx + 22} y2={FRAME_Y1 + 115}
                stroke={laceColor} strokeWidth={0.7} opacity={0.4}
              />
              <line x1={fx - 18} y1={FRAME_Y1 + 160} x2={fx + 18} y2={FRAME_Y1 + 170}
                stroke={laceColor} strokeWidth={0.7} opacity={0.4}
              />
              {/* Lacing around frame edge */}
              {([0, 1, 2, 3, 4, 5] as const).map(li => {
                const ly = FRAME_Y1 + 20 + li * (FRAME_H - 40) / 5;
                return (
                  <g key={li}>
                    <circle cx={fx - FRAME_W / 2 - 2} cy={ly} r={3} fill={laceColor} opacity={0.7} />
                    <circle cx={fx + FRAME_W / 2 + 2} cy={ly} r={3} fill={laceColor} opacity={0.7} />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Tanning tools on right wall */}
        {/* Fleshing beam */}
        <rect x={920} y={FLR_Y - 96} width={18} height={90} fill="#5a3218" rx={3} />
        <ellipse cx={929} cy={FLR_Y - 96} rx={18} ry={5} fill="#6a3e20" />
        {/* Tool rack */}
        <rect x={1238} y={148} width={8} height={268} fill="#3a2010" />
        {([172, 230, 288, 346, 382] as const).map((ty, ti) => (
          <g key={ti}>
            <line x1={1220} y1={ty} x2={1240} y2={ty} stroke="#5a3818" strokeWidth={2} />
            <rect x={1188} y={ty - 12} width={32} height={3} fill="#8a6030" rx={1} />
          </g>
        ))}

        {/* Bark bucket near pits */}
        <rect x={498} y={FLR_Y - 42} width={28} height={38} fill="#4a2a10" rx={2} stroke="#3a1e08" strokeWidth={1} />
        <ellipse cx={512} cy={FLR_Y - 42} rx={14} ry={5} fill="#6a3e18" />

        {/* Sign */}
        <rect x={418} y={H - 50} width={444} height={36} fill="#2a1608" stroke="#7a4a20" strokeWidth={1.5} rx={2} />
        <text x={640} y={H - 28} textAnchor="middle" fill="#d4a040" fontSize={13}
          fontFamily="Georgia, serif" letterSpacing="2">
          SHREWSBURY TANNERY · EST. 1768
        </text>
        <text x={640} y={H - 8} textAnchor="middle" fill="#8a6040" fontSize={9}
          fontFamily="Georgia, serif" letterSpacing="1.5">
          OAK BARK · LIMING · BATING · SOLE LEATHER · HARNESS · COLONIAL NEW ENGLAND
        </text>
      </svg>
    </section>
  );
}
