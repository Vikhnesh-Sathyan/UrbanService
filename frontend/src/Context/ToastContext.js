
import React, {
  createContext,
  useContext,
  useCallback,
  useState
} from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {

  const [toast, setToast] = useState(null);

  // Show Toast
  const showToast = useCallback((message, type = "success") => {
    setToast({
      message,
      type,
      id: Date.now()
    });
  }, []);

  // Hide Toast
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        hideToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
