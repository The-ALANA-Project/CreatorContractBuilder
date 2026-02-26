import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Mount the component after 2.5s, then trigger slide-up on next frame
      const timer = setTimeout(() => {
        setIsVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsShowing(true);
          });
        });
      }, 2500);
      return () => clearTimeout(timer);
    } else if (cookieConsent === "accepted") {
      enableGoogleAnalytics();
    }
  }, []);

  const enableGoogleAnalytics = () => {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const disableGoogleAnalytics = () => {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  const dismissBanner = () => {
    setIsAnimatingOut(true);
    setIsShowing(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 400);
  };

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    enableGoogleAnalytics();
    dismissBanner();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    disableGoogleAnalytics();
    dismissBanner();
  };

  const handleClose = () => {
    // Dismiss without changing stored preference
    dismissBanner();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        transform: isShowing && !isAnimatingOut ? "translateY(0)" : "translateY(100%)",
        transition: isAnimatingOut
          ? "transform 400ms ease-in"
          : "transform 500ms ease-out",
      }}
    >
      <div
        className="backdrop-blur-xl"
        style={{
          backgroundColor: "#131718",
          borderTop: "1px solid #FEE6EA",
          boxShadow:
            "0 -8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(254, 230, 234, 0.08)",
        }}
      >
        <div
          className="max-w-6xl mx-auto py-4 px-6"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {/* ── Mobile layout: stacked ── Desktop layout: single row ── */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">

            {/* Text Content + mobile X button row */}
            <div className="flex items-start justify-between gap-3 md:contents">
              <div className="flex-1 md:flex-1">
                <h3
                  className="text-sm mb-1"
                  style={{
                    color: "#FEE6EA",
                    fontFamily: "'Work Sans', sans-serif",
                  }}
                >
                  We use cookies
                </h3>
                <p
                  className="text-xs"
                  style={{
                    color: "rgba(254, 230, 234, 0.7)",
                    lineHeight: 1.625,
                    fontFamily: "'Work Sans', sans-serif",
                  }}
                >
                  This site uses Google Analytics and saves your contract data
                  locally. No personal information is collected.{" "}
                  <a
                    href="https://policies.google.com/technologies/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition-colors"
                    style={{ color: "rgba(254, 230, 234, 0.7)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#FEE6EA")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(254, 230, 234, 0.7)")
                    }
                  >
                    Learn more
                  </a>
                </p>
              </div>

              {/* X button — visible on mobile only (top-right of text block) */}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full transition-colors hover:bg-white/10 flex-shrink-0 md:hidden"
                style={{ color: "#FEE6EA" }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons row */}
            <div className="flex items-center gap-3 md:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none py-2 px-5 text-xs whitespace-nowrap rounded-lg transition-all"
                style={{
                  backgroundColor: "#131718",
                  color: "#FEE6EA",
                  border: "1px solid #FEE6EA",
                  fontWeight: 500,
                  fontFamily: "'Work Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEE6EA";
                  e.currentTarget.style.color = "#131718";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#131718";
                  e.currentTarget.style.color = "#FEE6EA";
                }}
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none py-2 px-5 text-xs whitespace-nowrap rounded-lg transition-all"
                style={{
                  backgroundColor: "#FEE6EA",
                  color: "#131718",
                  border: "1px solid #FEE6EA",
                  fontWeight: 500,
                  fontFamily: "'Work Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#131718";
                  e.currentTarget.style.color = "#FEE6EA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEE6EA";
                  e.currentTarget.style.color = "#131718";
                }}
              >
                Accept
              </button>

              {/* X button — desktop only (inline with action buttons) */}
              <button
                onClick={handleClose}
                className="p-2 rounded-full transition-colors ml-2 hover:bg-white/10 hidden md:block"
                style={{ color: "#FEE6EA" }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}