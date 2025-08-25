import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 2200);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return <div className="toast" style={{display:'block'}} role="status" aria-live="polite">{message}</div>;
}
