import { CartDropdown } from './CartDropdown'

export function Header() {
  return (
    <header>
      <div className="container">
        <a href="/" aria-label="Ana sayfa">
          <img src="https://www.nerdyreptile.com/images/other/qeeboard_siyah-beyaz-duzeltilmi%C5%9F.png" alt="Qeeboard Logo" />
        </a>
        <div className="actions">
          <CartDropdown />
          <a className="icon-btn" href="/profile" aria-label="Profil">
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="currentColor"/>
              <path d="M4 20.5a8 8 0 0 1 16 0V22H4v-1.5Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer>
      © <span>{new Date().getFullYear()}</span> Qeeboard. Tüm hakları saklıdır.
    </footer>
  )
}


