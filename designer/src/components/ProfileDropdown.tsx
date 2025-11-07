import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { clearToken } from '@/lib/api'

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)

  const goTo = (path: string) => {
    try {
      if (window.top && window.top !== window) {
        window.top.location.assign(path)
      } else {
        window.location.assign(path)
      }
    } catch {
      window.location.assign(path)
    }
  }

  const onLogout = () => {
    clearToken()
    setOpen(false)
    goTo('/login')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Profil"
        >
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <Button variant="ghost" className="w-full justify-start" onClick={() => { setOpen(false); goTo('/profile') }}>
          Hesap
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={onLogout}>
          Çıkış Yap
        </Button>
      </PopoverContent>
    </Popover>
  )
}



