"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";
let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_URL}"]`,
    );

    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
    }

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        googleScriptPromise = null;
        reject(new Error("Não foi possível carregar o login do Google."));
      },
      { once: true },
    );

    if (!script.isConnected) document.head.appendChild(script);
  });

  return googleScriptPromise;
}

interface GoogleAuthButtonProps {
  onCredential: (idToken: string) => Promise<void>;
  requiresTermsAcceptance?: boolean;
  mode: "login" | "register";
}

export function GoogleAuthButton({
  onCredential,
  requiresTermsAcceptance,
  mode,
}: GoogleAuthButtonProps) {
  const onCredentialRef = useRef(onCredential);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  onCredentialRef.current = onCredential;

  useEffect(() => {
    let mounted = true;
    setReady(false);
    setError("");

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("Login Google não configurado.");
      return;
    }

    loadGoogleScript()
      .then(() => {
        const container = containerRef.current;
        if (!mounted || !container || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          auto_select: false,
          callback: async ({ credential }) => {
            if (!credential || !mounted) return;
            setError("");
            setLoading(true);
            try {
              await onCredentialRef.current(credential);
            } catch (authError) {
              setError(
                authError instanceof Error
                  ? authError.message
                  : "Não foi possível autenticar com o Google.",
              );
            } finally {
              if (mounted) setLoading(false);
            }
          },
        });

        container.replaceChildren();
        window.google.accounts.id.renderButton(container, {
          theme: "filled_black",
          size: "large",
          text: mode === "register" ? "signup_with" : "continue_with",
          shape: "rectangular",
          width: Math.min(Math.max(container.clientWidth, 240), 400),
          logo_alignment: "center",
          locale: "pt_BR",
        });
        setReady(true);
        setError("");
      })
      .catch((scriptError: unknown) => {
        if (mounted) {
          setError(
            scriptError instanceof Error
              ? scriptError.message
              : "Não foi possível inicializar o login do Google.",
          );
        }
      });

    return () => {
      mounted = false;
      containerRef.current?.replaceChildren();
    };
  }, [mode]);

  const handleClick = () => {
    if (requiresTermsAcceptance) {
      setError("Aceita os termos");
      return;
    }

    if (!ready) {
      setError("O login do Google ainda está carregando. Tente novamente.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="relative w-full">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={loading || (!ready && !requiresTermsAcceptance)}
          className="h-11 w-full border-black bg-black text-white hover:border-zinc-800 hover:bg-zinc-800 hover:text-white"
        >
          {loading ? (
            <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="size-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                transform="translate(0 4)"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94a11.05 11.05 0 0 1-4.8 7.24l7.73 5.99c4.51-4.17 7.11-10.31 7.11-17.7Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                transform="translate(0 4)"
              />
              <path
                fill="#34A853"
                d="M24 48c6.47 0 11.9-2.13 15.87-5.76l-7.73-5.99c-2.14 1.43-4.88 2.28-8.14 2.28-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>
          )}
          {loading
            ? "Conectando..."
            : ready
              ? "Entrar com Google"
              : "Carregando Google..."}
        </Button>
        <div
          ref={containerRef}
          aria-busy={loading || !ready}
          className={`absolute inset-0 flex w-full justify-center opacity-0 ${ready && !loading && !requiresTermsAcceptance ? "pointer-events-auto" : "pointer-events-none"}`}
        />
      </div>
      {error && (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
