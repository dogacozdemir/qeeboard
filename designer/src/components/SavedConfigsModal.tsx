import React, { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FolderOpen, Trash2 } from 'lucide-react'
import { apiGet, apiDelete, getUserIdFromToken, getPreviewUrl } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { KeyboardConfig } from '@/types/keyboard'

interface SavedConfig {
  id: number
  name: string
  description?: string
  previewUrl?: string
  createdAt: string
  updatedAt: string
  layoutData: any
}

interface SavedConfigsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadConfig: (config: SavedConfig) => void
  refreshTrigger?: number // Bu değiştiğinde configs listesi yeniden yüklenir
}

export default function SavedConfigsModal({ open, onOpenChange, onLoadConfig, refreshTrigger }: SavedConfigsModalProps) {
  const [configs, setConfigs] = useState<SavedConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [failedPreviews, setFailedPreviews] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const loadConfigs = useCallback(async () => {
    const userId = getUserIdFromToken()
    if (!userId) {
      toast({ title: 'Hata', description: 'Giriş yapmanız gerekiyor', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await apiGet(`/api/configs?userId=${userId}`)
      setConfigs(res.data || [])
    } catch (error: any) {
      toast({ title: 'Hata', description: error.message || 'Tasarımlar yüklenemedi', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (open) {
      // If refreshTrigger changed, add a small delay to ensure backend has updated
      // This is especially important after preview generation
      if (refreshTrigger !== undefined && refreshTrigger > 0) {
        const timeoutId = setTimeout(() => {
          loadConfigs()
        }, 300) // 300ms delay to ensure preview is saved to database
        return () => clearTimeout(timeoutId)
      } else {
        // Normal load when modal opens
      loadConfigs()
      }
    }
  }, [open, refreshTrigger, loadConfigs]) // refreshTrigger değiştiğinde de yeniden yükle

  const handleDelete = async (configId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Bu tasarımı silmek istediğinize emin misiniz?')) return

    try {
      await apiDelete(`/api/configs/${configId}`)
      setConfigs(configs.filter(c => c.id !== configId))
      toast({ title: 'Başarılı', description: 'Tasarım silindi' })
    } catch (error: any) {
      toast({ title: 'Hata', description: error.message || 'Silme başarısız', variant: 'destructive' })
    }
  }

  const handleLoad = (config: SavedConfig) => {
    onLoadConfig(config)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Kayıtlı Tasarımlarım</DialogTitle>
          <DialogDescription>
            Kaydedilmiş tasarımlarınızı yükleyin veya silin.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
          ) : configs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Henüz kayıtlı tasarım yok</div>
          ) : (
            <div className="space-y-2">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleLoad(config)}
                >
                  {config.previewUrl && !failedPreviews.has(config.id) ? (
                    <img 
                      src={getPreviewUrl(config.previewUrl) || ''} 
                      alt={config.name} 
                      className="h-16 w-16 rounded object-cover flex-shrink-0"
                      onError={() => {
                        setFailedPreviews(prev => new Set(prev).add(config.id))
                      }}
                    />
                  ) : (() => {
                    const layout = (config.layoutData && (config.layoutData.layout || config.layoutData)) as any
                    const hasLayout = layout && Array.isArray(layout?.keys)
                    if (!hasLayout) {
                      return (
                        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )
                    }
                    const UNIT = 4
                    const BASE_SCALE = 1.1
                    const pad = 2
                    const maxW = Math.max(0, ...layout.keys.map((k:any)=>k.x + k.width))
                    const maxH = Math.max(0, ...layout.keys.map((k:any)=>k.y + k.height))
                    const svgW = Math.round(maxW * UNIT * BASE_SCALE + pad*2)
                    const svgH = Math.round(maxH * UNIT * BASE_SCALE + pad*2)
                    return (
                      <div className="h-16 w-16 rounded bg-[#0b0d10] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: '100%', maxHeight: '100%' }}>
                          <rect x={0} y={0} width={svgW} height={svgH} rx={4} ry={4} fill="#0b0d10" stroke="#1f2937" />
                          {layout.keys.map((k:any, idx:number)=>{
                            const x = Math.round(pad + k.x * UNIT * BASE_SCALE)
                            const y = Math.round(pad + k.y * UNIT * BASE_SCALE)
                            const w = Math.round(k.width * UNIT * BASE_SCALE)
                            const h = Math.round(k.height * UNIT * BASE_SCALE)
                            const fill = k.color || '#2D3748'
                            const text = k.textColor || '#FFFFFF'
                            return (
                              <g key={idx}>
                                <rect x={x} y={y} width={w} height={h} rx={2} ry={2} fill={fill} stroke="#111827" />
                                <circle cx={x + w - 2} cy={y + 2} r={1} fill={text} opacity={0.6} />
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    )
                  })()}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{config.name}</div>
                    {config.description && (
                      <div className="text-sm text-muted-foreground truncate">{config.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(config.updatedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => handleDelete(config.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

