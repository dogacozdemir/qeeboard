type OrderCardProps = {
  orderNo: string
  dateLabel: string
  totalLabel: string
  addressLabel: string
  title: string
  subtitle: string
  productImg: string
  quantity?: number
}

export function OrderCard(props: OrderCardProps) {
  const qty = props.quantity ?? 1
  return (
    <div className="order-card">
      <div className="order-top">
        <div className="order-top-col">
          <div className="muted-strong">SİPARİŞ TARİHİ</div>
          <div className="value">{props.dateLabel}</div>
        </div>
        <div className="order-top-col">
          <div className="muted-strong">TOPLAM</div>
          <div className="value">{props.totalLabel}</div>
        </div>
        <div className="order-top-col">
          <div className="muted-strong">TESLİMAT ADRESİ</div>
          <div className="value linklike">{props.addressLabel} ▾</div>
        </div>
        <div className="order-top-actions">
          <div className="muted-strong">SİPARİŞ NO</div>
          <div className="value small">{props.orderNo}</div>
          <div className="links">
            <a href="#">Sipariş ayrıntılarını görüntüle</a>
            <span> · </span>
            <a href="#">Fatura ▾</a>
          </div>
        </div>
      </div>

      <div className="order-main">
        <div className="product">
          <div className="thumb">
            <img src={props.productImg} alt="Ürün" />
            <span className="badge">{qty}</span>
          </div>
          <div className="info">
            <div className="delivered">Teslim edildi: {props.title}</div>
            <div className="desc">{props.subtitle}</div>
            <div className="note muted">Ürünleri iade et: 25 Ekim 2025 tarihine kadar iade edilebilir</div>
            <div className="actions">
              <button className="btn-pill primary">Tekrar Satın Alın</button>
              <button className="btn-pill">Ürününüzü görüntüleyin</button>
            </div>
          </div>
        </div>
        <div className="right-actions">
          <button className="btn-chip">Kargo takibi</button>
          <button className="btn-chip">Ürünleri iade et</button>
          <button className="btn-chip">Hediye makbuzu paylaş</button>
          <button className="btn-chip">Satıcıyla ilgili geri bildirimde bulun</button>
          <button className="btn-chip">Ürün yorumu yazın</button>
        </div>
      </div>
    </div>
  )
}


