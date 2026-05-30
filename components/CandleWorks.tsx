"use client";
import { useVisible } from "@/hooks/useVisible";
import { useAnimation } from "@/hooks/useAnimation";

const W = 1280, H = 520;

const WALL   = "#1e0f06";
const PLANK  = "#2a1609";
const BEAM   = "#130904";
const FLOOR  = "#3d2210";
const TALLOW = "#f0e4b0";
const IRON   = "#28231e";
const FIRE_A = "#e85c00";
const FIRE_B = "#ffc200";
const FIRE_C = "#fff4a8";
const CANDLE_C = "#f8f2dd";
const WICK_C   = "#2e1c08";
const BRICK_A  = "#8b3a20";
const BRICK_B  = "#6b2e18";

const FLR_Y = 432;

// Cauldron
const CAL_CX = 660, CAL_TY = 312, CAL_RX = 92, CAL_RY = 18, CAL_H = 74;
const CAL_BRX = 76;

// Brick furnace
const FUR_X1 = 540, FUR_X2 = 782, FUR_Y1 = 378;

// Dip bar
const DIP_X1 = 352, DIP_X2 = 892;
const DIP_Y_UP = 82, DIP_Y_DN = 268;
const DIP_CYCLE = 288;

// 8 candle positions on dip bar (split around cauldron gap)
const WICK_XS = [382, 432, 482, 532, 748, 798, 848, 878] as const;
const CAN_LEN = 108, CAN_HW = 5;

// Lever pivot (wall, left of dip bar)
const LEV_CX = 310, LEV_CY = 182, LEV_LEN = 96;

// Candle mold bench (left)
const BENCH_X1 = 44, BENCH_X2 = 268, BENCH_Y = 360;
const MOL_X1 = 66, MOL_X2 = 248, MOL_Y1 = 218, MOL_Y2 = 352;

// Shelf (right)
const SHF_X1 = 1022, SHF_X2 = 1238, SHF_Y1 = 222, SHF_Y2 = 302;

// Worker
const WRK_X = 236, WRK_HIP_Y = FLR_Y - 84, WRK_SHD_X = 240, WRK_SHD_Y = WRK_HIP_Y - 90, WRK_HD_CY = WRK_SHD_Y - 30;

// Apprentice
const APP_X = 848, APP_HIP_Y = FLR_Y - 78, APP_SHD_Y = APP_HIP_Y - 82, APP_HD_CY = APP_SHD_Y - 28;

// Smoke tuples [phaseOff, xDrift, speed]
type SM3 = [number, number, number];
const SMOKES: SM3[] = [[0, 14, 1.4], [44, -11, 1.1], [88, 6, 1.7]];

// Fire flame offsets/widths/heights/colors
const F_OFF  = [0, -24, 20, -8, 30] as const;
const F_WID  = [28, 18, 22, 14, 18] as const;
const F_CLR  = [FIRE_A, FIRE_B, FIRE_A, FIRE_C, FIRE_B] as const;

function dipEase(t: number): number {
  if (t < 0.28) return t / 0.28;
  if (t < 0.54) return 1;
  if (t < 0.78) return 1 - (t - 0.54) / 0.24;
  return 0;
}

export function CandleWorks() {
  const { ref, visible } = useVisible();
  const phase = useAnimation(visible);

  const dipT    = (phase % DIP_CYCLE) / DIP_CYCLE;
  const dip     = dipEase(dipT);
  const dipBarY = DIP_Y_UP + (DIP_Y_DN - DIP_Y_UP) * dip;

  // Lever angle follows dip (lever tip tracks rope → bar)
  const levAngDeg = -62 + dip * 68;
  const levAngRad = levAngDeg * Math.PI / 180;
  const levTipX   = LEV_CX + Math.cos(levAngRad) * LEV_LEN;
  const levTipY   = LEV_CY + Math.sin(levAngRad) * LEV_LEN;

  // Worker arm: upper-arm angle follows lever tip
  const wrk_dx = levTipX - WRK_SHD_X;
  const wrk_dy = levTipY - WRK_SHD_Y;
  const uaAng  = Math.atan2(wrk_dy, wrk_dx) - 0.22;
  const UA = 38, FA = 34;
  const elbX = WRK_SHD_X + Math.cos(uaAng) * UA;
  const elbY = WRK_SHD_Y + Math.sin(uaAng) * UA;
  const faAng = Math.atan2(levTipY - elbY, levTipX - elbX);

  // Fire
  const fl1 = Math.sin(phase * 0.21) * 9;
  const fl2 = Math.sin(phase * 0.31) * 6;
  const fl3 = Math.sin(phase * 0.17) * 5;
  const flH = 38 + fl1 + fl2;

  // Candle shelf flames
  const sf1 = Math.sin(phase * 0.19);
  const sf2 = Math.sin(phase * 0.27);

  // Tallow drip from rising candles
  const rising     = dipT > 0.54 && dipT < 0.78;
  const dripAlpha  = rising ? Math.min(1, (dipT - 0.54) / 0.1) * (1 - Math.max(0, (dipT - 0.68) / 0.1)) : 0;

  // Left arm sway
  const lSway = Math.sin(phase * 0.029) * 4;

  return (
    <section className="w-full overflow-hidden" style={{ background: WALL }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", maxHeight: 520 }}
        aria-label="Shrewsbury Candle Works, colonial tallow dipping, c. 1771"
      >
        <defs>
          <radialGradient id="cw-tallow" cx="50%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#fffbe8" />
            <stop offset="45%"  stopColor={TALLOW} />
            <stop offset="100%" stopColor="#c8b87a" />
          </radialGradient>
          <radialGradient id="cw-fireglow" cx="50%" cy="85%" r="55%">
            <stop offset="0%"   stopColor="#ff6000" stopOpacity="0.75" />
            <stop offset="55%"  stopColor="#c03000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#600000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cw-wax" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e4d8b0" />
            <stop offset="38%"  stopColor={CANDLE_C} />
            <stop offset="62%"  stopColor="#fff8e8" />
            <stop offset="100%" stopColor="#cfc090" />
          </linearGradient>
          <linearGradient id="cw-iron" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#3a3530" />
            <stop offset="50%"  stopColor={IRON} />
            <stop offset="100%" stopColor="#1a1512" />
          </linearGradient>
          <linearGradient id="cw-pewter" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#88858a" />
            <stop offset="50%"  stopColor="#b8b5c0" />
            <stop offset="100%" stopColor="#68656a" />
          </linearGradient>
          <radialGradient id="cw-warmamb" cx="52%" cy="65%" r="48%">
            <stop offset="0%"   stopColor="#ff8c20" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ff8c20" stopOpacity="0" />
          </radialGradient>
          <filter id="cw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
          <filter id="cw-smk" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <pattern id="cw-brick" width="48" height="24" patternUnits="userSpaceOnUse">
            <rect width="48" height="24" fill={BRICK_A} />
            <rect x="1"  y="1"  width="21" height="10" fill={BRICK_B} rx="1" />
            <rect x="25" y="1"  width="21" height="10" fill={BRICK_B} rx="1" />
            <rect x="13" y="13" width="21" height="10" fill={BRICK_B} rx="1" />
          </pattern>
        </defs>

        {/* ── Background ── */}
        <rect width={W} height={H} fill={WALL} />
        {[60,120,180,240,300,360,420].map((y, i) =>
          <line key={i} x1={0} y1={y} x2={W} y2={y} stroke={BEAM} strokeWidth={1.5} opacity={0.5} />
        )}
        {/* Ceiling beams */}
        {[0,260,560,840,1100].map((x, i) =>
          <rect key={i} x={x} y={0} width={160} height={54} fill={BEAM} />
        )}
        {/* Cross beam above dip bar */}
        <rect x={DIP_X1 - 22} y={46} width={DIP_X2 - DIP_X1 + 44} height={16} fill={BEAM} />

        {/* Floor */}
        <rect x={0} y={FLR_Y} width={W} height={H - FLR_Y} fill={FLOOR} />
        {[88,176,264,352,440,528,616,704,792,880,968,1056,1144,1232].map((x, i) =>
          <line key={i} x1={x} y1={FLR_Y} x2={x} y2={H} stroke={BEAM} strokeWidth={1} opacity={0.4} />
        )}

        {/* Warm ambient glow */}
        <rect width={W} height={H} fill="url(#cw-warmamb)" />

        {/* ── Candle Mold Station (left bench) ── */}
        <rect x={BENCH_X1} y={BENCH_Y} width={BENCH_X2 - BENCH_X1} height={15} fill="#5a2e10" stroke="#3a1c08" strokeWidth={1} />
        <rect x={BENCH_X1 + 10} y={BENCH_Y + 15} width={10} height={FLR_Y - BENCH_Y - 15} fill="#4a2208" />
        <rect x={BENCH_X2 - 20} y={BENCH_Y + 15} width={10} height={FLR_Y - BENCH_Y - 15} fill="#4a2208" />
        {/* Mold frame bars */}
        <rect x={MOL_X1} y={MOL_Y1}      width={MOL_X2 - MOL_X1} height={11} fill="#4a2a14" stroke="#2a1408" strokeWidth={1} />
        <rect x={MOL_X1} y={MOL_Y2}      width={MOL_X2 - MOL_X1} height={11} fill="#4a2a14" stroke="#2a1408" strokeWidth={1} />
        <rect x={MOL_X1} y={MOL_Y1 + 11} width={6} height={MOL_Y2 - MOL_Y1 - 11} fill="#3a1e0a" />
        <rect x={MOL_X2 - 6} y={MOL_Y1 + 11} width={6} height={MOL_Y2 - MOL_Y1 - 11} fill="#3a1e0a" />
        {/* 8 pewter mold tubes 2×4 */}
        {([0, 1, 2, 3] as const).map(row => {
          const segH = (MOL_Y2 - MOL_Y1 - 11) / 4;
          const mY1  = MOL_Y1 + 11 + row * segH + 3;
          const mY2  = mY1 + segH - 6;
          return [0, 1].map(col => {
            const mx = col === 0 ? MOL_X1 + 22 : MOL_X2 - 38;
            return (
              <g key={`m${row}${col}`}>
                <rect x={mx} y={mY1} width={16} height={mY2 - mY1} fill="url(#cw-pewter)" rx={3} stroke="#505058" strokeWidth={0.5} />
                <rect x={mx + 2} y={mY1 - 14} width={12} height={17} fill={CANDLE_C} rx={1} />
                <line x1={mx + 8} y1={mY1 - 26} x2={mx + 8} y2={mY1 - 14} stroke={WICK_C} strokeWidth={1.5} />
              </g>
            );
          });
        }).flat()}
        {/* Wax kettle on bench */}
        <rect x={BENCH_X1 + 56} y={BENCH_Y - 32} width={46} height={32} fill="#3a2010" rx={2} stroke="#2a1408" strokeWidth={1} />
        <ellipse cx={BENCH_X1 + 79} cy={BENCH_Y} rx={23} ry={7} fill={TALLOW} opacity={0.88} />

        {/* ── Herb Bundles (ceiling, left) ── */}
        {([110, 188] as const).map((hx, hi) => (
          <g key={`hb${hi}`}>
            <line x1={hx} y1={0} x2={hx} y2={64} stroke={BEAM} strokeWidth={1.5} />
            <ellipse cx={hx} cy={73} rx={13} ry={19} fill={hi === 0 ? "#3a5028" : "#4a3868"} opacity={0.82} />
            <line x1={hx - 9} y1={58} x2={hx + 2} y2={80} stroke="#2a4020" strokeWidth={0.8} />
            <line x1={hx + 7} y1={56} x2={hx - 1} y2={78} stroke="#2a4020" strokeWidth={0.8} />
          </g>
        ))}

        {/* ── Rope & Pulley ── */}
        <circle cx={DIP_X1} cy={52} r={6} fill="none" stroke="#888580" strokeWidth={2.5} />
        <circle cx={DIP_X2} cy={52} r={6} fill="none" stroke="#888580" strokeWidth={2.5} />
        <line x1={DIP_X1} y1={58} x2={DIP_X1} y2={dipBarY} stroke="#6a4a28" strokeWidth={2} />
        <line x1={DIP_X2} y1={58} x2={DIP_X2} y2={dipBarY} stroke="#6a4a28" strokeWidth={2} />
        {/* Rope from left pulley to lever tip */}
        <line x1={DIP_X1} y1={52} x2={levTipX} y2={levTipY} stroke="#6a4a28" strokeWidth={2} opacity={0.8} />

        {/* ── Lever mechanism on left wall ── */}
        <circle cx={LEV_CX} cy={LEV_CY} r={5} fill="#888580" />
        <line x1={LEV_CX} y1={LEV_CY} x2={levTipX} y2={levTipY} stroke="#5a3218" strokeWidth={7} strokeLinecap="round" />
        <line x1={LEV_CX} y1={LEV_CY} x2={LEV_CX - 40} y2={LEV_CY + 22} stroke="#5a3218" strokeWidth={7} strokeLinecap="round" />
        <circle cx={levTipX} cy={levTipY} r={5} fill="#888580" />

        {/* ── Dip Bar ── */}
        <rect x={DIP_X1 - 6} y={dipBarY - 5} width={DIP_X2 - DIP_X1 + 12} height={10} fill="#5a3218" rx={2} stroke="#3a1e08" strokeWidth={1} />

        {/* ── Hanging Candles ── */}
        {WICK_XS.map((wx, i) => {
          const wickX = wx ?? 400;
          const topY  = dipBarY + 5;
          const botY  = topY + 10 + CAN_LEN;
          const inTal = botY > CAL_TY;
          const visBot = inTal ? CAL_TY - 1 : botY;
          const visLen = Math.max(0, visBot - topY - 10);
          return (
            <g key={`c${i}`}>
              <line x1={wickX} y1={topY}     x2={wickX} y2={topY + 10} stroke={WICK_C} strokeWidth={1.2} />
              <rect x={wickX - CAN_HW} y={topY + 8} width={CAN_HW * 2} height={Math.max(1, visLen)} fill="url(#cw-wax)" rx={CAN_HW} />
              {/* Drip bead when rising */}
              {dripAlpha > 0.05 && (
                <ellipse cx={wickX} cy={topY + 8 + visLen} rx={CAN_HW + 1} ry={4} fill={TALLOW} opacity={dripAlpha * 0.7} />
              )}
            </g>
          );
        })}

        {/* ── Tallow Cauldron ── */}
        {/* Brick furnace */}
        <rect x={FUR_X1} y={FUR_Y1} width={FUR_X2 - FUR_X1} height={FLR_Y - FUR_Y1} fill="url(#cw-brick)" />
        {/* Arch opening */}
        <path
          d={`M ${FUR_X1 + 42} ${FLR_Y} L ${FUR_X1 + 42} ${FUR_Y1 + 34}
              A ${(FUR_X2 - FUR_X1) / 2 - 42} 40 0 0 1 ${FUR_X2 - 42} ${FUR_Y1 + 34}
              L ${FUR_X2 - 42} ${FLR_Y} Z`}
          fill="#140a04"
        />
        {/* Fire glow */}
        <ellipse cx={CAL_CX} cy={FUR_Y1 + 28} rx={82} ry={46}
          fill="url(#cw-fireglow)"
          opacity={0.7 + Math.sin(phase * 0.18) * 0.12}
        />
        {/* Flames */}
        {([0, 1, 2, 3, 4] as const).map(fi => {
          const fxOff = F_OFF[fi] ?? 0;
          const fw    = F_WID[fi] ?? 20;
          const fh    = [flH, flH * 0.8 + fl3, flH * 0.9 + fl2, flH * 0.6 + fl1, flH * 0.7 + fl3][fi] ?? flH;
          const fc    = F_CLR[fi] ?? FIRE_A;
          const fx    = CAL_CX + fxOff;
          const fbase = FUR_Y1 + 26;
          return (
            <path key={`f${fi}`}
              d={`M ${fx - fw} ${fbase} Q ${fx - fw * 0.3} ${fbase - fh * 0.6} ${fx} ${fbase - fh}
                  Q ${fx + fw * 0.3} ${fbase - fh * 0.6} ${fx + fw} ${fbase} Z`}
              fill={fc} opacity={fi === 3 ? 0.65 : 0.88}
            />
          );
        })}
        {/* Cauldron body */}
        <path
          d={`M ${CAL_CX - CAL_RX} ${CAL_TY}
              Q ${CAL_CX - CAL_RX * 1.06} ${CAL_TY + CAL_H * 0.5}
                ${CAL_CX - CAL_BRX} ${CAL_TY + CAL_H}
              L ${CAL_CX + CAL_BRX} ${CAL_TY + CAL_H}
              Q ${CAL_CX + CAL_RX * 1.06} ${CAL_TY + CAL_H * 0.5}
                ${CAL_CX + CAL_RX} ${CAL_TY} Z`}
          fill="url(#cw-iron)" stroke="#1a1512" strokeWidth={1.5}
        />
        {/* Tallow surface */}
        <ellipse cx={CAL_CX} cy={CAL_TY + 4} rx={CAL_RX - 4} ry={CAL_RY - 2}
          fill="url(#cw-tallow)" opacity={0.90}
        />
        <ellipse cx={CAL_CX - 20} cy={CAL_TY + 2} rx={26} ry={6} fill="#fffde0" opacity={0.32} />
        {/* Rim */}
        <ellipse cx={CAL_CX} cy={CAL_TY} rx={CAL_RX} ry={CAL_RY} fill="none" stroke="#4a4540" strokeWidth={5} />
        <ellipse cx={CAL_CX} cy={CAL_TY} rx={CAL_RX} ry={CAL_RY} fill="none" stroke="#2a2520" strokeWidth={2} />
        {/* Legs */}
        {([-36, 0, 36] as const).map((lx, li) => (
          <line key={`leg${li}`}
            x1={CAL_CX + lx} y1={CAL_TY + CAL_H - 4}
            x2={CAL_CX + lx + (lx > 0 ? 6 : lx < 0 ? -6 : 0)} y2={FUR_Y1 + 2}
            stroke="#3a3530" strokeWidth={6} strokeLinecap="round"
          />
        ))}
        {/* Smoke */}
        {SMOKES.map(([phOff, xDrift, spd], si) => {
          const smkT  = ((phase * (spd ?? 1.4) + (phOff ?? 0) * 4) % 120) / 120;
          const smkY  = CAL_TY - 6 - smkT * 110;
          const smkX  = CAL_CX + Math.sin(smkT * Math.PI * 3.2 + (phOff ?? 0)) * (xDrift ?? 10);
          const smkOp = smkT < 0.2 ? smkT / 0.2 * 0.38 : smkT > 0.72 ? (1 - smkT) / 0.28 * 0.38 : 0.38;
          return (
            <circle key={`s${si}`} cx={smkX} cy={smkY} r={8 + smkT * 18}
              fill="#6a5a4a" opacity={smkOp} filter="url(#cw-smk)"
            />
          );
        })}

        {/* ── Finished Candles Shelf (right) ── */}
        <rect x={SHF_X1 - 14} y={SHF_Y1 - 4} width={14} height={SHF_Y2 - SHF_Y1 + 8} fill="#3a2010" />
        <rect x={SHF_X1} y={SHF_Y1 + 14} width={SHF_X2 - SHF_X1} height={13} fill="#5a2e10" stroke="#3a1c08" strokeWidth={1} />
        <rect x={SHF_X1} y={SHF_Y1 + 80} width={SHF_X2 - SHF_X1} height={13} fill="#5a2e10" stroke="#3a1c08" strokeWidth={1} />
        {/* Bundled candles on 2 shelves */}
        {([0, 1] as const).map(row => {
          const shY = SHF_Y1 + 14 + row * 66;
          return Array.from({ length: 9 }, (_, ci) => {
            const cx = SHF_X1 + 12 + ci * 24;
            return (
              <g key={`sc${row}${ci}`}>
                <rect x={cx - 4} y={shY - 58} width={8} height={58} fill={CANDLE_C} rx={2} />
                <rect x={cx - 1} y={shY - 58} width={2} height={58} fill="#fffae8" opacity={0.45} rx={1} />
              </g>
            );
          });
        })}
        {/* 3 lit candles on top shelf right */}
        {([1060, 1122, 1194] as const).map((cx, ci) => {
          const cY   = SHF_Y1 + 14;
          const fOsc = [sf1, sf2, sf1 * 0.7 + sf2 * 0.5][ci] ?? sf1;
          return (
            <g key={`lc${ci}`}>
              <ellipse cx={cx} cy={cY + 3} rx={9} ry={3} fill="#888580" />
              <rect x={cx - 5} y={cY - 46} width={10} height={49} fill={CANDLE_C} rx={2} />
              <rect x={cx - 1} y={cY - 46} width={2} height={49} fill="#fffae8" opacity={0.42} rx={1} />
              <line x1={cx} y1={cY - 50} x2={cx} y2={cY - 46} stroke={WICK_C} strokeWidth={1.2} />
              <path
                d={`M ${cx - 4} ${cY - 52} Q ${cx + fOsc * 0.9} ${cY - 64} ${cx + 1} ${cY - 72}
                    Q ${cx + 3 + fOsc * 0.5} ${cY - 63} ${cx + 4} ${cY - 52} Z`}
                fill={FIRE_A} opacity={0.92}
              />
              <path
                d={`M ${cx - 2} ${cY - 52} Q ${cx + fOsc * 0.6} ${cY - 62} ${cx + 1} ${cY - 68}
                    Q ${cx + 2} ${cY - 62} ${cx + 3} ${cY - 52} Z`}
                fill={FIRE_B} opacity={0.9}
              />
              <ellipse cx={cx + 1} cy={cY - 58} rx={11} ry={13} fill={FIRE_A}
                opacity={0.13} filter="url(#cw-glow)"
              />
            </g>
          );
        })}

        {/* ── Worker Figure ── */}
        <line x1={WRK_X - 8} y1={WRK_HIP_Y} x2={WRK_X - 12} y2={FLR_Y} stroke="#3a2010" strokeWidth={13} strokeLinecap="round" />
        <line x1={WRK_X + 8} y1={WRK_HIP_Y} x2={WRK_X + 4}  y2={FLR_Y} stroke="#4a2818" strokeWidth={13} strokeLinecap="round" />
        <ellipse cx={WRK_X - 12} cy={FLR_Y} rx={10} ry={5} fill="#1e1008" />
        <ellipse cx={WRK_X + 4}  cy={FLR_Y} rx={10} ry={5} fill="#1e1008" />
        {/* Apron */}
        <path d={`M ${WRK_X - 16} ${WRK_SHD_Y + 22} L ${WRK_X - 12} ${WRK_HIP_Y + 4}
                  L ${WRK_X + 12} ${WRK_HIP_Y + 4} L ${WRK_X + 16} ${WRK_SHD_Y + 22} Z`}
          fill="#c8a860" stroke="#a88840" strokeWidth={1}
        />
        <rect x={WRK_X - 17} y={WRK_SHD_Y} width={34} height={WRK_HIP_Y - WRK_SHD_Y} fill="#4a2e14" rx={4} />
        {/* Left arm */}
        <line x1={WRK_X - 11} y1={WRK_SHD_Y + 8}
              x2={WRK_X - 16 + lSway} y2={WRK_SHD_Y + 52}
              stroke="#3a2010" strokeWidth={10} strokeLinecap="round" />
        {/* Right arm IK */}
        <line x1={WRK_SHD_X} y1={WRK_SHD_Y + 8} x2={elbX} y2={elbY} stroke="#3a2010" strokeWidth={10} strokeLinecap="round" />
        <line x1={elbX} y1={elbY}
              x2={elbX + Math.cos(faAng) * FA} y2={elbY + Math.sin(faAng) * FA}
              stroke="#3a2010" strokeWidth={9} strokeLinecap="round" />
        {/* Head */}
        <circle cx={WRK_X + 2} cy={WRK_HD_CY} r={18} fill="#c8885a" />
        <ellipse cx={WRK_X + 2} cy={WRK_HD_CY - 10} rx={22} ry={16} fill="#f0ead8" />
        <ellipse cx={WRK_X + 2} cy={WRK_HD_CY - 12} rx={14} ry={10} fill="#e8dfc8" />
        <circle cx={WRK_X - 4} cy={WRK_HD_CY + 2} r={2.2} fill="#8a4828" />
        <circle cx={WRK_X + 8} cy={WRK_HD_CY + 2} r={2.2} fill="#8a4828" />
        <path d={`M ${WRK_X - 3} ${WRK_HD_CY + 8} Q ${WRK_X + 2} ${WRK_HD_CY + 12} ${WRK_X + 7} ${WRK_HD_CY + 8}`}
          fill="none" stroke="#8a4828" strokeWidth={1.3}
        />

        {/* ── Apprentice at Cauldron ── */}
        <line x1={APP_X - 8} y1={APP_HIP_Y} x2={APP_X - 10} y2={FLR_Y} stroke="#3a2010" strokeWidth={12} strokeLinecap="round" />
        <line x1={APP_X + 8} y1={APP_HIP_Y} x2={APP_X + 4}  y2={FLR_Y} stroke="#4a2818" strokeWidth={12} strokeLinecap="round" />
        <ellipse cx={APP_X - 10} cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <ellipse cx={APP_X + 4}  cy={FLR_Y} rx={9} ry={4} fill="#1e1008" />
        <rect x={APP_X - 15} y={APP_SHD_Y} width={30} height={APP_HIP_Y - APP_SHD_Y} fill="#3a2814" rx={3} />
        <path d={`M ${APP_X - 13} ${APP_SHD_Y + 18} L ${APP_X - 11} ${APP_HIP_Y + 3}
                  L ${APP_X + 11} ${APP_HIP_Y + 3} L ${APP_X + 13} ${APP_SHD_Y + 18} Z`}
          fill="#b89850" stroke="#988038" strokeWidth={1}
        />
        {/* Stirring arm + ladle */}
        <line x1={APP_X - 9} y1={APP_SHD_Y + 6}  x2={APP_X - 32} y2={APP_SHD_Y + 38} stroke="#3a2010" strokeWidth={9} strokeLinecap="round" />
        <line x1={APP_X - 32} y1={APP_SHD_Y + 38} x2={APP_X - 54} y2={APP_SHD_Y + 54} stroke="#3a2010" strokeWidth={8} strokeLinecap="round" />
        <line x1={APP_X + 9} y1={APP_SHD_Y + 6}  x2={APP_X + 26} y2={APP_SHD_Y + 30} stroke="#3a2010" strokeWidth={9} strokeLinecap="round" />
        {/* Ladle handle → into cauldron */}
        <line x1={APP_X - 54} y1={APP_SHD_Y + 54} x2={CAL_CX + 24} y2={CAL_TY + 12}
          stroke="#5a3010" strokeWidth={4} strokeLinecap="round"
        />
        <ellipse cx={CAL_CX + 26} cy={CAL_TY + 14} rx={8} ry={5} fill={IRON} />
        {/* Head + tricorn */}
        <circle cx={APP_X} cy={APP_HD_CY} r={16} fill="#b87850" />
        <ellipse cx={APP_X} cy={APP_HD_CY - 10} rx={20} ry={6} fill="#2a1e14" />
        <path d={`M ${APP_X - 14} ${APP_HD_CY - 10} L ${APP_X - 18} ${APP_HD_CY - 28}
                  L ${APP_X + 18} ${APP_HD_CY - 28} L ${APP_X + 14} ${APP_HD_CY - 10} Z`}
          fill="#2a1e14"
        />
        <circle cx={APP_X - 5} cy={APP_HD_CY + 1} r={2} fill="#6a3820" />
        <circle cx={APP_X + 5} cy={APP_HD_CY + 1} r={2} fill="#6a3820" />

        {/* ── Sign ── */}
        <rect x={424} y={H - 50} width={432} height={36} fill="#2a1608" stroke="#8a5028" strokeWidth={1.5} rx={2} />
        <text x={640} y={H - 28} textAnchor="middle" fill="#f0c060" fontSize={13}
          fontFamily="Georgia, serif" letterSpacing="2">
          SHREWSBURY CANDLE WORKS · EST. 1771
        </text>
        <text x={640} y={H - 8} textAnchor="middle" fill="#8a6848" fontSize={9}
          fontFamily="Georgia, serif" letterSpacing="1.5">
          TALLOW DIPPING · PEWTER MOLDS · BEESWAX TAPERS · NEW ENGLAND
        </text>
      </svg>
    </section>
  );
}
