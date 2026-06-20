import { Minus, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface InputQuantityProps {
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  defaultValue?: number;
  unitPrice?: number;
  minimum?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export const InputQuantity = ({
  quantity,
  size = 'md',

  onChange,
  disabled = false,
  min = 1,
  max,
}: InputQuantityProps) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserUpdateRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Prop değişikliklerini takip et
  useEffect(() => {
    if (!isUserUpdateRef.current) {
      setLocalQuantity(quantity);
    }
    isUserUpdateRef.current = false;
  }, [quantity]);

  // Local değişiklikleri 500ms sonra onChange'e gönder (onChange ref ile sabit — parent'ta inline fn güvenli)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (localQuantity !== quantity && isUserUpdateRef.current) {
      timeoutRef.current = setTimeout(() => {
        onChangeRef.current(localQuantity ?? 0);
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localQuantity, quantity]);

  const handleIncrement = () => {
    isUserUpdateRef.current = true;
    setLocalQuantity(prev => {
      const base = prev ?? 0;
      const next = base + 1;
      return max !== undefined ? Math.min(next, max) : next;
    });
  };

  const handleDecrement = () => {
    isUserUpdateRef.current = true;
    setLocalQuantity(prev => {
      const base = prev ?? 0;
      const floor = min ?? 1;
      return Math.max(base - 1, floor);
    });
  };
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
    <div className={`flex items-center border border-gray-300 w-fit ${sizeClasses[size]}`}>
      <button onClick={handleDecrement} className={`${paddingClasses[size]} hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${sizeClasses[size]}`} disabled={disabled || (localQuantity || 0) <= (min || 1)}>
        <Minus className="w-4 h-4" />
      </button>
      <span className={`${paddingClasses[size]} border-x border-gray-300 min-w-[50px] text-center ${sizeClasses[size]}`}>{localQuantity}</span>
      <button onClick={handleIncrement} className={`${paddingClasses[size]} hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${sizeClasses[size]}`} disabled={disabled || (max !== undefined && (localQuantity || 0) >= max)}>
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
