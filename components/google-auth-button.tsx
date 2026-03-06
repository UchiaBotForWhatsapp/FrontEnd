"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type GoogleAuthButtonProps = {
  onCredential: (credential: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
};

export function GoogleAuthButton({
  onCredential,
  text = "signin_with",
  theme = "outline",
  size = "medium",
}: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [dynamicWidth, setDynamicWidth] = useState<number>(360);

  useEffect(() => {
    const updateWidth = () => {
      if (buttonRef.current?.parentElement) {
        const containerWidth = buttonRef.current.parentElement.offsetWidth;
        const validWidth = Math.min(Math.max(containerWidth, 200), 400);
        setDynamicWidth(validWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!clientId || !buttonRef.current || !scriptReady) return;

    const google = (window as any).google;
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response?.credential) onCredential(response.credential);
      },
    });

    setButtonReady(false);
    google.accounts.id.renderButton(buttonRef.current, {
      theme,
      size,
      text,
      shape: "pill",
      width: dynamicWidth,
    });

    let attempts = 0;
    const maxAttempts = 60;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      const iframe = buttonRef.current?.querySelector("iframe");
      if (iframe) {
        setButtonReady(true);
        window.clearInterval(intervalId);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(intervalId);
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [clientId, onCredential, text, theme, size, scriptReady, dynamicWidth]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="w-full flex justify-center">
        {!buttonReady && (
          <div
            className="h-6 w-6 rounded-full border-2 border-muted-foreground/40 border-t-primary animate-spin"
            aria-label="Carregando"
          />
        )}
        <div ref={buttonRef} className={buttonReady ? "" : "sr-only"} />
      </div>
    </>
  );
}
