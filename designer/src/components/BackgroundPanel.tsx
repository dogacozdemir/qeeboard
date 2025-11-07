import React, { useState, useEffect } from 'react'

type BgValue = { mode: 'solid'|'gradient'|'texture'|'default'; solid?: string; from?: string; to?: string; angle?: number; texture?: string; textureUrl?: string; textureScale?: number; textureRepeat?: 'repeat'|'no-repeat'; overlayTexture?: string; overlayOpacity?: number }

type TexturePreset = {
  id: string
  name: string
  url: string
  scale: number
  repeat: 'repeat'|'no-repeat'
}

export default function BackgroundPanel({ value, onChange }:{ value: BgValue; onChange: (v:BgValue)=>void }) {
  const [mode, setMode] = useState<BgValue['mode']>(value?.mode || 'default')
  const [solid, setSolid] = useState<string>(value?.solid || '#0b0d10')
  const [from, setFrom] = useState<string>(value?.from || '#0b0d10')
  const [to, setTo] = useState<string>(value?.to || '#1f2937')
  const [angle, setAngle] = useState<number>(value?.angle ?? 135)
  const [texture, setTexture] = useState<string>(value?.texture || 'grid-light')
  const [textureUrl, setTextureUrl] = useState<string | undefined>(value?.textureUrl)
  const [textureScale, setTextureScale] = useState<number>(value?.textureScale ?? 600)
  const [textureRepeat, setTextureRepeat] = useState<'repeat'|'no-repeat'>(value?.textureRepeat || 'repeat')
  const [overlayTexture, setOverlayTexture] = useState<string>(value?.overlayTexture || 'none')
  const [overlayOpacity, setOverlayOpacity] = useState<number>(value?.overlayOpacity ?? 0.35)
  const [presets, setPresets] = useState<TexturePreset[]>(() => {
    try {
      const saved = localStorage.getItem('qb_texture_presets')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [presetName, setPresetName] = useState<string>('')
  const [showPresetSave, setShowPresetSave] = useState(false)

  function getPatternStyle(id: string, opacity: number): React.CSSProperties {
    if (id === 'none') return {}
    switch (id) {
      case 'grid-light':
        return {
          backgroundImage:
            `linear-gradient(rgba(229,231,235,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(229,231,235,${opacity}) 1px, transparent 1px)`,
          backgroundSize: '16px 16px, 16px 16px'
        }
      case 'grid-dark':
        return {
          backgroundImage:
            `linear-gradient(rgba(31,41,55,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(31,41,55,${opacity}) 1px, transparent 1px)`,
          backgroundSize: '16px 16px, 16px 16px'
        }
      case 'carbon':
        return {
          backgroundImage:
            `radial-gradient(rgba(17,17,17,${opacity}) 15%, transparent 16%), radial-gradient(rgba(17,17,17,${opacity}) 15%, transparent 16%)`,
          backgroundPosition: '0 0, 6px 6px',
          backgroundSize: '12px 12px'
        }
      case 'wood-light':
        return {
          backgroundImage:
            `repeating-linear-gradient(90deg, rgba(181,141,99,${opacity}), rgba(181,141,99,${opacity}) 12px, rgba(165,120,78,${opacity}) 12px, rgba(165,120,78,${opacity}) 24px)`
        }
      case 'wood-dark':
        return {
          backgroundImage:
            `repeating-linear-gradient(90deg, rgba(58,47,42,${opacity}), rgba(58,47,42,${opacity}) 8px, rgba(46,38,34,${opacity}) 8px, rgba(46,38,34,${opacity}) 16px)`
        }
      case 'paper':
        return {
          backgroundImage:
            `repeating-linear-gradient(0deg, rgba(0,0,0,${opacity*0.05}) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(0,0,0,${opacity*0.05}) 0 1px, transparent 1px 16px)`
        }
      case 'dots':
        return {
          backgroundImage:
            `radial-gradient(circle, rgba(0,0,0,${opacity*0.3}) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }
      case 'diagonal':
        return {
          backgroundImage:
            `repeating-linear-gradient(45deg, rgba(0,0,0,${opacity*0.1}) 0, rgba(0,0,0,${opacity*0.1}) 2px, transparent 2px, transparent 10px)`,
          backgroundSize: '14px 14px'
        }
      default:
        return {}
    }
  }

  useEffect(()=>{
    onChange({ mode, solid, from, to, angle, texture, textureUrl, textureScale, textureRepeat, overlayTexture, overlayOpacity })
  }, [mode, solid, from, to, angle, texture, textureUrl, textureScale, textureRepeat, overlayTexture, overlayOpacity])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Mod</label>
        <select className="border rounded px-2 py-1" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="default">Varsayılan</option>
          <option value="solid">Tek Renk</option>
          <option value="gradient">Gradyan</option>
          <option value="texture">Masa Deseni</option>
        </select>
      </div>

      {mode === 'solid' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Renk</label>
          <input type="color" value={solid} onChange={e=>setSolid(e.target.value)} />
        </div>
      )}

      {mode === 'gradient' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Başlangıç</label>
              <input type="color" value={from} onChange={e=>setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Bitiş</label>
              <input type="color" value={to} onChange={e=>setTo(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium">Açı</label>
              <select className="border rounded px-2 py-1" value={angle} onChange={e=>setAngle(parseInt(e.target.value))}>
                {[0,45,90,135,180].map(a=> <option key={a} value={a}>{a}°</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input id="overlay-toggle" type="checkbox" className="h-4 w-4" checked={overlayTexture !== 'none'} onChange={e=> setOverlayTexture(e.target.checked ? 'wood-dark' : 'none')} />
              <label htmlFor="overlay-toggle" className="text-sm font-medium">Desen ekle</label>
            </div>
            {overlayTexture !== 'none' && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wood-light', label: 'Wood Light' },
                    { id: 'wood-dark', label: 'Wood Dark' },
                    { id: 'carbon', label: 'Carbon' },
                    { id: 'grid-light', label: 'Grid Light' },
                    { id: 'grid-dark', label: 'Grid Dark' },
                    { id: 'paper', label: 'Paper' },
                    { id: 'dots', label: 'Dots' },
                    { id: 'diagonal', label: 'Diagonal' },
                  ].map(p => (
                    <button
                      key={p.id}
                      className={`h-12 rounded border ${overlayTexture===p.id?'ring-2 ring-primary':''}`}
                      onClick={()=>setOverlayTexture(p.id)}
                      style={{ ...getPatternStyle(p.id, 0.6) }}
                      title={p.label}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm">Desen Opaklığı</label>
                  <input type="range" min={0} max={1} step={0.05} value={overlayOpacity} onChange={e=>setOverlayOpacity(parseFloat(e.target.value))} />
                  <span className="text-xs tabular-nums">{Math.round(overlayOpacity*100)}%</span>
                </div>
              </>
            )}
          </div>

          <div
            className="rounded border"
            style={{
              backgroundImage: [overlayTexture !== 'none' ? (getPatternStyle(overlayTexture, overlayOpacity).backgroundImage || '') : '', `linear-gradient(${angle}deg, ${from}, ${to})`].filter(Boolean).join(', '),
              backgroundSize: overlayTexture !== 'none' ? `${getPatternStyle(overlayTexture, overlayOpacity).backgroundSize || 'auto'}, auto` : 'auto',
              backgroundPosition: overlayTexture !== 'none' ? `${getPatternStyle(overlayTexture, overlayOpacity).backgroundPosition || '0 0'}, 0 0` : '0 0',
              height: 60
            }}
          />
        </div>
      )}

      {mode === 'texture' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Desen</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'grid-light', label: 'Grid Light', style: { ...getPatternStyle('grid-light', 1), backgroundColor: '#fafafa' } as React.CSSProperties },
              { id: 'carbon', label: 'Carbon', style: { ...getPatternStyle('carbon', 1), backgroundColor: '#1f2937' } as React.CSSProperties },
              { id: 'wood-dark', label: 'Wood Dark', style: { ...getPatternStyle('wood-dark', 1) } as React.CSSProperties },
              { id: 'wood-light', label: 'Wood Light', style: { ...getPatternStyle('wood-light', 1) } as React.CSSProperties },
              { id: 'grid-dark', label: 'Grid Dark', style: { ...getPatternStyle('grid-dark', 1) } as React.CSSProperties },
              { id: 'paper', label: 'Paper', style: { ...getPatternStyle('paper', 1) } as React.CSSProperties },
              { id: 'dots', label: 'Dots', style: { ...getPatternStyle('dots', 1), backgroundColor: '#fafafa' } as React.CSSProperties },
              { id: 'diagonal', label: 'Diagonal', style: { ...getPatternStyle('diagonal', 1), backgroundColor: '#fafafa' } as React.CSSProperties },
              { id: 'custom', label: 'Custom (Image)', style: { background: '#111', color: '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 } as React.CSSProperties },
            ].map(tex => (
              <button key={tex.id} className={`h-16 rounded border ${texture===tex.id?'ring-2 ring-primary':''}`} onClick={()=>setTexture(tex.id)} style={tex.style} title={tex.label} />
            ))}
          </div>

          {texture === 'custom' && (
            <div className="space-y-3">
              {/* Preset List */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kayıtlı Preset'ler</label>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map(preset => (
                      <button
                        key={preset.id}
                        className="relative group rounded border p-2 hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => {
                          setTextureUrl(preset.url)
                          setTextureScale(preset.scale)
                          setTextureRepeat(preset.repeat)
                        }}
                      >
                        <div className="h-12 rounded mb-1 overflow-hidden" style={{ backgroundImage:`url(${preset.url})`, backgroundSize: `${preset.scale}px`, backgroundRepeat: preset.repeat, backgroundPosition:'center' }} />
                        <div className="text-xs font-medium truncate">{preset.name}</div>
                        <button
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            const newPresets = presets.filter(p => p.id !== preset.id)
                            setPresets(newPresets)
                            try {
                              localStorage.setItem('qb_texture_presets', JSON.stringify(newPresets))
                            } catch {}
                          }}
                        >
                          ×
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e)=>{
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const url = typeof reader.result === 'string' ? reader.result : undefined
                      setTextureUrl(url)
                      setShowPresetSave(true)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
              </div>

              {/* Scale and Repeat Controls */}
              {textureUrl && (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm w-28">Ölçek (px)</label>
                    <input type="range" min={200} max={1600} step={50} value={textureScale} onChange={(e)=>setTextureScale(parseInt(e.target.value))} />
                    <span className="text-xs tabular-nums">{textureScale}px</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm w-28">Tekrar</label>
                    <select className="border rounded px-2 py-1" value={textureRepeat} onChange={(e)=>setTextureRepeat(e.target.value as any)}>
                      <option value="repeat">Repeat</option>
                      <option value="no-repeat">No repeat</option>
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="rounded border h-24" style={{ backgroundImage:`url(${textureUrl})`, backgroundSize: `${textureScale}px`, backgroundRepeat: textureRepeat, backgroundPosition:'center' }} />

                  {/* Save Preset */}
                  {showPresetSave && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Preset adı (örn: Açık Meşe)"
                        value={presetName}
                        onChange={(e)=>setPresetName(e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        onKeyDown={(e)=>{
                          if (e.key === 'Enter' && presetName.trim()) {
                            const newPreset: TexturePreset = {
                              id: Date.now().toString(),
                              name: presetName.trim(),
                              url: textureUrl!,
                              scale: textureScale,
                              repeat: textureRepeat
                            }
                            const newPresets = [...presets, newPreset]
                            setPresets(newPresets)
                            try {
                              localStorage.setItem('qb_texture_presets', JSON.stringify(newPresets))
                            } catch {}
                            setPresetName('')
                            setShowPresetSave(false)
                          }
                        }}
                      />
                      <button
                        className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                        onClick={() => {
                          if (presetName.trim()) {
                            const newPreset: TexturePreset = {
                              id: Date.now().toString(),
                              name: presetName.trim(),
                              url: textureUrl!,
                              scale: textureScale,
                              repeat: textureRepeat
                            }
                            const newPresets = [...presets, newPreset]
                            setPresets(newPresets)
                            try {
                              localStorage.setItem('qb_texture_presets', JSON.stringify(newPresets))
                            } catch {}
                            setPresetName('')
                            setShowPresetSave(false)
                          }
                        }}
                      >
                        Kaydet
                      </button>
                      <button
                        className="px-3 py-1 border rounded text-sm"
                        onClick={() => {
                          setShowPresetSave(false)
                          setPresetName('')
                        }}
                      >
                        İptal
                      </button>
                    </div>
                  )}
                  {!showPresetSave && (
                    <button
                      className="w-full px-3 py-1 border rounded text-sm hover:bg-muted"
                      onClick={() => setShowPresetSave(true)}
                    >
                      Preset Olarak Kaydet
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button className="px-3 py-1 rounded border" onClick={()=>onChange({ mode: 'default' })}>Varsayılana Dön</button>
      </div>
    </div>
  )
}


