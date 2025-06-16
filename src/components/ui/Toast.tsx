'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/styles';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconProps = { className: "w-5 h-5 flex-shrink-0" };
  
  switch (type) {
    case 'success':
      return <CheckCircle2 {...iconProps} className={cn(iconProps.className, "text-green-600")} />;
    case 'error':
      return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-red-600")} />;
    case 'warning':
      return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-yellow-600")} />;
    case 'info':
      return <Info {...iconProps} className={cn(iconProps.className, "text-blue-600")} />;
    default:
      return null;
  }
};

const ToastComponent = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  const getToastStyles = () => {
    const baseStyles = "relative flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm w-full transition-all duration-300 ease-out";
    
    switch (toast.type) {
      case 'success':
        return cn(baseStyles, "bg-green-50 border-green-200");
      case 'error':
        return cn(baseStyles, "bg-red-50 border-red-200");
      case 'warning':
        return cn(baseStyles, "bg-yellow-50 border-yellow-200");
      case 'info':
        return cn(baseStyles, "bg-blue-50 border-blue-200");
      default:
        return cn(baseStyles, "bg-white border-gray-200");
    }
  };

  const getTextStyles = () => {
    switch (toast.type) {
      case 'success':
        return "text-green-900";
      case 'error':
        return "text-red-900";
      case 'warning':
        return "text-yellow-900";
      case 'info':
        return "text-blue-900";
      default:
        return "text-gray-900";
    }
  };

  const getDescriptionStyles = () => {
    switch (toast.type) {
      case 'success':
        return "text-green-700";
      case 'error':
        return "text-red-700";
      case 'warning':
        return "text-yellow-700";
      case 'info':
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div
      className={cn(
        getToastStyles(),
        isVisible && !isLeaving && "translate-x-0 opacity-100",
        !isVisible && "translate-x-full opacity-0",
        isLeaving && "translate-x-full opacity-0"
      )}
      style={{
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0
      }}
    >
      <ToastIcon type={toast.type} />
      
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium", getTextStyles())}>
          {toast.title}
        </div>
        {toast.description && (
          <div className={cn("text-sm mt-1", getDescriptionStyles())}>
            {toast.description}
          </div>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn(
              "text-sm font-medium mt-2 underline hover:no-underline transition-all",
              getTextStyles()
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider; 