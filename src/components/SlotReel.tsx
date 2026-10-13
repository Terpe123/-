import React, { useEffect, useRef, useState, useId } from 'react';
import { FoodItem, FOOD_LIST } from '../data/foods';
import { sound } from '../utils/audio';

interface SlotReelProps {
  isSpinning: boolean;
  targetFood: FoodItem | null;
  onSpinEnd: () => void;
  onPullLever: () => void;
}

const ITEM_HEIGHT = 120; // Height of each food item slot in px

export const SlotReel: React.FC<SlotReelProps> = ({
  isSpinning,
  targetFood,
  onSpinEnd,
  onPullLever,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedItems, setDisplayedItems] = useState<FoodItem[]>(() => {
    // Initial display shows random or first item centered
    return [FOOD_LIST[0]];
  });
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0);
  const [transitionTiming, setTransitionTiming] = useState('ease');
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  const spinTimerRef = useRef<number | null>(null);
  const audioIntervalRef = useRef<number | null>(null);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const clipPathId = useId();

  // Run reel animation when isSpinning turns true and targetFood is set
  useEffect(() => {
    if (!isSpinning || !targetFood) return;

    // Trigger visual handle pull
    setIsLeverPulled(true);
    sound.playLever();
    const leverTimer = window.setTimeout(() => setIsLeverPulled(false), 380);

    if (prefersReducedMotion) {
      // Reduced motion: instant/quick transition
      const quickItems = [displayedItems[displayedItems.length - 1] || FOOD_LIST[0], targetFood];
      setDisplayedItems(quickItems);
      setTranslateY(0);
      setIsTransitioning(false);

      requestAnimationFrame(() => {
        setIsTransitioning(true);
        setTransitionDuration(0.3);
        setTransitionTiming('ease-out');
        setTranslateY(-ITEM_HEIGHT);

        const endTimer = window.setTimeout(() => {
          sound.playWin();
          setDisplayedItems([targetFood]);
          setTranslateY(0);
          setIsTransitioning(false);
          onSpinEnd();
        }, 320);

        return () => clearTimeout(endTimer);
      });

      return () => {
        clearTimeout(leverTimer);
      };
    }

    // Standard realistic slot machine spinning physics
    // Build a sequence of 32 items cycling through FOOD_LIST and ending on targetFood
    const startItem = displayedItems[displayedItems.length - 1] || FOOD_LIST[0];
    const generatedStrip: FoodItem[] = [startItem];

    // Generate random items to create spinning effect
    const numIntermediate = 28;
    for (let i = 0; i < numIntermediate; i++) {
      const randIdx = Math.floor(Math.random() * FOOD_LIST.length);
      generatedStrip.push(FOOD_LIST[randIdx]);
    }
    // End with the predetermined target food
    generatedStrip.push(targetFood);

    setDisplayedItems(generatedStrip);
    setTranslateY(0);
    setIsTransitioning(false);

    // Audio ticking sound that slows down gradually
    let tickCount = 0;
    const maxTicks = 22;
    const startTime = Date.now();
    const totalDurationMs = 2500;

    const scheduleTick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= totalDurationMs || tickCount >= maxTicks) return;

      const progress = elapsed / totalDurationMs;
      // Frequency slows down as progress reaches 1
      const pitch = Math.max(0.7, 1.3 - progress * 0.6);
      sound.playTick(pitch);
      tickCount++;

      // Next tick interval increases (slows down)
      const nextInterval = 40 + Math.pow(progress, 2.5) * 280;
      audioIntervalRef.current = window.setTimeout(scheduleTick, nextInterval);
    };

    // Begin CSS transition on next paint
    requestAnimationFrame(() => {
      const finalOffset = -(generatedStrip.length - 1) * ITEM_HEIGHT;
      setIsTransitioning(true);
      setTransitionDuration(2.5); // 2.5s satisfies the 2~3s spec
      // Custom cubic bezier: very fast initial launch, smooth prolonged deceleration
      setTransitionTiming('cubic-bezier(0.12, 0.85, 0.22, 1)');
      setTranslateY(finalOffset);

      // Start ticking sound
      audioIntervalRef.current = window.setTimeout(scheduleTick, 50);

      spinTimerRef.current = window.setTimeout(() => {
        if (audioIntervalRef.current) clearTimeout(audioIntervalRef.current);
        sound.playWin();

        // Consolidate strip to just the final target item to keep DOM tidy
        setDisplayedItems([targetFood]);
        setTranslateY(0);
        setIsTransitioning(false);
        onSpinEnd();
      }, 2520);
    });

    return () => {
      clearTimeout(leverTimer);
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      if (audioIntervalRef.current) clearTimeout(audioIntervalRef.current);
    };
  }, [isSpinning, targetFood]);

  return (
    <div className="relative w-full max-w-md mx-auto my-6 select-none">
      {/* Outer Machine Housing */}
      <div className="relative bg-white rounded-3xl p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_2px_10px_rgba(0,0,0,0.03)] border border-slate-200/80">
        
        {/* Top Header Accent Strip */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase ml-1">
              SINGLE REEL · 1/16 PROB
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium tracking-tight">
            SLOT 16 FOODS
          </div>
        </div>

        {/* Reel Viewport Window */}
        <div className="relative flex items-center justify-center">
          {/* Main Reel Frame */}
          <div
            ref={containerRef}
            className="relative w-full bg-slate-50/90 rounded-2xl overflow-hidden border-2 border-slate-200/80 shadow-inner"
            style={{ height: `${ITEM_HEIGHT}px` }}
          >
            {/* Top & Bottom Depth Shadows / Vignette */}
            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-900/10 via-slate-900/5 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/10 via-slate-900/5 to-transparent z-10 pointer-events-none" />

            {/* Target Alignment Center Marker Lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 border-y border-orange-500/25 bg-orange-50/40 pointer-events-none z-10 flex items-center justify-between px-2">
              <span className="text-orange-500 text-xs font-black">▶</span>
              <span className="text-orange-500 text-xs font-black">◀</span>
            </div>

            {/* Moving Reel Strip */}
            <div
              className="w-full will-change-transform"
              style={{
                transform: `translate3d(0, ${translateY}px, 0)`,
                transition: isTransitioning
                  ? `transform ${transitionDuration}s ${transitionTiming}`
                  : 'none',
              }}
            >
              {displayedItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="w-full flex items-center justify-center gap-3 px-4"
                  style={{ height: `${ITEM_HEIGHT}px` }}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow-sm select-none" role="img" aria-label={item.name}>
                    {item.emoji}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Mechanical Lever (on the right) */}
          <div className="absolute -right-9 sm:-right-12 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={onPullLever}
              disabled={isSpinning}
              aria-label="拉動拉桿抽選"
              title="點擊拉桿開始抽選"
              className={`group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full transition-transform duration-200 ${
                isSpinning ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {/* Lever Mounting Pivot */}
              <div className="relative w-8 h-28 flex flex-col items-center justify-between">
                {/* Pivot base on machine */}
                <div className="w-5 h-5 rounded-full bg-slate-300 border-2 border-slate-400 shadow-sm z-0" />

                {/* Lever arm bar */}
                <div
                  className="w-2.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full transition-all duration-300 origin-bottom"
                  style={{
                    height: '60px',
                    transform: isLeverPulled ? 'rotate(35deg) scaleY(0.7)' : 'rotate(0deg)',
                  }}
                />

                {/* Lever Ball Handle (Orange) */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 shadow-md border-2 border-white flex items-center justify-center transition-all duration-300 ${
                    isLeverPulled ? 'translate-y-4 shadow-sm' : 'group-hover:shadow-lg'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-white/70 -translate-x-1 -translate-y-1" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Machine Base Footer Status */}
        <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>單一視窗滾輪</span>
          </div>
          <span>均等機率 6.25%</span>
        </div>
      </div>
    </div>
  );
};
