import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function DesignerEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [searchParams] = useSearchParams()
  
  // Get configId from URL and pass it to iframe
  const configId = searchParams.get('configId')
  const iframeSrc = configId 
    ? `http://localhost:8080?configId=${configId}`
    : 'http://localhost:8080'

  useEffect(() => {
    const sendInit = () => {
      const payload = {
        type: 'qeeboard:init',
        onboardingDone: (() => {
          try { return localStorage.getItem('onboarding_done') === '1' } catch { return false }
        })(),
        token: (() => {
          try { return localStorage.getItem('qb_token') || null } catch { return null }
        })(),
      }
      try { iframeRef.current?.contentWindow?.postMessage(payload, '*') } catch {}
    }

    const onMessage = (e: MessageEvent) => {
      if (e?.data?.type === 'qeeboard:request-init') {
        sendInit()
        return
      }
      if (e?.data?.type === 'qeeboard:require-auth') {
        const returnTo = e?.data?.returnTo || '/designer?resume=1'
        window.location.assign(`/login?return=${encodeURIComponent(returnTo)}`)
        return
      }
      if (e?.data?.type === 'qeeboard:auth-changed') {
        try {
          const token = e?.data?.token || null
          if (token) localStorage.setItem('qb_token', token)
          else localStorage.removeItem('qb_token')
        } catch {}
        sendInit()
      }
      if (e?.data?.type === 'qeeboard:designer-viewport' && e?.data?.action === 'lock-scroll-and-fit') {
        // Ensure scroll is locked when iframe requests it
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overscrollBehavior = 'none'
        document.documentElement.style.overscrollBehavior = 'none'
      }
    }

    window.addEventListener('message', onMessage)
    // send on mount, and shortly after iframe loads
    const t1 = setTimeout(sendInit, 200)
    const t2 = setTimeout(sendInit, 1000)
    // Update designer when token/onboarding changes on this origin
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'qb_token' || e.key === 'onboarding_done') sendInit()
    }
    window.addEventListener('storage', onStorage)
    const onLoad = () => sendInit()
    iframeRef.current?.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('message', onMessage)
      window.removeEventListener('storage', onStorage)
      iframeRef.current?.removeEventListener('load', onLoad)
      clearTimeout(t1); clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    // Lock body scroll when this page is mounted
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalBodyOverscroll = document.body.style.overscrollBehavior
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior
    
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.documentElement.style.overscrollBehavior = 'none'
    
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.overscrollBehavior = originalBodyOverscroll
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll
    }
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#f6f6f4', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <iframe 
        ref={iframeRef} 
        src={iframeSrc}
        title="Designer" 
        scrolling="no"
        style={{ border: 0, width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  )
}


