"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-canvas-night-elevated/95 backdrop-blur-md border-t border-hairline-dark p-4 sm:p-5 shadow-elevation-4"
        >
          <div className="container-cinematic flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-aloe-10/15 items-center justify-center shrink-0 mt-0.5">
                <Cookie size={18} className="text-aloe-10" />
              </div>
              <div className="text-caption sm:text-body-md text-link-cool-2 leading-relaxed">
                We use cookies to enhance your browsing experience and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{" "}
                <Link href="/privacy-policy" className="underline text-on-primary hover:text-aloe-10 transition-colors font-medium">Learn More</Link>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button onClick={() => setVisible(false)} className="flex-1 sm:flex-none text-center text-caption sm:text-body-md text-link-cool-2 hover:text-on-primary px-4 py-2.5 sm:py-2 rounded-pill border border-hairline-dark hover:border-shade-40 transition-colors">
                Decline
              </button>
              <button onClick={accept} className="flex-1 sm:flex-none text-center btn-primary text-sm !py-2.5 sm:!py-2 !px-6">
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
