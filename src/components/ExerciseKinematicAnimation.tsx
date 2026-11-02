import { useState, useEffect } from 'react';
import { Play, Pause, ExternalLink, Activity, Info, Sparkles } from 'lucide-react';
import { ExerciseDefinition } from '../data/exerciseLibrary';

interface KinematicProps {
  exercise: ExerciseDefinition;
  equipmentUsed?: string;
  showDetails?: boolean;
}

export default function ExerciseKinematicAnimation({ exercise, equipmentUsed, showDetails = true }: KinematicProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 1 loop
  const [phase, setPhase] = useState<'Eccentric (Lowering)' | 'Inflection (Transition)' | 'Concentric (Drive)' | 'Lockout'>('Concentric (Drive)');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = 30; // ~33fps
    const step = 0.015; // Loop duration ~2 seconds

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = (prev + step) % 1;
        // Map progress to biomechanical phase
        if (next < 0.45) {
          setPhase('Eccentric (Lowering)');
        } else if (next >= 0.45 && next < 0.55) {
          setPhase('Inflection (Transition)');
        } else if (next >= 0.55 && next < 0.9) {
          setPhase('Concentric (Drive)');
        } else {
          setPhase('Lockout');
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sine wave smooth movement: 0 (start) -> 1 (peak deflection) -> 0
  // e.g. for a squat, 0 is standing, 1 is bottom of squat
  const t = Math.sin(progress * Math.PI);

  const activeEquipment = equipmentUsed || exercise.defaultEquipment;

  return (
    <div className="bg-black border border-edge p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Background Grid & Scanline */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      {/* Header bar */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand font-bold">
              Biomechanical Vector Loop
            </span>
          </div>
          <div className="text-sm font-black uppercase text-white tracking-tight mt-0.5">
            {exercise.name}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            className="p-1.5 border border-edge bg-zinc-900 text-zinc-400 hover:text-white hover:border-brand transition-colors text-xs"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* Visualizer Canvas Area (SVG Kinematics) */}
      <div className="relative w-full h-52 sm:h-60 flex items-center justify-center bg-zinc-950/80 border border-edge/60 rounded-sm overflow-hidden my-2">
        {/* Phase Pill */}
        <div className="absolute top-3 left-3 bg-black/80 border border-edge px-2.5 py-1 text-[9px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 z-10">
          <Activity size={10} className="text-brand" />
          <span>Phase: <strong className="text-white">{phase}</strong></span>
        </div>

        {/* Equipment Badge */}
        <div className="absolute top-3 right-3 bg-brand/10 border border-brand/30 px-2 py-0.5 text-[9px] font-mono text-brand uppercase tracking-wider z-10">
          {activeEquipment}
        </div>

        {/* Dynamic SVG Animation based on exercise animationType */}
        <svg viewBox="0 0 200 180" className="w-full h-full max-w-[240px] select-none">
          <defs>
            <linearGradient id="barGrip" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#71717a" />
              <stop offset="50%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#71717a" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floor Reference Line */}
          <line x1="20" y1="160" x2="180" y2="160" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />
          <text x="100" y="172" textAnchor="middle" fill="#52525b" fontSize="7" fontFamily="monospace">
            GROUND CONTACT PLANE
          </text>

          {/* SQUAT & LOWER BODY PATTERN */}
          {exercise.animationType === 'squat' && (() => {
            const hipY = 85 + t * 42;
            const hipX = 96 - t * 14;
            const kneeY = 125 + t * 10;
            const kneeX = 118 + t * 6;
            const headY = 40 + t * 40;
            const headX = 100 - t * 4;
            const shoulderY = 55 + t * 40;
            const shoulderX = 100 - t * 4;

            return (
              <g>
                {/* Weight: Barbell or Kettlebell */}
                {activeEquipment === 'Kettlebell' ? (
                  <g filter="url(#glow)">
                    <circle cx={shoulderX + 12} cy={shoulderY + 12} r="8" fill="#ea580c" />
                    <rect x={shoulderX + 9} y={shoulderY + 2} width="6" height="4" fill="#a1a1aa" rx="1" />
                  </g>
                ) : (
                  <g filter="url(#glow)">
                    <line x1="60" y1={shoulderY} x2="140" y2={shoulderY} stroke="url(#barGrip)" strokeWidth="4" />
                    <rect x="52" y={shoulderY - 10} width="8" height="20" rx="1" fill="#ea580c" />
                    <rect x="140" y={shoulderY - 10} width="8" height="20" rx="1" fill="#ea580c" />
                  </g>
                )}

                {/* Torso Spine */}
                <line x1={shoulderX} y1={shoulderY} x2={hipX} y2={hipY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Head */}
                <circle cx={headX} cy={headY} r="7" fill="#f4f4f5" />
                {/* Thigh (Active Quad / Glute glow) */}
                <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
                {/* Shin */}
                <line x1={kneeX} y1={kneeY} x2="114" y2="160" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Foot */}
                <line x1="104" y1="160" x2="124" y2="160" stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />

                {/* Joint Pivot Points */}
                <circle cx={hipX} cy={hipY} r="3" fill="#ea580c" />
                <circle cx={kneeX} cy={kneeY} r="3" fill="#ea580c" />

                {/* Vertical Bar Path Indicator */}
                <line x1="100" y1="45" x2="100" y2="105" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
              </g>
            );
          })()}

          {/* BENCH PRESS PATTERN */}
          {exercise.animationType === 'bench' && (() => {
            const barY = 65 + t * 38;
            const elbowY = 88 + t * 24;
            const elbowX = 85 - t * 8;

            return (
              <g>
                {/* Bench Structure */}
                <rect x="50" y="112" width="100" height="10" fill="#27272a" />
                <line x1="65" y1="122" x2="65" y2="160" stroke="#3f3f46" strokeWidth="4" />
                <line x1="135" y1="122" x2="135" y2="160" stroke="#3f3f46" strokeWidth="4" />

                {/* Torso lying down */}
                <line x1="70" y1="110" x2="125" y2="110" stroke="#f4f4f5" strokeWidth="5" strokeLinecap="round" />
                {/* Head on bench */}
                <circle cx="62" cy="108" r="6" fill="#f4f4f5" />
                {/* Legs down to floor */}
                <polyline points="125,110 142,126 146,160" fill="none" stroke="#71717a" strokeWidth="3" strokeLinecap="round" />

                {/* Pectoral Activation Highlight */}
                <ellipse cx="90" cy="106" rx="9" ry="5" fill="#ea580c" opacity={0.4 + t * 0.5} />

                {/* Arms */}
                <line x1="86" y1="108" x2={elbowX} y2={elbowY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                <line x1={elbowX} y1={elbowY} x2="95" y2={barY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />

                {/* Barbell / Dumbbell */}
                {activeEquipment === 'Dumbbell' ? (
                  <g filter="url(#glow)">
                    <rect x="85" y={barY - 4} width="20" height="8" rx="2" fill="#ea580c" />
                  </g>
                ) : (
                  <g filter="url(#glow)">
                    <line x1="65" y1={barY} x2="125" y2={barY} stroke="url(#barGrip)" strokeWidth="4" />
                    <rect x="58" y={barY - 8} width="7" height="16" rx="1" fill="#ea580c" />
                    <rect x="125" y={barY - 8} width="7" height="16" rx="1" fill="#ea580c" />
                  </g>
                )}

                {/* Bar Path */}
                <line x1="95" y1="65" x2="95" y2="105" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
              </g>
            );
          })()}

          {/* DEADLIFT PATTERN */}
          {exercise.animationType === 'deadlift' && (() => {
            const barY = 145 - t * 65; // bar starts low at floor (145), rises to hips (80)
            const hipY = 115 - t * 25;
            const hipX = 85 + t * 12;
            const shoulderY = 95 - t * 45;
            const shoulderX = 100 + t * 2;
            const kneeX = 102 + (1 - t) * 8;

            return (
              <g>
                {/* Shin / Lower Leg */}
                <line x1="104" y1="160" x2={kneeX} y2="128" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Thigh / Hamstring (Glow) */}
                <line x1={kneeX} y1="128" x2={hipX} y2={hipY} stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
                {/* Torso / Back */}
                <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Head */}
                <circle cx={shoulderX + 4} cy={shoulderY - 10} r="7" fill="#f4f4f5" />
                {/* Arms straight hanging to bar */}
                <line x1={shoulderX} y1={shoulderY} x2="108" y2={barY} stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />

                {/* Barbell Plates */}
                <g filter="url(#glow)">
                  <line x1="75" y1={barY} x2="140" y2={barY} stroke="url(#barGrip)" strokeWidth="4" />
                  <rect x="68" y={barY - 14} width="8" height="28" rx="2" fill="#ea580c" />
                  <rect x="139" y={barY - 14} width="8" height="28" rx="2" fill="#ea580c" />
                </g>

                {/* Vertical Trajectory Line */}
                <line x1="108" y1="75" x2="108" y2="150" stroke="#ea580c" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
              </g>
            );
          })()}

          {/* OVERHEAD PRESS PATTERN */}
          {exercise.animationType === 'overhead' && (() => {
            const barY = 70 - t * 45; // starts shoulder height, presses overhead
            const elbowY = 92 - t * 35;
            const elbowX = 88 - t * 4;

            return (
              <g>
                {/* Standing Body */}
                <line x1="100" y1="160" x2="100" y2="115" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="115" x2="100" y2="70" stroke="#f4f4f5" strokeWidth="5" strokeLinecap="round" />
                {/* Head */}
                <circle cx="100" cy="54" r="7" fill="#f4f4f5" />
                {/* Shoulders Glow */}
                <circle cx="100" cy="70" r="10" fill="#ea580c" opacity={0.4 + t * 0.4} />

                {/* Arms */}
                <line x1="100" y1="70" x2={elbowX} y2={elbowY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                <line x1={elbowX} y1={elbowY} x2="100" y2={barY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />

                {/* Weight */}
                {activeEquipment === 'Kettlebell' ? (
                  <g filter="url(#glow)">
                    <circle cx="100" cy={barY - 6} r="8" fill="#ea580c" />
                  </g>
                ) : (
                  <g filter="url(#glow)">
                    <line x1="65" y1={barY} x2="135" y2={barY} stroke="url(#barGrip)" strokeWidth="4" />
                    <rect x="58" y={barY - 8} width="7" height="16" rx="1" fill="#ea580c" />
                    <rect x="135" y={barY - 8} width="7" height="16" rx="1" fill="#ea580c" />
                  </g>
                )}
              </g>
            );
          })()}

          {/* ROW / PULL PATTERN */}
          {exercise.animationType === 'row' && (() => {
            const pullT = t; // 0 is extended hang, 1 is rowed to torso
            const handX = 110 - pullT * 22;
            const handY = 125 - pullT * 28;
            const elbowX = 85 - pullT * 12;
            const elbowY = 100 - pullT * 24;

            return (
              <g>
                {/* Lower body in hinge */}
                <line x1="85" y1="160" x2="88" y2="128" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                <line x1="88" y1="128" x2="75" y2="105" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Torso in 45 deg angle */}
                <line x1="75" y1="105" x2="115" y2="75" stroke="#f4f4f5" strokeWidth="5" strokeLinecap="round" />
                <circle cx="120" cy="68" r="7" fill="#f4f4f5" />

                {/* Lats / Upper Back Glow */}
                <ellipse cx="94" cy="88" rx="12" ry="6" fill="#ea580c" opacity={0.3 + pullT * 0.6} />

                {/* Arm rowing */}
                <line x1="110" y1="78" x2={elbowX} y2={elbowY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />

                {/* Weight */}
                <g filter="url(#glow)">
                  <circle cx={handX} cy={handY + 2} r="8" fill="#ea580c" />
                </g>
              </g>
            );
          })()}

          {/* KETTLEBELL SWING PATTERN */}
          {exercise.animationType === 'swing' && (() => {
            // Swing goes from between knees (hip hinge) to floating at chest height
            const swingX = 80 + t * 45; // forward arc
            const swingY = 135 - t * 55; // upward float
            const hipSnap = t; // 0 = hinged back, 1 = snapped forward
            const hipX = 75 + hipSnap * 18;

            return (
              <g>
                {/* Lower legs */}
                <line x1="90" y1="160" x2="92" y2="130" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Thigh & Glute hinge */}
                <line x1="92" y1="130" x2={hipX} y2="105" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
                {/* Torso */}
                <line x1={hipX} y1="105" x2="98" y2="65" stroke="#f4f4f5" strokeWidth="5" strokeLinecap="round" />
                <circle cx="98" cy="52" r="7" fill="#f4f4f5" />

                {/* Arms guiding bell */}
                <line x1="98" y1="68" x2={swingX} y2={swingY} stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />

                {/* Kettlebell */}
                <g filter="url(#glow)">
                  <circle cx={swingX} cy={swingY} r="9" fill="#ea580c" />
                  <rect x={swingX - 4} y={swingY - 12} width="8" height="5" fill="#a1a1aa" rx="1" />
                </g>

                {/* Arc Trail */}
                <path d="M 80 135 Q 95 105 125 80" fill="none" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              </g>
            );
          })()}

          {/* BICEP / ARM CURL PATTERN */}
          {exercise.animationType === 'curl' && (() => {
            const curlAngle = t * Math.PI * 0.75; // 0 to 135 deg
            const forearmEndX = 95 - Math.sin(curlAngle) * 32;
            const forearmEndY = 120 - Math.cos(curlAngle) * 32;

            return (
              <g>
                {/* Standing Body */}
                <line x1="75" y1="160" x2="75" y2="65" stroke="#f4f4f5" strokeWidth="5" strokeLinecap="round" />
                <circle cx="75" cy="52" r="7" fill="#f4f4f5" />

                {/* Upper Arm pinned */}
                <line x1="75" y1="72" x2="95" y2="95" stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />
                {/* Forearm Curling */}
                <line x1="95" y1="95" x2={forearmEndX} y2={forearmEndY} stroke="#f4f4f5" strokeWidth="4" strokeLinecap="round" />

                {/* Bicep Peak Glow */}
                <circle cx="85" cy="85" r="7" fill="#ea580c" opacity={0.3 + t * 0.7} />

                {/* Dumbbell / Barbell */}
                <g filter="url(#glow)">
                  <circle cx={forearmEndX} cy={forearmEndY} r="7" fill="#ea580c" />
                </g>

                <circle cx="95" cy="95" r="3" fill="#ea580c" />
              </g>
            );
          })()}

          {/* CORE / HANGING PATTERN */}
          {exercise.animationType === 'core' && (() => {
            const legAngle = t * 75; // raises 0 to 75 degrees
            const footX = 100 + Math.sin((legAngle * Math.PI) / 180) * 45;
            const footY = 145 - Math.cos(((90 - legAngle) * Math.PI) / 180) * 45;

            return (
              <g>
                {/* Pullup Bar */}
                <line x1="60" y1="25" x2="140" y2="25" stroke="#71717a" strokeWidth="4" />
                {/* Hanging Arms */}
                <line x1="90" y1="25" x2="100" y2="50" stroke="#f4f4f5" strokeWidth="3" />
                <line x1="110" y1="25" x2="100" y2="50" stroke="#f4f4f5" strokeWidth="3" />
                {/* Head */}
                <circle cx="100" cy="45" r="6" fill="#f4f4f5" />
                {/* Torso */}
                <line x1="100" y1="52" x2="100" y2="95" stroke="#f4f4f5" strokeWidth="4" />
                {/* Core Abdominal Glow */}
                <rect x="94" y="65" width="12" height="24" rx="3" fill="#ea580c" opacity={0.3 + t * 0.6} />
                {/* Legs Raising */}
                <line x1="100" y1="95" x2={footX} y2={footY} stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
              </g>
            );
          })()}
        </svg>

        {/* Progress Bar under canvas */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
          <div
            className="h-full bg-brand transition-all duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Details & Cues Section */}
      {showDetails && (
        <div className="space-y-4 mt-3">
          {/* Muscle targeting bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/80 pb-3">
            <div>
              <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block">
                Primary Driver
              </span>
              <span className="text-xs font-bold text-brand uppercase font-mono">
                {exercise.primaryMuscle}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider block">
                Kinematic Synergy
              </span>
              <span className="text-[10px] font-mono text-zinc-300">
                {exercise.secondaryMuscles.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>

          {/* Form Checkpoints / Cues */}
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-zinc-400 tracking-widest mb-2 font-bold">
              <Sparkles size={11} className="text-brand" /> Biomechanical Form Cues
            </div>
            <ul className="space-y-1.5">
              {exercise.cues.map((cue, idx) => (
                <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-brand font-mono font-bold text-[9px] shrink-0 mt-0.5">
                    [0{idx + 1}]
                  </span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Open Source Documentation Link */}
          <div className="pt-2 border-t border-edge flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
              <Info size={11} />
              <span>Source: {exercise.openSourceLink.source}</span>
            </div>
            <a
              href={exercise.openSourceLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-brand hover:text-white transition-colors underline underline-offset-4"
            >
              <span>{exercise.openSourceLink.label}</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
