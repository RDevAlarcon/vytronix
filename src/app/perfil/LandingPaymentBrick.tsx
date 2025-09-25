"use client";

import { useEffect, useRef, useState } from "react";

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
const BRICK_CONTAINER_ID = "landing-payment-brick";
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

type LandingPaymentBrickProps = {
  totalAmount: number;
  payerEmail?: string;
  fallbackUrl?: string;
};

type PaymentResponse = {
  id: number | string;
  status?: string;
};

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

export default function LandingPaymentBrick({ totalAmount, payerEmail, fallbackUrl }: LandingPaymentBrickProps) {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const controllerRef = useRef<MercadoPagoBrickController | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!MP_PUBLIC_KEY) {
      setError("Mercado Pago public key is not configured. Revisa NEXT_PUBLIC_MP_PUBLIC_KEY.");
      return () => {
        isMounted = false;
      };
    }

    async function bootstrap() {
      try {
        await loadMercadoPago();
        if (!isMounted || !window.MercadoPago) {
          return;
        }

        const mercadoPago = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "es-CL" });
        const bricks = mercadoPago.bricks();
        const initialization: Record<string, unknown> = {
          amount: totalAmount,
        };
        if (payerEmail) {
          initialization.payer = { email: payerEmail };
        }

        const settings = {
          initialization,
          customization: {
            hidePaymentButton: false,
            visual: {
              hideFormTitle: false,
            },
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
              if (!isMounted) {
                return;
              }
              setReady(true);
            },
            onError: (err: unknown) => {
              let parsedError: Record<string, unknown> | null = null;
              try {
                parsedError = typeof err === "object" && err !== null ? (err as Record<string, unknown>) : null;
                console.error("Mercado Pago Brick error", JSON.stringify(parsedError ?? { message: String(err) }));
              } catch {
                console.error("Mercado Pago Brick error", err);
              }

              if (!isMounted) {
                return;
              }

              const cause = parsedError && typeof parsedError.cause === "string" ? parsedError.cause : null;
              const message = parsedError && typeof parsedError.message === "string" ? parsedError.message : null;

              if (cause === "payment_brick_initialization_failed") {
                const friendly = message ?? "Mercado Pago no tiene medios de pago habilitados";
                if (fallbackUrl) {
                  setError(`${friendly}. Abriremos el enlace alternativo de Mercado Pago.`);
                  try {
                    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
                  } catch {
                    // ignore
                  }
                } else {
                  setError(`${friendly}. Revisa la configuracion de medios de pago en tu cuenta Mercado Pago.`);
                }
                return;
              }

              setError("No pudimos cargar el formulario de pago. Intenta mas tarde. Detalle en consola.");
            },
            onSubmit: ({ formData }: { formData: Record<string, unknown> }) =>
              new Promise<void>(async (resolve, reject) => {
                try {
                  setError(null);
                  const requestBody = { ...formData, idempotency_key: `lp_${Date.now()}_${Math.random().toString(36).slice(2)}` } as Record<string, unknown>;
                  const response = await fetch("/api/payments/landing/payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                  });

                  const data: PaymentResponse & { error?: string } = await response.json();
                  if (!response.ok) {
                    throw new Error(data.error ?? "payment_failed");
                  }

                  resolve();

                  const status = (data.status ?? "").toLowerCase();
                  const redirectStatus = status === "approved" ? "success" : status === "in_process" ? "pending" : "failure";
                  window.location.href = `/perfil?status=${redirectStatus}`;
                } catch (err) {
                  console.error("Payment submit error", err);
                  setError("No pudimos procesar el pago. Revisa los datos e intenta con otro medio. Detalle en consola.");
                  if (fallbackUrl) {
                    try {
                      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
                    } catch {
                      // ignore
                    }
                  }
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
        try {
          const mpErr = typeof err === "object" && err !== null ? (err as Record<string, unknown>) : null;
          console.error("Mercado Pago SDK load error", JSON.stringify(mpErr ?? { message: String(err) }));
        } catch {
          console.error("Mercado Pago SDK load error", err);
        }
        if (isMounted) {
          setError("No pudimos inicializar Mercado Pago. Intenta nuevamente en unos minutos.");
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
      if (controllerRef.current) {
        controllerRef.current.unmount();
      }
    };
  }, [totalAmount, payerEmail, fallbackUrl]);

  return (
    <div className="grid gap-3">
      <div id={BRICK_CONTAINER_ID} className={!ready ? "opacity-0" : ""} aria-live="polite" />
      {!ready && !error && <span className="text-sm text-neutral-500">Cargando formulario de pago...</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}


