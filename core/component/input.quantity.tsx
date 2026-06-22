import { Minus, Plus } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export type InputQuantityHandle = {
  getValue: () => number;
  commitNow: () => void;
};

interface InputQuantityProps {
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pill';
  debounceMs?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const InputQuantity = forwardRef<InputQuantityHandle, InputQuantityProps>(function InputQuantity(
  {
    quantity,
    size = 'md',
    variant = 'default',
    debounceMs = 700,
    onChange,
    disabled = false,
    min = 1,
    max,
  },
  ref,
) {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserUpdateRef = useRef(false);
  const skipDebounceRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const commit = (value: number) => {
    isUserUpdateRef.current = false;
    onChangeRef.current(value ?? 0);
  };

  const clearPendingCommit = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => localQuantity ?? 0,
    commitNow: () => {
      clearPendingCommit();
      isUserUpdateRef.current = true;
      commit(localQuantity ?? 0);
    },
  }));

  useEffect(() => {
    if (isUserUpdateRef.current) return;

    skipDebounceRef.current = true;
    setLocalQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }
    if (!isUserUpdateRef.current) return;

    clearPendingCommit();

    if (localQuantity === quantity) {
      isUserUpdateRef.current = false;
      return;
    }

    if (debounceMs <= 0) {
      commit(localQuantity ?? 0);
    } else {
      timeoutRef.current = setTimeout(() => {
        commit(localQuantity ?? 0);
      }, debounceMs);
    }

    return clearPendingCommit;
  }, [localQuantity, quantity, debounceMs]);

  const handleIncrement = () => {
    isUserUpdateRef.current = true;
    setLocalQuantity((prev) => {
      const base = prev ?? 0;
      const next = base + 1;
      return max !== undefined ? Math.min(next, max) : next;
    });
  };

  const handleDecrement = () => {
    isUserUpdateRef.current = true;
    setLocalQuantity((prev) => {
      const base = prev ?? 0;
      const floor = min ?? 1;
      return Math.max(base - 1, floor);
    });
  };

  const floor = min ?? 1;
  const current = localQuantity ?? 0;
  const atMin = current <= floor;
  const atMax = max !== undefined && current >= max;

  if (variant === 'pill') {
    return (
      <div
        className="inline-flex items-center overflow-hidden rounded-full border border-[#D9C5B0] bg-white"
        role="group"
        aria-label="Ürün adedi"
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || atMin}
          className="flex h-11 w-11 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] active:bg-[#EDE0D1] disabled:opacity-30"
          aria-label="Adedi azalt"
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="min-w-[2.5rem] px-1 text-center font-mono text-base tabular-nums text-[#5C4638]">
          {current}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || atMax}
          className="flex h-11 w-11 items-center justify-center text-[#5C4638] transition hover:bg-[#F5EDE4] active:bg-[#EDE0D1] disabled:opacity-30"
          aria-label="Adedi artır"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  const paddingClasses = {
    sm: 'p-1',
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <div className={`flex w-fit items-center border border-gray-300 ${sizeClasses[size]}`}>
      <button
        type="button"
        onClick={handleDecrement}
        className={`${paddingClasses[size]} flex items-center justify-center transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]}`}
        disabled={disabled || atMin}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={`${paddingClasses[size]} min-w-[50px] border-x border-gray-300 text-center ${sizeClasses[size]}`}
      >
        {current}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        className={`${paddingClasses[size]} flex items-center justify-center transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]}`}
        disabled={disabled || atMax}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
});
