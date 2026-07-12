import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'info') => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              'font-body text-sm rounded-md px-4 py-3 shadow-lg border-l-4 animate-[slideIn_0.25s_ease-out] flex items-start justify-between gap-3',
              t.type === 'error'
                ? 'bg-asphalt-800 border-racing text-concrete'
                : t.type === 'success'
                ? 'bg-asphalt-800 border-lot text-concrete'
                : 'bg-asphalt-800 border-signal text-concrete',
            ].join(' ')}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-asphalt-300 hover:text-concrete focus-ring rounded"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
