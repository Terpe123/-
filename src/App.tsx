import { useState, useCallback, useEffect } from 'react';
import { SlotReel } from './components/SlotReel';
import { FoodListModal } from './components/FoodListModal';
import { FoodItem, FOOD_LIST } from './data/foods';
import { sound } from './utils/audio';
import { Volume2, VolumeX, ListOrdered, Share2, Check, Sparkles } from 'lucide-react';

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetFood, setTargetFood] = useState<FoodItem | null>(null);
  const [finalResult, setFinalResult] = useState<FoodItem | null>(null);
  const [hasSpunAtLeastOnce, setHasSpunAtLeastOnce] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [copied, setCopied] = useState(false);

  // Toggle audio
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Main spin handler (F01 & F04)
  const handleStartSpin = useCallback(() => {
    if (isSpinning) return;

    // Pick 1 of 16 foods completely independently at random (each has 1/16 prob)
    const randomIndex = Math.floor(Math.random() * FOOD_LIST.length);
    const chosenFood = FOOD_LIST[randomIndex];

    // Clear previous displayed result text while spinning to avoid confusion
    setFinalResult(null);
    setCopied(false);
    setTargetFood(chosenFood);
    setIsSpinning(true);
    setHasSpunAtLeastOnce(true);
  }, [isSpinning]);

  // Callback when slot reel finishes its 2~3s animation (F02 & F03)
  const handleSpinEnd = useCallback(() => {
    setIsSpinning(false);
    if (targetFood) {
      setFinalResult(targetFood);
    }
  }, [targetFood]);

  // Copy result to clipboard
  const handleCopyResult = async () => {
    if (!finalResult) return;
    const text = `今天就吃：${finalResult.name}！`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  // Keyboard shortcut: Spacebar or Enter triggers spin when focused or anywhere on page if not in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isListModalOpen) return;
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        e.preventDefault();
        handleStartSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListModalOpen, handleStartSpin]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-orange-200">
      {/* Top Bar Navigation Contract: 1-line brand, clean actions */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            今天吃什麼？
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-normal">
            食物隨機抽選拉霸機
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute/Sound Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? '開啟音效' : '靜音'}
            title={isMuted ? '開啟音效' : '靜音'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* View Food List Button */}
          <button
            type="button"
            onClick={() => setIsListModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer border border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>16 種餐點</span>
          </button>
        </div>
      </header>

      {/* Main Content Area - Layout strictly follows specifications order */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 sm:py-10 flex flex-col items-center justify-center text-center">
        
        {/* 1. 網站標題 (H1) */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          今天吃什麼？
        </h1>

        {/* 2. 簡短說明 */}
        <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-6">
          不知道吃什麼？讓拉霸機幫你決定！
        </p>

        {/* 3. 拉霸視窗 (Slot Machine Viewport with Reel & Lever) */}
        <div className="w-full">
          <SlotReel
            isSpinning={isSpinning}
            targetFood={targetFood}
            onSpinEnd={handleSpinEnd}
            onPullLever={handleStartSpin}
          />
        </div>

        {/* 4. 抽選按鈕 (Primary Orange CTA) */}
        <div className="w-full max-w-md my-4">
          <button
            type="button"
            onClick={handleStartSpin}
            disabled={isSpinning}
            className={`w-full py-4 px-8 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/50 active:scale-[0.98] ${
              isSpinning
                ? 'bg-orange-300 shadow-none cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 hover:shadow-orange-500/35 hover:-translate-y-0.5'
            }`}
          >
            {isSpinning
              ? '正在幫你選……'
              : hasSpunAtLeastOnce
              ? '再抽一次'
              : '今天吃什麼？'}
          </button>
          <div className="text-[11px] text-slate-400 mt-2 font-normal">
            按 Enter 或空白鍵亦可快速啟動抽選
          </div>
        </div>

        {/* 5. 結果區 (Result Section) */}
        <div
          className={`w-full max-w-md my-4 min-h-[96px] transition-all duration-300 ${
            finalResult
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-40 transform translate-y-1 pointer-events-none'
          }`}
          aria-live="polite"
        >
          {finalResult ? (
            <div className="bg-white rounded-2xl p-5 border border-orange-200/90 shadow-sm flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>拉霸機推薦結果</span>
              </div>
              
              {/* Mandatory Format as specified in F03: 「今天就吃：牛肉麵！」 */}
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                今天就吃：<span className="text-orange-600">{finalResult.name}</span>！
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {finalResult.subtitle}
              </p>

              {/* Action: Copy result */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">已複製推薦餐點</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>複製結果文字</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs flex items-center justify-center">
              {isSpinning ? '滾輪旋轉中，即將出爐……' : '點擊上方按鈕或拉桿，為你決定今天餐點'}
            </div>
          )}
        </div>

        {/* 6. 提醒文字 (Mandatory Caution Notice) */}
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
          提醒：結果僅供用餐靈感，請依飲食禁忌與實際供餐情況選擇
        </p>
      </main>

      {/* Footer & Specification Author Details */}
      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-5 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-slate-700">今天吃什麼？</span>
          <span className="mx-1.5">·</span>
          <span>食物隨機抽選拉霸機</span>
          <span className="mx-1.5">·</span>
          <span className="text-slate-600 font-medium">NCNU 林恩澤 113321035 資工三</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>16 種固定餐點無篩選</span>
          <span>獨立隨機抽選</span>
          <button
            type="button"
            onClick={() => setIsListModalOpen(true)}
            className="text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            檢視全部名單
          </button>
        </div>
      </footer>

      {/* Modal for viewing the fixed 16 foods */}
      <FoodListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        currentResult={finalResult}
      />
    </div>
  );
}
