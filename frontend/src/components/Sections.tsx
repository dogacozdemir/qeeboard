export function WizardSection() {
  return (
    <section className="info-section light-bg">
      <div className="container">
        <div className="text">
          <h2>Tasarım Sihirbazı</h2>
          <p>Kullanımı kolay sihirbazımız sayesinde birkaç adımda kendi keycap setini oluşturabilirsin. Adım adım yönlendirmeler ile her detay senin kontrolünde.</p>
          <a href="/designer" className="cta">Tasarlamaya Başla!</a>
        </div>
        <img src="https://www.nerdyreptile.com/images/other/Qeeboard-Wizard1.png" alt="Tasarım Sihirbazı" />
      </div>
    </section>
  )
}

export function EaseSection() {
  return (
    <section className="info-section gradient-bg">
      <div className="container">
        <img src="https://www.nerdyreptile.com/images/other/Qeeboard-Wizard.png" alt="Tasarım Kolaylığı" />
        <div className="text">
          <h2>Tasarım Kolaylığı & Detaylılık</h2>
          <p>Hazır temaları seçebilir veya kendi tasarımını en ince ayrıntısına kadar kişiselleştirebilirsin. Renkler, fontlar, ikonlar… Hepsi senin elinde.</p>
          <a href="/designer" className="cta">Tasarlamaya Başla!</a>
        </div>
      </div>
    </section>
  )
}

export function DeliverySection() {
  return (
    <section className="info-section light-bg">
      <div className="container">
        <div className="text">
          <h2>Üretim & Teslimat</h2>
          <p>Tasarladığın set özenle üretilir ve kısa sürede adresine teslim edilir. Hem hızlı hem de güvenilir süreç garantisi ile.</p>
          <a href="/designer" className="cta">Tasarlamaya Başla!</a>
        </div>
        <img src="https://www.nerdyreptile.com/images/other/assemble.gif" alt="Üretim ve Teslimat" />
      </div>
    </section>
  )
}


