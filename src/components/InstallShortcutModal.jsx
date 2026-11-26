import React, { useState, useEffect } from 'react'
import {
  Smartphone,
  Share2,
  PlusSquare,
  MoreVertical,
  Laptop,
  CheckCircle2,
  X,
  Download,
} from 'lucide-react'
import { cn } from '../utils/cn'

export default function InstallShortcutModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [platform, setPlatform] = useState('android') // 'ios' | 'android' | 'desktop'
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed / standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setIsInstalled(isStandalone)

    // Detect OS
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios')
    } else if (/android/.test(ua)) {
      setPlatform('android')
    } else {
      setPlatform('desktop')
    }

    // Capture PWA install prompt on Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        if (onClose) onClose()
      }
      setDeferredPrompt(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#053F5C]/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#053F5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-[#9FE7F5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans">
                Add Shortcut to Device
              </h3>
              <p className="text-[11px] text-[#C5E6F1] font-sans">
                Quick 1-tap clinical recall from your home screen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* OS Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2ECF2] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPlatform('android')}
              className={cn(
                'py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer',
                platform === 'android'
                  ? 'bg-white text-[#053F5C] shadow-xs'
                  : 'text-[#5C768D] hover:text-[#053F5C]'
              )}
            >
              <span>Android</span>
            </button>
            <button
              onClick={() => setPlatform('ios')}
              className={cn(
                'py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer',
                platform === 'ios'
                  ? 'bg-white text-[#053F5C] shadow-xs'
                  : 'text-[#5C768D] hover:text-[#053F5C]'
              )}
            >
              <span>iPhone / iPad</span>
            </button>
            <button
              onClick={() => setPlatform('desktop')}
              className={cn(
                'py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer',
                platform === 'desktop'
                  ? 'bg-white text-[#053F5C] shadow-xs'
                  : 'text-[#5C768D] hover:text-[#053F5C]'
              )}
            >
              <span>Laptop / PC</span>
            </button>
          </div>

          {/* Direct 1-click Install Prompt if browser supports it */}
          {deferredPrompt && (
            <div className="p-3 bg-[#EDF9FC] border border-[#9FE7F5] rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#053F5C]">
                  One-Tap Fast Install Ready
                </p>
                <p className="text-[11px] text-[#429EBD]">
                  Chrome detected. Install app icon immediately.
                </p>
              </div>
              <button
                onClick={handleNativeInstall}
                className="py-1.5 px-3 rounded-lg bg-[#053F5C] hover:bg-[#084869] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>
          )}

          {/* Platform Step-by-Step Instructions */}
          {platform === 'android' && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#053F5C]">
                On Android (Chrome / Brave / Samsung Internet):
              </p>
              <div className="space-y-2 text-xs text-[#053F5C]">
                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Tap the 3 dots (⋮)</p>
                    <p className="text-[11px] text-[#5C768D]">
                      Located at the top-right corner of your Chrome browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Select "Add to Home screen" or "Install app"</p>
                    <p className="text-[11px] text-[#5C768D]">
                      Choose Clinical Recall with the medical shield icon.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Tap "Install" / "Add"</p>
                    <p className="text-[11px] text-[#5C768D]">
                      The app opens in full-screen standalone mode without any browser URL bar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {platform === 'ios' && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#053F5C]">
                On iPhone & iPad (Apple Safari):
              </p>
              <div className="space-y-2 text-xs text-[#053F5C]">
                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold flex items-center gap-1.5">
                      Tap the Share button
                      <Share2 className="w-3.5 h-3.5 text-[#429EBD]" />
                    </p>
                    <p className="text-[11px] text-[#5C768D]">
                      Located on the bottom menu bar of Safari (Square with arrow pointing up).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-semibold flex items-center gap-1.5">
                      Scroll down & tap "Add to Home Screen"
                      <PlusSquare className="w-3.5 h-3.5 text-[#429EBD]" />
                    </p>
                    <p className="text-[11px] text-[#5C768D]">
                      Look for the square icon with a plus sign in the share sheet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Tap "Add" in top-right</p>
                    <p className="text-[11px] text-[#5C768D]">
                      Clinical Recall icon will appear directly on your iOS home screen like an App Store app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {platform === 'desktop' && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#053F5C]">
                On Laptop / Desktop (Chrome / Edge / Brave):
              </p>
              <div className="space-y-2 text-xs text-[#053F5C]">
                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Look at the URL address bar</p>
                    <p className="text-[11px] text-[#5C768D]">
                      On the right edge of the address bar, look for the "Install Clinical Recall" computer icon.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="w-5 h-5 rounded-full bg-[#053F5C] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Or tap 3 dots (⋮) &gt; "Save and share" &gt; "Install Clinical Recall"</p>
                    <p className="text-[11px] text-[#5C768D]">
                      Click "Install" to create a desktop window shortcut.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Callout */}
          <div className="p-3 bg-[#F4F7F9] rounded-xl border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#053F5C]">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Why install as a shortcut?</span>
            </div>
            <ul className="text-[11px] text-[#5C768D] space-y-0.5 pl-5 list-disc">
              <li>1-tap instant launch during ward rounds or study sessions</li>
              <li>No distracting browser address bars or navigation tabs</li>
              <li>Fast offline caching for reviewed clinical cards</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded-xl bg-[#053F5C] hover:bg-[#084869] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
