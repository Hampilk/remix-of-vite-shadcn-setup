import { useEffects, EffectType } from '@/contexts/EffectContext';
import { Sparkles, GlassWater, Layers, Palette, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const effectConfig: { type: EffectType; label: string; description: string; icon: typeof Sparkles; color: string }[] = [
  { type: 'glow', label: 'Glow', description: 'Meleg fókuszpont, puha peremekkel.', icon: Sparkles, color: 'amber' },
  { type: 'glass', label: 'Glass', description: 'Lágy üveg hatás, háttér-elmosással.', icon: GlassWater, color: 'sky' },
  { type: 'neomorph', label: 'Neomorph', description: 'Minimál domborítás, extra mélységgel.', icon: Layers, color: 'purple' },
  { type: 'clay', label: 'Clay', description: 'Meleg, plasztikus komponensek.', icon: Palette, color: 'rose' },
];

const colorClasses: Record<string, { bg: string; text: string; glow: string }> = {
  amber: { bg: 'bg-amber-400/15', text: 'text-amber-300', glow: 'shadow-[0_0_25px_rgba(251,191,36,0.55)]' },
  sky: { bg: 'bg-sky-400/10', text: 'text-sky-300', glow: 'shadow-[0_0_25px_rgba(56,189,248,0.55)]' },
  purple: { bg: 'bg-purple-400/10', text: 'text-purple-300', glow: 'shadow-[0_0_25px_rgba(192,132,252,0.55)]' },
  rose: { bg: 'bg-rose-400/10', text: 'text-rose-300', glow: 'shadow-[0_0_25px_rgba(251,113,133,0.55)]' },
};

export const MultiEffectEditor = () => {
  const { state, togglePower, toggleEffect, getActiveEffectsCount } = useEffects();
  const activeCount = getActiveEffectsCount();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Active Effects */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-100">
              Aktív effektek
            </p>
            <p className="text-sm text-slate-400 mt-0.5">
              Kapcsold be a kívánt kombinációt.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 px-2.5 py-1">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-amber-200 tracking-tight">
              {activeCount} aktív
            </span>
          </span>
        </div>

        <div className="space-y-1.5">
          {effectConfig.map(({ type, label, description, icon: Icon, color }) => {
            const isActive = state.activeEffects[type];
            const colors = colorClasses[color];
            
            return (
              <button
                key={type}
                onClick={() => toggleEffect(type)}
                className={cn(
                  "group w-full flex items-center justify-between rounded-xl transition-all",
                  isActive 
                    ? `bg-gradient-to-r from-${color}-500/80 via-${color}-400/80 to-${color}-300/80 p-[1px] ${colors.glow}`
                    : "border border-neutral-800/80 bg-neutral-900/80 hover:bg-neutral-800/70"
                )}
              >
                <div className={cn(
                  "flex-1 flex items-center justify-between px-3 py-2.5",
                  isActive && "rounded-[0.70rem] bg-neutral-950/95"
                )}>
                  <div className="flex items-center gap-2.5">
                    <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-lg", colors.bg, colors.text)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold tracking-tight text-slate-100">
                        {label}
                      </p>
                      <p className={cn("text-xs", isActive ? `text-${color}-100/90` : "text-slate-400")}>
                        {description}
                      </p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <div className={cn(
                    "relative inline-flex h-5 w-10 items-center rounded-full transition-colors",
                    isActive ? `bg-${color}-400` : "bg-neutral-700"
                  )}>
                    <span className={cn(
                      "inline-block h-4 w-4 rounded-full bg-neutral-950 shadow-[0_3px_7px_rgba(0,0,0,0.7)] transition-transform",
                      isActive ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Mode */}
      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-100">
              Téma mód
            </p>
            <p className="text-sm text-slate-400 mt-0.5">
              Szenáriók váltása egy kattintással.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800/90 px-2 py-1">
            <Moon className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-xs text-slate-200 tracking-tight">
              Auto‑adaptive
            </span>
          </span>
        </div>

        <div className="space-y-2.5">
          <button className="flex w-full items-center justify-between rounded-xl border border-neutral-700/80 bg-neutral-950/80 px-3.5 py-2.5 hover:border-neutral-500/80 transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-neutral-900">
                <Sun className="h-3.5 w-3.5" />
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold tracking-tight text-slate-100">
                  Sötét mód · Glow fókusz
                </p>
                <p className="text-xs text-slate-400">
                  Ideális kontraszt prezentációkhoz.
                </p>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <div className="flex gap-1.5">
            <span className="flex-1 h-1 rounded-full bg-amber-400" />
            <span className="flex-1 h-1 rounded-full bg-slate-600" />
            <span className="flex-1 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Mode buttons group */}
      <div className="bg-neutral-900/70 border-neutral-800/80 border rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-2">
          {effectConfig.map(({ type, label, icon: Icon, color }) => {
            const isActive = state.activeEffects[type];
            return (
              <button
                key={type}
                onClick={() => toggleEffect(type)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all",
                  isActive
                    ? `bg-gradient-to-br from-${color}-500/20 to-${color === 'amber' ? 'orange' : color}-500/20 border border-${color}-500/50 text-${color}-100`
                    : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
