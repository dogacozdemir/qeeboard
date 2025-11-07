import React, { useState, useEffect } from 'react'

type UIValue = { 
  header: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
  footer: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
  sidebar: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
  toolbar: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
}

export default function UIPanel({ value, onChange }:{ value: UIValue; onChange: (v:UIValue)=>void }) {
  const [headerMode, setHeaderMode] = useState<UIValue['header']['mode']>(value?.header?.mode || 'default')
  const [headerSolid, setHeaderSolid] = useState<string>(value?.header?.solid || '#1a1d24')
  const [headerFrom, setHeaderFrom] = useState<string>(value?.header?.from || '#1a1d24')
  const [headerTo, setHeaderTo] = useState<string>(value?.header?.to || '#252932')
  const [headerAngle, setHeaderAngle] = useState<number>(value?.header?.angle ?? 135)

  const [footerMode, setFooterMode] = useState<UIValue['footer']['mode']>(value?.footer?.mode || 'default')
  const [footerSolid, setFooterSolid] = useState<string>(value?.footer?.solid || '#0f1116')
  const [footerFrom, setFooterFrom] = useState<string>(value?.footer?.from || '#0f1116')
  const [footerTo, setFooterTo] = useState<string>(value?.footer?.to || '#1a1d24')
  const [footerAngle, setFooterAngle] = useState<number>(value?.footer?.angle ?? 135)

  const [sidebarMode, setSidebarMode] = useState<UIValue['sidebar']['mode']>(value?.sidebar?.mode || 'default')
  const [sidebarSolid, setSidebarSolid] = useState<string>(value?.sidebar?.solid || '#14161a')
  const [sidebarFrom, setSidebarFrom] = useState<string>(value?.sidebar?.from || '#14161a')
  const [sidebarTo, setSidebarTo] = useState<string>(value?.sidebar?.to || '#1a1d24')
  const [sidebarAngle, setSidebarAngle] = useState<number>(value?.sidebar?.angle ?? 135)

  const [toolbarMode, setToolbarMode] = useState<UIValue['toolbar']['mode']>(value?.toolbar?.mode || 'default')
  const [toolbarSolid, setToolbarSolid] = useState<string>(value?.toolbar?.solid || '#14161a')
  const [toolbarFrom, setToolbarFrom] = useState<string>(value?.toolbar?.from || '#14161a')
  const [toolbarTo, setToolbarTo] = useState<string>(value?.toolbar?.to || '#1a1d24')
  const [toolbarAngle, setToolbarAngle] = useState<number>(value?.toolbar?.angle ?? 135)

  useEffect(()=>{
    onChange({ 
      header: { mode: headerMode, solid: headerSolid, from: headerFrom, to: headerTo, angle: headerAngle },
      footer: { mode: footerMode, solid: footerSolid, from: footerFrom, to: footerTo, angle: footerAngle },
      sidebar: { mode: sidebarMode, solid: sidebarSolid, from: sidebarFrom, to: sidebarTo, angle: sidebarAngle },
      toolbar: { mode: toolbarMode, solid: toolbarSolid, from: toolbarFrom, to: toolbarTo, angle: toolbarAngle },
    })
  }, [headerMode, headerSolid, headerFrom, headerTo, headerAngle, footerMode, footerSolid, footerFrom, footerTo, footerAngle, sidebarMode, sidebarSolid, sidebarFrom, sidebarTo, sidebarAngle, toolbarMode, toolbarSolid, toolbarFrom, toolbarTo, toolbarAngle])

  const renderColorSection = (
    title: string,
    mode: 'solid'|'gradient'|'default',
    setMode: (m: 'solid'|'gradient'|'default') => void,
    solid: string,
    setSolid: (s: string) => void,
    from: string,
    setFrom: (s: string) => void,
    to: string,
    setTo: (s: string) => void,
    angle: number,
    setAngle: (a: number) => void
  ) => (
    <div className="space-y-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium">Mod</label>
        <select className="border rounded px-2 py-1 text-xs bg-background text-foreground" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="default">Varsayılan</option>
          <option value="solid">Tek Renk</option>
          <option value="gradient">Gradyan</option>
        </select>
      </div>

      {mode === 'solid' && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Renk</label>
          <input type="color" value={solid} onChange={e=>setSolid(e.target.value)} className="w-full h-8 rounded border" />
        </div>
      )}

      {mode === 'gradient' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col flex-1">
              <label className="text-xs font-medium mb-1">Başlangıç</label>
              <input type="color" value={from} onChange={e=>setFrom(e.target.value)} className="w-full h-8 rounded border" />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-xs font-medium mb-1">Bitiş</label>
              <input type="color" value={to} onChange={e=>setTo(e.target.value)} className="w-full h-8 rounded border" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Açı: {angle}°</label>
            <input 
              type="range" 
              min="0" 
              max="360" 
              value={angle} 
              onChange={e=>setAngle(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {renderColorSection('Header', headerMode, setHeaderMode, headerSolid, setHeaderSolid, headerFrom, setHeaderFrom, headerTo, setHeaderTo, headerAngle, setHeaderAngle)}
      {renderColorSection('Footer', footerMode, setFooterMode, footerSolid, setFooterSolid, footerFrom, setFooterFrom, footerTo, setFooterTo, footerAngle, setFooterAngle)}
      {renderColorSection('Sidebar', sidebarMode, setSidebarMode, sidebarSolid, setSidebarSolid, sidebarFrom, setSidebarFrom, sidebarTo, setSidebarTo, sidebarAngle, setSidebarAngle)}
      {renderColorSection('Toolbar', toolbarMode, setToolbarMode, toolbarSolid, setToolbarSolid, toolbarFrom, setToolbarFrom, toolbarTo, setToolbarTo, toolbarAngle, setToolbarAngle)}
    </div>
  )
}

