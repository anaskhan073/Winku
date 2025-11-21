import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'otp_resend_cooldown';

export const useResendTimer = (cooldownSeconds = 60) => {
  const [remaining, setRemaining] = useState(0);

  // Load saved cooldown on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const expiresAt = Number(saved);
    const now = Date.now();

    if (expiresAt > now) {
      const secs = Math.ceil((expiresAt - now) / 1000);
      setRemaining(secs);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  const start = useCallback(() => {
    const expiresAt = Date.now() + cooldownSeconds * 1000;
    localStorage.setItem(STORAGE_KEY, String(expiresAt));
    setRemaining(cooldownSeconds);
  }, [cooldownSeconds]);

  return { remaining, isDisabled: remaining > 0, start };
};