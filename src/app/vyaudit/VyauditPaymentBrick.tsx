"use client";

import { useEffect, useRef, useState } from "react";

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
const BRICK_CONTAINER_ID = "vyaudit-payment-brick";
const MP_SDK_URL = "https://sdk.mercadopago.com/js/v2";

let sdkLoader: Promise<void> | null = null;

function loadMercadoPago(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Mercado Pago SDK can only run in the browser"));
  }

  if (window.MercadoPago) {
    return Promise.resolve();
  }

  if (!sdkLoader) {
    sdkLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MP_SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Mercado Pago SDK"));
      document.head.appendChild(script);
    });
  }

  return sdkLoader;
}

type MercadoPagoBrickController = {
  unmount: () => void;
};

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: Record<string, unknown>) => {
      bricks: () => {
        create: (
          brickName: "payment" | string,
          containerId: string,
          settings: Record<string, unknown>,
        ) => Promise<MercadoPagoBrickController>;
      };
    };
  }
}

type Props = {
  amount: number;
  email: string;
  domain: string;
  stateToken: string;
};

type ChargeResponse = {
  id?: string | number;
  status?: string;
  error?: string;
};

export default function VyauditPaymentBrick({ amount, email, domain, stateToken }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const controllerRef = useRef<MercadoPagoBrickController | null>(null);

  useEffect(() => {
    let isMounted = true;

    const publicKey = MP_PUBLIC_KEY;
    if (!publicKey) {
      setError("Falta NEXT_PUBLIC_MP_PUBLIC_KEY para cargar Mercado Pago.");
      return () => {
        isMounted = false;
      };
    }

    async function bootstrap(pk: string) {
      try {
        await loadMercadoPago();
        if (!isMounted || !window.MercadoPago) {
          return;
        }

        const mp = new window.MercadoPago(pk, { locale: "es-CL" });
        const bricks = mp.bricks();

        const settings = {
          initialization: {
            amount,
            payer: { email },
          },
          customization: {
            hidePaymentButton: false,
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              mercadoPagoWallet: "all",
              ticket: "all",
              bankTransfer: "all",
            },
          },
          callbacks: {
            onReady: () => {
              if (isMounted) setReady(true);
            },
            onError: (err: unknown) => {
              console.error("VyAudit Brick error", err);
              if (isMounted) setError("No pudimos cargar el formulario de pago.");
            },
            onSubmit: ({ formData }: { formData: Record<string, unknown> }) =>
              new Promise<void>(async (resolve, reject) => {
                try {
                  setError(null);
                  const requestBody = {
                    ...formData,
                    state: stateToken,
                    domain,
                    idempotency_key: `vya_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                  };

                  const response = await fetch("/api/vyaudit/payment/charge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                  });

                  const data = (await response.json()) as ChargeResponse;
                  if (!response.ok || !data.id) {
                    throw new Error(data.error ?? "payment_failed");
                  }

                  resolve();

                  const status = (data.status ?? "").toLowerCase();
                  const returnUrl = `/vyaudit/return?state=${encodeURIComponent(stateToken)}&payment_id=${encodeURIComponent(String(data.id))}&status=${encodeURIComponent(status)}`;
                  window.location.href = returnUrl;
                } catch (err) {
                  console.error("VyAudit charge error", err);
                  setError("No se pudo procesar el pago. Revisa los datos o intenta con otro medio.");
                  reject(err);
                }
              }),
          },
        };

        const controller = await bricks.create("payment", BRICK_CONTAINER_ID, settings);
        if (isMounted) {
          controllerRef.current = controller;
        } else {
          controller.unmount();
        }
      } catch (err) {
        console.error("VyAudit Brick bootstrap error", err);
        if (isMounted) {
          setError("No se pudo inicializar Mercado Pago.");
        }
      }
    }

    bootstrap(publicKey);

    return () => {
      isMounted = false;
      if (controllerRef.current) {
        controllerRef.current.unmount();
      }
    };
  }, [amount, email, domain, stateToken]);

  return (
    <div className="grid gap-3">
      <div id={BRICK_CONTAINER_ID} className={!ready ? "opacity-0" : ""} aria-live="polite" />
      {!ready && !error ? <span className="text-sm text-neutral-500">Cargando formulario de pago...</span> : null}
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </div>
  );
}