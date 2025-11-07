import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, SaveAll } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { apiPost, apiPut, getUserIdFromToken } from '@/lib/api'
import { KeyboardConfig } from '@/types/keyboard'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface SaveConfigButtonProps {
  config: KeyboardConfig
  currentConfigId?: number | null
  currentConfigName?: string | null
  onSaved?: (configId: number, name: string) => void
}

export default function SaveConfigButton({ config, currentConfigId, currentConfigName, onSaved }: SaveConfigButtonProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveAsNew, setSaveAsNew] = useState(false)
  const { toast } = useToast()

  // Modal açıldığında mevcut config name'ini yükle (sadece saveAsNew false ise)
  useEffect(() => {
    if (open) {
      if (currentConfigId && currentConfigName && !saveAsNew) {
        setName(currentConfigName)
      } else if (!currentConfigId && !saveAsNew) {
        setName('')
      }
      // saveAsNew true ise name zaten "Farklı Kaydet" tıklandığında set edildi, değiştirme
    }
  }, [open, currentConfigId, currentConfigName, saveAsNew])

  const buildLayoutPayload = () => ({
    layout: config.layout,
    globalSettings: config.globalSettings,
    groups: config.groups,
    currentLayoutType: config.currentLayoutType,
    layoutStandard: config.layoutStandard,
    currentTheme: config.currentTheme,
  })

  const quickSave = async () => {
    const userId = getUserIdFromToken()
    if (!userId) { toast({ title: 'Hata', description: 'Giriş yapmanız gerekiyor', variant: 'destructive' }); return }
    setSaving(true)
    try {
      const layoutData = buildLayoutPayload()
      if (currentConfigId) {
        await apiPut(`/api/configs/${currentConfigId}`, { layoutData })
        
        // Generate preview after quick save
        try {
          await apiPost(`/api/configs/${currentConfigId}/preview`, {})
        } catch (e) {
          // Preview generation is optional, don't fail the save
          console.warn('Preview generation failed:', e)
        }
        
        toast({ title: 'Kaydedildi', description: 'Değişiklikler güncellendi' })
        
        // Always trigger refresh for saved configs modal (after preview generation)
        // Use currentConfigName if available, otherwise use empty string
        if (onSaved) {
          onSaved(currentConfigId, currentConfigName || '')
        }
      } else {
        // Need name → open modal in "save as new" mode
        setSaveAsNew(true)
        setOpen(true)
        return
      }
    } catch (e: any) {
      toast({ title: 'Hata', description: e?.message || 'Kaydetme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Hata', description: 'Lütfen bir isim girin', variant: 'destructive' })
      return
    }

    const userId = getUserIdFromToken()
    if (!userId) {
      toast({ title: 'Hata', description: 'Giriş yapmanız gerekiyor', variant: 'destructive' })
      return
    }

    setSaving(true)
    try {
      const layoutData = {
        layout: config.layout,
        globalSettings: config.globalSettings,
        groups: config.groups,
        currentLayoutType: config.currentLayoutType,
        layoutStandard: config.layoutStandard,
        currentTheme: config.currentTheme,
      }

      let savedConfigId: number | null = null
      let savedName: string = name
      if (currentConfigId && !saveAsNew) {
        // Update existing
        const res = await apiPut(`/api/configs/${currentConfigId}`, {
          name,
          description: description.trim() || null,
          layoutData,
        })
        savedConfigId = currentConfigId
        savedName = res.data?.name || name
        toast({ title: 'Başarılı', description: 'Tasarım güncellendi' })
      } else {
        // Create new
        const res = await apiPost('/api/configs', {
          userId,
          name,
          description: description.trim() || null,
          layoutData,
        })
        savedConfigId = res.data?.id
        savedName = res.data?.name || name
          toast({ title: 'Başarılı', description: 'Tasarım kaydedildi' })
      }

      // Generate preview after save (wait for it to complete)
      if (savedConfigId) {
        try {
          await apiPost(`/api/configs/${savedConfigId}/preview`, {})
          console.log('Preview generated successfully for config:', savedConfigId)
        } catch (e) {
          // Preview generation is optional, don't fail the save
          console.warn('Preview generation failed:', e)
        }
      }

      // Update parent with saved name (always call, even if preview generation failed)
      // This ensures refresh trigger is fired for saved configs modal
      // Call this AFTER preview generation completes (or fails)
      if (savedConfigId && savedName) {
        console.log('Calling onSaved callback with:', savedConfigId, savedName)
        onSaved?.(savedConfigId, savedName)
      }
      setOpen(false)
      setName('')
      setDescription('')
      setSaveAsNew(false)
    } catch (error: any) {
      toast({ title: 'Hata', description: error.message || 'Kaydetme başarısız', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Modal kapandığında state'leri temizle
      setSaveAsNew(false)
      setName('')
      setDescription('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted" title="Kaydet">
            <Save className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={quickSave}>
            <Save className="mr-2 h-4 w-4" /> Hızlı Kaydet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { 
            setSaveAsNew(true)
            // Eğer mevcut config name varsa, "- Kopya" ekle
            if (currentConfigName) {
              setName(`${currentConfigName} - Kopya`)
            }
            setOpen(true) 
          }}>
            <SaveAll className="mr-2 h-4 w-4" /> Farklı Kaydet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentConfigId ? 'Tasarımı Güncelle' : 'Tasarımı Kaydet'}</DialogTitle>
          <DialogDescription>
            Klavye tasarımınızı kaydedin ve başka cihazlardan erişin.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {currentConfigId && (
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Yeni kopya olarak kaydet</div>
                <div className="text-xs text-muted-foreground">Seçiliyse mevcut tasarımı güncellemek yerine yeni bir kayıt oluşturulur.</div>
              </div>
              <Switch checked={saveAsNew} onCheckedChange={(v)=>setSaveAsNew(Boolean(v))} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">İsim *</Label>
            <Input
              id="name"
              name="config-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: İlk Tasarımım"
              autoFocus
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              name="config-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opsiyonel açıklama..."
              rows={3}
              autoComplete="off"
              data-form-type="other"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Kaydediliyor...' : currentConfigId ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

