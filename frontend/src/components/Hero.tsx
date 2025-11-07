export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Kendi özel keycap setini tasarla.</h1>
        <p>Özel tasarım keycap setini 3 adımda tasarla ve hayalini kurduğun Qeeboard'a sahip ol. Hem de Türkçe Q tuş takımıyla!</p>
        <div className="steps-row">
          <div className="step-box step1">
            <img alt="Tasarla" />
            <h3>LAYOUT SEÇ</h3>
            <p>Kullandığın keyboard modelini veya listeden dilediğin layoutu seçerek sana özel tuş takımını tasarlamaya başla.</p>
          </div>
          <div className="step-box step2">
            <img alt="Önizle" />
            <h3>TASARLA</h3>
            <p>Dilersen hazır temalardan seç, dilersen onlardan ilham alarak yeni bir tasarım yarat, dilersen de boş kanvas üzerinde hayal gücünü konuştur.</p>
          </div>
          <div className="step-box step3">
            <img alt="Sipariş Ver" />
            <h3>SİPARİŞ VER</h3>
            <p>Ve üretim zamanı! Siparişini ver, hemen üretime başlayalım ve kargolayalım. Sen de hayalindeki Qeeboard'un keyfini çıkar!</p>
          </div>
        </div>
        <a href="/designer" className="cta">Özel keycap setini tasarlamaya başla</a>
      </div>
    </section>
  )
}


