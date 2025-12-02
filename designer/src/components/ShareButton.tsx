import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Share2, Copy, Check, Download, BarChart3, Mail, Lock, Globe } from 'lucide-react'
import { apiPost, apiGet, apiPatch, getUserIdFromToken, getPreviewUrl } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { KeyboardConfig } from '@/types/keyboard'

interface ShareButtonProps {
  config: KeyboardConfig
  currentConfigId: number | null
  currentConfigName: string | null
  onShareTokenChange?: (token: string | null) => void // Callback to notify parent when shareToken changes
}

interface ShareLinkData {
  token: string
  visitorCount: number
  isPublic: boolean
  allowedEmails: string[]
  role: 'VIEWER' | 'EDITOR'
}

export default function ShareButton({ config, currentConfigId, currentConfigName, onShareTokenChange }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [shareLinkData, setShareLinkData] = useState<ShareLinkData | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [emails, setEmails] = useState<string>('')
  const [isPublic, setIsPublic] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'VIEWER' | 'EDITOR'>('VIEWER')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Load existing share link when dialog opens
  useEffect(() => {
    if (open && currentConfigId) {
      loadShareLink()
    }
  }, [open, currentConfigId])

  const loadShareLink = async () => {
    if (!currentConfigId) return
    
    const userId = getUserIdFromToken()
    if (!userId) return

    try {
      const res = await apiGet(`/api/shares?configId=${currentConfigId}&ownerId=${userId}`)
      if (res.data && res.data.length > 0) {
        const link = res.data[0]
        setShareLinkData({
          token: link.token,
          visitorCount: link.visitorCount || 0,
          isPublic: link.isPublic || false,
          allowedEmails: (link.allowedEmails as string[]) || [],
          role: link.role || 'VIEWER'
        })
        const baseUrl = window.location.origin
        setShareUrl(`${baseUrl}/share/${link.token}`)
        setEmails((link.allowedEmails as string[]).join(', '))
        setIsPublic(link.isPublic || false)
        setSelectedRole(link.role || 'VIEWER')
        // Notify parent component about the shareToken
        onShareTokenChange?.(link.token)
      }
    } catch (error) {
      // No existing share link, that's okay
      console.log('No existing share link found')
    }
  }

  const handleCreateOrUpdateShare = async () => {
    if (!currentConfigId) {
      toast({
        title: 'Hata',
        description: 'Önce tasarımı kaydetmeniz gerekiyor',
        variant: 'destructive'
      })
      return
    }

    const userId = getUserIdFromToken()
    if (!userId) {
      toast({
        title: 'Hata',
        description: 'Giriş yapmanız gerekiyor',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      if (shareLinkData) {
        // Update existing share link
        const emailList = emails
          .split(',')
          .map(e => e.trim())
          .filter(e => e.length > 0 && e.includes('@'))

        if (!isPublic && emailList.length === 0) {
          toast({
            title: 'Hata',
            description: 'Public değilse en az bir email adresi girin',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }

        const res = await apiPatch(`/api/shares/${shareLinkData.token}`, {
          ownerId: userId,
          isPublic,
          allowedEmails: isPublic ? [] : emailList,
          role: selectedRole
        })

        setShareLinkData({
          ...shareLinkData,
          isPublic: res.data.isPublic,
          allowedEmails: res.data.allowedEmails as string[],
          role: res.data.role || selectedRole
        })
        setIsPublic(res.data.isPublic)
        setSelectedRole(res.data.role || selectedRole)
        // Ensure parent knows about the shareToken (in case it was cleared)
        if (shareLinkData?.token) {
          onShareTokenChange?.(shareLinkData.token)
        }
      } else {
        // Create new share link
        const emailList = emails
          .split(',')
          .map(e => e.trim())
          .filter(e => e.length > 0 && e.includes('@'))

        if (!isPublic && emailList.length === 0) {
          toast({
            title: 'Hata',
            description: 'Public değilse en az bir email adresi girin',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }

        const res = await apiPost('/api/shares', {
          configId: currentConfigId,
          ownerId: userId,
          allowedEmails: isPublic ? [] : emailList,
          role: selectedRole,
          isPublic
        })

        const token = res.data.token
        const baseUrl = window.location.origin
        const url = `${baseUrl}/share/${token}`
        setShareUrl(url)
        setShareLinkData({
          token,
          visitorCount: 0,
          isPublic: res.data.isPublic,
          allowedEmails: (res.data.allowedEmails as string[]) || [],
          role: res.data.role
        })
        setIsPublic(res.data.isPublic)
        // Notify parent component about the new shareToken
        onShareTokenChange?.(token)
      }

      toast({
        title: 'Başarılı',
        description: 'Paylaşım ayarları güncellendi'
      })
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error?.message || 'Paylaşım linki oluşturulamadı',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getImageBlob = async (): Promise<Blob | null> => {
    if (!currentConfigId) return null

    try {
      const configRes = await apiGet(`/api/configs/${currentConfigId}`)
      let previewUrl = configRes.data?.previewUrl

      if (!previewUrl) {
        await apiPost(`/api/configs/${currentConfigId}/preview`, {})
        const updatedRes = await apiGet(`/api/configs/${currentConfigId}`)
        previewUrl = updatedRes.data?.previewUrl
      }

      if (!previewUrl) return null

      const imageUrl = getPreviewUrl(previewUrl)
      if (!imageUrl) return null

      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return blob
    } catch (error) {
      console.error('Image fetch error:', error)
      return null
    }
  }

  const handleDownloadPNG = async () => {
    if (!currentConfigId) {
      toast({
        title: 'Hata',
        description: 'Önce tasarımı kaydetmeniz gerekiyor',
        variant: 'destructive'
      })
      return
    }

    try {
      // Use high-quality download endpoint
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const token = localStorage.getItem('qb_token')
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_URL}/api/configs/${currentConfigId}/download`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error('PNG oluşturulamadı')
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `qeeboard-tasarim-${currentConfigId}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)

      toast({
        title: 'Başarılı',
        description: 'Yüksek kaliteli PNG indirildi'
      })
    } catch (error: any) {
      console.error('Download error:', error)
      toast({
        title: 'Hata',
        description: error?.message || 'PNG indirilemedi',
        variant: 'destructive'
      })
    }
  }

  const handleWhatsAppShare = async () => {
    if (!currentConfigId) {
      toast({
        title: 'Hata',
        description: 'Önce tasarımı kaydetmeniz gerekiyor',
        variant: 'destructive'
      })
      return
    }

    let blob: Blob | null = null

    // Try to get high-quality PNG from download endpoint first
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const token = localStorage.getItem('qb_token')
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${API_URL}/api/configs/${currentConfigId}/download`, {
        method: 'GET',
        headers
      })

      if (response.ok) {
        blob = await response.blob()
      }
    } catch (error) {
      console.log('High-quality download failed, using preview:', error)
    }

    // Fallback to preview if download endpoint fails
    if (!blob) {
      blob = await getImageBlob()
    }

    if (!blob) {
      toast({
        title: 'Hata',
        description: 'Image alınamadı',
        variant: 'destructive'
      })
      return
    }

    // Check if Clipboard API is available and has permissions
    const hasClipboardSupport = 
      navigator.clipboard && 
      navigator.clipboard.write && 
      window.ClipboardItem &&
      // Check if we're in a secure context (HTTPS or localhost)
      (window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost')

    if (hasClipboardSupport) {
      try {
        const item = new ClipboardItem({ 'image/png': blob })
        await navigator.clipboard.write([item])
        toast({
          title: 'Başarılı',
          description: 'Image clipboard\'a kopyalandı! WhatsApp Web\'de bir sohbet açıp Ctrl+V (veya Cmd+V) yaparak gönderebilirsiniz.'
        })
        setTimeout(() => {
          window.open('https://web.whatsapp.com', '_blank')
        }, 500)
        return
      } catch (clipboardError) {
        // Silently fall through to download method
        console.log('Clipboard copy failed, using download method instead')
      }
    }

    // Fallback: Download the image
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `qeeboard-tasarim-${currentConfigId}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
    
    toast({
      title: 'Başarılı',
      description: 'Image indirildi! WhatsApp Web\'de dosyayı sürükleyip bırakarak gönderebilirsiniz.'
    })

    setTimeout(() => {
      window.open('https://web.whatsapp.com', '_blank')
    }, 500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: 'Kopyalandı',
        description: 'Link panoya kopyalandı'
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Paylaş"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <DialogTitle>Share design</DialogTitle>
                  <div className="flex items-center gap-2">
                    {shareLinkData && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BarChart3 className="h-4 w-4" />
                        <span>{shareLinkData.visitorCount} visitors</span>
                      </div>
                    )}
                  </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* People with access */}
          <div>
            <Label htmlFor="emails" className="text-sm font-medium">
              People with access
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="emails"
                placeholder="Add people or groups"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="pl-9"
                disabled={isPublic}
              />
            </div>
          </div>

          {/* Access level */}
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <div className="text-sm font-medium">
                  {isPublic ? 'Anyone with the link' : 'Only you can access'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isPublic ? 'Anyone on the internet with this link can view' : 'Only people you invite can access'}
                </div>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {/* Role selection */}
          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              Access role
            </Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'VIEWER' | 'EDITOR')}>
              <SelectTrigger id="role" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer (Can only view)</SelectItem>
                <SelectItem value="EDITOR">Editor (Can edit together)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedRole === 'VIEWER' 
                ? 'Viewers can only see the design, they cannot make changes'
                : 'Editors can make changes and collaborate in real-time'}
            </p>
          </div>

          {/* Copy link button */}
          {shareUrl && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 text-xs bg-background"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(shareUrl)}
                className="h-8 w-8"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleDownloadPNG}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              WhatsApp ile gönder
            </Button>
          </div>

          {/* Save button */}
          <Button
            onClick={handleCreateOrUpdateShare}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Kaydediliyor...' : shareLinkData ? 'Güncelle' : 'Link Oluştur'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
