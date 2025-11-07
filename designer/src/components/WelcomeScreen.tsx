import React, { useMemo, useState } from 'react';
import { layoutOptions, keyboardLayouts } from '@/data/layouts';
import { LayoutType } from '@/types/keyboard';
import KeyboardPreview from '@/components/KeyboardPreview';
import { ThemeCategory, ThemeType, getThemesByCategory, getTheme, calculatePositionFactor, interpolateColor } from '@/data/themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiGet, getPreviewUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
// removed toggle; handled via dropdown option

type Step = 1 | 2;

interface WelcomeScreenProps {
  onComplete: (options: { layoutType: LayoutType; themeId: ThemeType | 'none' }) => void;
  onResumeExisting?: (configId: number) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, onResumeExisting }) => {
  const [step, setStep] = useState<Step>(1);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType | ''>('');
  const [themeCategory, setThemeCategory] = useState<ThemeCategory>('none');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | 'none'>('none');
  const [finalChoice, setFinalChoice] = useState<'theme' | 'blank' | null>(null);
  const [showAllLayouts, setShowAllLayouts] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [globalDirection, setGlobalDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showResume, setShowResume] = useState(false);
  const [recent, setRecent] = useState<Array<{ id:number; name:string; previewUrl?:string; layoutData?:any }>>([]);

  const openResumeModal = async () => {
    // Try multiple times to synchronize token from parent (up to ~1.5s)
    let token = (()=>{ try { return localStorage.getItem('qb_token') } catch { return null } })()
    for (let i=0; i<5 && !token; i++) {
      try { window.parent?.postMessage({ type: 'qeeboard:request-init' }, '*') } catch {}
      await new Promise(r => setTimeout(r, 300))
      token = (()=>{ try { return localStorage.getItem('qb_token') } catch { return null } })()
    }
    if (!token) { try { window.parent?.postMessage({ type: 'qeeboard:require-auth', returnTo: '/designer?resume=1' }, '*') } catch {} return }
    try {
      const payload = JSON.parse(atob(token!.split('.')[1]))
      const userId = payload?.userId
      if (!userId) { try { window.parent?.postMessage({ type: 'qeeboard:require-auth', returnTo: '/designer?resume=1' }, '*') } catch {} return }
      const res = await apiGet(`/api/configs?userId=${userId}`)
      const items = (res?.data || []).map((c:any)=>({ id:c.id, name:c.name, previewUrl:c.previewUrl, layoutData:c.layoutData }))
      setRecent(items)
      setShowResume(true)
    } catch {
      try { window.parent?.postMessage({ type: 'qeeboard:require-auth', returnTo: '/designer?resume=1' }, '*') } catch {}
    }
  }

  const layoutsToShow = useMemo(() => {
    if (!showAllLayouts && selectedLayout) {
      const key = `${selectedLayout}-ANSI`;
      const lay = (keyboardLayouts[key] || keyboardLayouts[selectedLayout] || Object.values(keyboardLayouts)[0]) as any;
      return [{ layout: lay, optionId: selectedLayout as LayoutType }];
    }
    return layoutOptions
      .map((o) => {
        const lay = (keyboardLayouts[`${o.id}-ANSI`] || keyboardLayouts[o.id]) as any;
        if (!lay) return null;
        return { layout: lay, optionId: o.id };
      })
      .filter(Boolean) as { layout: any; optionId: LayoutType }[];
  }, [selectedLayout, showAllLayouts]);

  const themeOptions = useMemo(() => getThemesByCategory(themeCategory), [themeCategory]);

  return (
    <div className="fixed inset-0 bg-surface-gradient flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur h-16 flex items-center px-6">
        <div className="text-lg font-semibold">Hoş Geldin</div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" onClick={async()=>{
            await openResumeModal()
          }}>Önceki tasarımından devam et</Button>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => (s === 2 ? 1 : s))}>Geri</Button>
          )}
          {step < 2 && (
            <Button onClick={() => setStep((s) => (s === 1 ? 2 : s))}>İleri</Button>
          )}
          {step === 2 && (
            <Button
              disabled={finalChoice === null || (finalChoice === 'theme' && selectedTheme === 'none')}
              onClick={() => {
                const layoutType: LayoutType = (selectedLayout || '60%') as LayoutType;
                let themeIdToApply: ThemeType | 'none' = 'none';
                if (finalChoice === 'theme') {
                  if (selectedTheme.startsWith('gradient/global/') && globalDirection === 'vertical') {
                    themeIdToApply = (selectedTheme + '-vertical') as ThemeType;
                  } else {
                    themeIdToApply = selectedTheme;
                  }
                }
                onComplete({ layoutType, themeId: themeIdToApply });
              }}
            >
              Düzenlemeye Başla
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {step === 1 && (
          <>
          <div className="max-w-6xl mx-auto py-10 px-6">
            <h2 className="text-2xl font-semibold mb-2">Layout seç</h2>
            <p className="text-muted-foreground mb-6">
              Keyboard marka/modelin listede yoksa veya seçmek istediğin layout belliyse direkt bu seçenek ile ilerleyebilirsin.
            </p>

            {/* Layout dropdown + show-all toggle */}
            <div className="max-w-md mb-8">
              <Select
                  value={showAllLayouts ? '__ALL__' : (selectedLayout || '')}
                  onValueChange={(v) => {
                    if (v === '__ALL__') {
                      setShowAllLayouts(true);
                      setSelectedLayout('' as any);
                    } else {
                      setShowAllLayouts(false);
                      setSelectedLayout(v as LayoutType);
                    }
                  }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Layout seç" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="__ALL__">Seçenekleri gör (tüm layoutlar)</SelectItem>
                  {layoutOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name} — {opt.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview area */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {layoutsToShow.map(({ layout, optionId }) => {
                const isSelected = selectedLayout === optionId && !showAllLayouts;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => {
                      const isCurrentlySelected = selectedLayout === optionId && !showAllLayouts;
                      if (isCurrentlySelected) {
                        // Deselect with shrink animation, then show all
                        setFocused(false);
                        setTimeout(() => {
                          setShowAllLayouts(true);
                          setSelectedLayout('' as any);
                        }, 180);
                      } else {
                        // Select: hide others and focus
                        setShowAllLayouts(false);
                        setSelectedLayout(optionId);
                        requestAnimationFrame(() => setFocused(true));
                      }
                    }}
                    className={`w-full rounded-lg overflow-hidden text-left bg-card border ${isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border'} hover:border-primary/60 transition-colors`}
                    style={{ aspectRatio: (layout.width / layout.height) || 3 }}
                  >
                    <div className="h-[85%] w-full">
                      <KeyboardPreview
                        layout={layout}
                        selectedKeys={[]}
                        onKeySelect={() => {}}
                        onKeyDoubleClick={() => {}}
                        currentTheme={undefined}
                        fitToContainer
                        readOnly
                      />
                    </div>
                    <div className="h-[15%] w-full px-3 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
                      <span className="text-sm text-foreground truncate">{layout.name}</span>
                      <span className="text-xs text-muted-foreground">{optionId}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Focused grow-in-place preview (centered within same page) */}
          {!showAllLayouts && selectedLayout && (
            <div className="w-full flex items-center justify-center py-6">
              <div
                className={`bg-card border border-border rounded-xl overflow-hidden shadow-2xl w-[92vw] max-w-5xl transition-transform duration-200 ${focused ? 'scale-100' : 'scale-95'}`}
                style={{ aspectRatio: ((keyboardLayouts[`${selectedLayout}-ANSI`] || keyboardLayouts[selectedLayout]).width / (keyboardLayouts[`${selectedLayout}-ANSI`] || keyboardLayouts[selectedLayout]).height) || 3 }}
                onClick={() => {
                  // Clicking large preview deselects
                  setFocused(false);
                  setTimeout(() => {
                    setShowAllLayouts(true);
                    setSelectedLayout('' as any);
                  }, 180);
                }}
              >
                <KeyboardPreview
                  layout={(keyboardLayouts[`${selectedLayout}-ANSI`] || keyboardLayouts[selectedLayout])}
                  selectedKeys={[]}
                  onKeySelect={() => {}}
                  onKeyDoubleClick={() => {}}
                  currentTheme={undefined}
                  fitToContainer
                  readOnly
                />
              </div>
            </div>
          )}
          </>
        )}

        {step === 2 && (
          <div className="max-w-7xl mx-auto py-10 px-6">
            <h2 className="text-2xl font-semibold mb-8">Tema Seçimi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left: Ready themes */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Hazır tema seç</h3>
                <p className="text-muted-foreground mb-4">
                  İlham alacağın temalardan birini seç ve düzenlemeye devam et.
                </p>

                <div className="max-w-md mb-4">
                  <Select
                    value={themeCategory}
                    onValueChange={(v) => {
                      setThemeCategory(v as ThemeCategory);
                      setSelectedTheme('none');
                      setFinalChoice(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tema türü seç (tema yok)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tema yok</SelectItem>
                      <SelectItem value="gradient-global">Gradyan (global)</SelectItem>
                      <SelectItem value="gradient-position">Gradyan (position)</SelectItem>
                      <SelectItem value="two-color">İki renkli</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {themeCategory === 'gradient-global' && (
                  <div className="max-w-md mb-4">
                    <Select value={globalDirection} onValueChange={(v) => setGlobalDirection(v as any)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Yön seç (yatay/dikey)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">Yatay</SelectItem>
                        <SelectItem value="vertical">Dikey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Preset previews */}
                {themeCategory !== 'none' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {themeOptions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setSelectedTheme(t.id); setFinalChoice(null); }}
                        className={`h-24 rounded-lg border ${selectedTheme === t.id ? 'border-primary' : 'border-border'} overflow-hidden text-left`}
                        title={t.label}
                      >
                        <div className="h-full w-full" style={{
                          background: t.type === 'gradient'
                            ? `linear-gradient(135deg, ${t.colors.start}, ${(t as any).colors.end})`
                            : t.colors.start,
                        }} />
                      </button>
                    ))}
                  </div>
                )}
                {/* Live preview on selected keyboard */}
                <div className="rounded-lg border border-border overflow-hidden mb-4" style={{ aspectRatio: ((keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]).width / (keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]).height) || 3 }}>
                  <KeyboardPreview
                    layout={(function(){
                      const base = (keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]);
                      if (!selectedTheme || selectedTheme === 'none') return base;
                      const theme = getTheme(selectedTheme);
                      if (!theme) return base;
                      const cloned: any = { ...base, keys: base.keys.map(k => ({ ...k })) };
                      if (theme.type === 'solid') {
                        cloned.keys = cloned.keys.map((k: any) => ({ ...k, color: theme.colors.start, textColor: theme.textColor || k.textColor }));
                      } else if (theme.type === 'gradient') {
                        if (theme.mode === 'global') {
                          if (globalDirection === 'horizontal') {
                            const rowMap = new Map<number, any[]>();
                            cloned.keys.forEach((k: any) => { const y = Math.round(k.y); const arr = rowMap.get(y) || []; arr.push(k); rowMap.set(y, arr); });
                            const rows = Array.from(rowMap.keys()).sort((a,b)=>a-b);
                            rows.forEach((rowIdx, i) => {
                              const t = rows.length<=1 ? 0 : i/(rows.length-1);
                              const c = interpolateColor(theme.colors.start, (theme.colors as any).end, t);
                              (rowMap.get(rowIdx) || []).forEach((k: any) => { k.color = c; k.textColor = theme.textColor || k.textColor; });
                            });
                          } else {
                            const colMap = new Map<number, any[]>();
                            cloned.keys.forEach((k: any) => { const x = Math.round(k.x); const arr = colMap.get(x) || []; arr.push(k); colMap.set(x, arr); });
                            const cols = Array.from(colMap.keys()).sort((a,b)=>a-b);
                            cols.forEach((colIdx, i) => {
                              const t = cols.length<=1 ? 0 : i/(cols.length-1);
                              const c = interpolateColor(theme.colors.start, (theme.colors as any).end, t);
                              (colMap.get(colIdx) || []).forEach((k: any) => { k.color = c; k.textColor = theme.textColor || k.textColor; });
                            });
                          }
                        } else {
                          const w = cloned.width; const h = cloned.height;
                          cloned.keys = cloned.keys.map((k: any) => {
                            const f = calculatePositionFactor(k.x, k.y, w, h, theme.colors.direction || 'diagonal');
                            const c = interpolateColor(theme.colors.start, (theme.colors as any).end, f);
                            return { ...k, color: c, textColor: theme.textColor || k.textColor };
                          });
                        }
                      } else if ((theme as any).type === 'two-color') {
                        const keys = cloned.keys as any[];
                        const minX = Math.min(...keys.map(k => k.x));
                        const maxX = Math.max(...keys.map(k => k.x + k.width));
                        const minY = Math.min(...keys.map(k => k.y));
                        const maxY = Math.max(...keys.map(k => k.y + k.height));
                        cloned.keys = keys.map(k => {
                          const isTop = Math.abs(k.y - minY) < 0.01;
                          const isBottom = Math.abs((k.y + k.height) - maxY) < 0.01;
                          const isLeft = Math.abs(k.x - minX) < 0.01;
                          const isRight = Math.abs((k.x + k.width) - maxX) < 0.01;
                          const edge = isTop || isBottom || isLeft || isRight;
                          return { ...k, color: edge ? (theme as any).colors.start : (theme as any).colors.end, textColor: theme.textColor || k.textColor };
                        });
                      }
                      return cloned;
                    })()}
                    selectedKeys={[]}
                    onKeySelect={() => {}}
                    onKeyDoubleClick={() => {}}
                    currentTheme={undefined}
                    fitToContainer
                    readOnly
                  />
                </div>
                <Button variant="default" disabled={selectedTheme === 'none'} onClick={() => setFinalChoice('theme')}>Seç</Button>
              </div>

              {/* Right: Blank canvas */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Boş Kanvas</h3>
                <p className="text-muted-foreground mb-4">
                  Boş kanvas üzerinde yaratıcılığının sınırlarını zorla.
                </p>
                <div className="bg-muted/30 rounded-lg overflow-hidden" style={{ aspectRatio: ((keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]).width / (keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]).height) || 3 }}>
                  <KeyboardPreview
                    layout={(keyboardLayouts[`${(selectedLayout || '60%')}-ANSI`] || keyboardLayouts[(selectedLayout || '60%')]!)}
                    selectedKeys={[]}
                    onKeySelect={() => {}}
                    onKeyDoubleClick={() => {}}
                    currentTheme={undefined}
                    fitToContainer
                    readOnly
                  />
                </div>
                <div className="mt-4">
                  <Button variant={finalChoice === 'blank' ? 'default' : 'secondary'} onClick={() => { setFinalChoice('blank'); setSelectedTheme('none'); }}>Seç</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Auto open resume when ?resume=1 and logged-in */}
      {(() => { try {
        const params = new URLSearchParams(window.location.search);
        const shouldResume = params.get('resume') === '1';
        if (shouldResume) { setTimeout(()=>{ openResumeModal(); }, 0); }
      } catch {} return null })()}
      <Dialog open={showResume} onOpenChange={setShowResume}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Önceki Tasarımlar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recent.map(item=> {
              const layoutFromData = item.layoutData?.layout || item.layoutData
              const hasLayout = layoutFromData && Array.isArray(layoutFromData.keys)
              return (
                <button 
                  key={item.id} 
                  className="rounded-lg border border-border overflow-hidden text-left hover:border-primary transition-colors" 
                  onClick={()=>{ setShowResume(false); onResumeExisting?.(item.id) }}
                >
                  <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                    {item.previewUrl ? (
                      <img 
                        src={getPreviewUrl(item.previewUrl) || ''} 
                        alt={item.name} 
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : hasLayout ? (
                      <div className="w-full h-full p-2">
                        <KeyboardPreview
                          layout={layoutFromData}
                          selectedKeys={[]}
                          onKeySelect={() => {}}
                          onKeyDoubleClick={() => {}}
                          currentTheme={undefined}
                          fitToContainer
                          readOnly
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Önizleme yok</span>
                    )}
                  </div>
                  <div className="px-3 py-2 text-sm font-medium">{item.name}</div>
                </button>
              )
            })}
            {recent.length===0 && <div className="text-sm text-muted-foreground col-span-2 md:col-span-3 text-center py-4">Kayıtlı tasarım bulunamadı. Lütfen yeni bir tasarım oluşturun.</div>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WelcomeScreen;


