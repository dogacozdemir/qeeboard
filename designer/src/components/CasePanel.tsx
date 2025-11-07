import React, { useState, useEffect } from 'react'

type CaseValue = { 
  mode: 'solid'|'gradient'|'default'; 
  solid?: string; 
  from?: string; 
  to?: string; 
  angle?: number;
}

export default function CasePanel({ value, onChange }:{ value: CaseValue; onChange: (v:CaseValue)=>void }) {
  const [mode, setMode] = useState<CaseValue['mode']>(value?.mode || 'default')
  const [solid, setSolid] = useState<string>(value?.solid || '#111827')
  const [from, setFrom] = useState<string>(value?.from || '#111827')
  const [to, setTo] = useState<string>(value?.to || '#1f2937')
  const [angle, setAngle] = useState<number>(value?.angle ?? 135)

  useEffect(()=>{
    onChange({ mode, solid, from, to, angle })
  }, [mode, solid, from, to, angle])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Mod</label>
        <select className="border rounded px-2 py-1 bg-background text-foreground" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="default">Varsayılan</option>
          <option value="solid">Tek Renk</option>
          <option value="gradient">Gradyan</option>
        </select>
      </div>

      {mode === 'solid' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Renk</label>
          <input type="color" value={solid} onChange={e=>setSolid(e.target.value)} className="w-full h-10 rounded border" />
        </div>
      )}

      {mode === 'gradient' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Başlangıç</label>
              <input type="color" value={from} onChange={e=>setFrom(e.target.value)} className="w-16 h-10 rounded border" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Bitiş</label>
              <input type="color" value={to} onChange={e=>setTo(e.target.value)} className="w-16 h-10 rounded border" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Açı: {angle}°</label>
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
}

