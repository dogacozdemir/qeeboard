import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/fontawesome";

// Ensure stale service workers don't interfere during development
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // Only attempt in dev, avoid impacting production PWA if added later
  if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister().catch(() => {}));
    }).catch(() => {});
  }
}

createRoot(document.getElementById("root")!).render(<App />);

// Receive init data from host (5173)
if (typeof window !== 'undefined') {
  // If embedded, ask parent to lock scroll and ensure iframe fits viewport
  try {
    const isEmbedded = window.top && window.top !== window;
    if (isEmbedded) {
      const notifyParent = () => {
        try { window.parent?.postMessage({ type: 'qeeboard:designer-viewport', action: 'lock-scroll-and-fit', height: window.innerHeight, width: window.innerWidth }, '*') } catch {}
      };
      notifyParent();
      window.addEventListener('resize', () => { notifyParent(); });
    }
  } catch {}

  window.addEventListener('message', (e: MessageEvent) => {
    const data: any = e.data
    if (data && data.type === 'qeeboard:init') {
      try {
        // Remember host origin for cross-app navigation
        if (e.origin) {
          localStorage.setItem('qb_host_origin', e.origin)
        }
        if (data.token) localStorage.setItem('qb_token', data.token)
        if (data.onboardingDone === true) {
          localStorage.setItem('onboarding_done', '1')
        } else if (data.onboardingDone === false) {
          localStorage.removeItem('onboarding_done')
        }
      } catch {}
    }
  })

  // Ask host for init if needed
  try {
    const hasKey = localStorage.getItem('onboarding_done')
    if (!hasKey) {
      window.parent?.postMessage({ type: 'qeeboard:request-init' }, '*')
    }
  } catch {}

  // When designer-side auth changes, inform parent to synchronize
  const onStorageAuth = (e: StorageEvent) => {
    if (e.key === 'qb_token') {
      try {
        const token = localStorage.getItem('qb_token') || null
        window.parent?.postMessage({ type: 'qeeboard:auth-changed', token }, '*')
      } catch {}
    }
  }
  window.addEventListener('storage', onStorageAuth)
}
