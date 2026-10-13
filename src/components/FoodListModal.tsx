import React from 'react';
import { FoodItem, FOOD_LIST } from '../data/foods';
import { X, CheckCircle2 } from 'lucide-react';

interface FoodListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: FoodItem | null;
}

export const FoodListModal: React.FC<FoodListModalProps> = ({
  isOpen,
  onClose,
  currentResult,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 id="food-modal-title" className="text-lg font-bold text-slate-800">
              固定 16 種餐點名單
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              依規格設定固定餐點，每種抽中機率皆均等為 1/16 (6.25%)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="關閉名單"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Food Grid */}
        <div className="overflow-y-auto p-5 sm:p-6 divide-y divide-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FOOD_LIST.map((food) => {
              const isSelected = currentResult?.id === food.id;
              return (
                <div
                  key={food.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-200 ring-1 ring-orange-300'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="w-6 text-xs font-semibold tabular-nums text-slate-400 text-center">
                    {String(food.id).padStart(2, '0')}
                  </span>
                  <span className="text-2xl" role="img" aria-label={food.name}>
                    {food.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800 truncate">
                        {food.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block truncate">
                      {food.category} · {food.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>不提供新增、修改或刪除，保持極簡公平</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            了解關閉
          </button>
        </div>
      </div>
    </div>
  );
};
