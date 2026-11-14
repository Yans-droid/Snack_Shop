(()=>{'use strict';const q=s=>document.querySelector(s);const money=n=>'Rp'+Math.round(n).toLocaleString('id-ID');

/* ─── Mock Snap Popup (untuk resume payment) ─── */
function mockSnapPay(orderCode, onDone) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif';
  const card = document.createElement('div');
  card.style.cssText = 'background:#fff;border-radius:16px;padding:36px 32px 28px;max-width:400px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.25)';
  card.innerHTML = `
    <div style="margin-bottom:18px">
      <div style="width:56px;height:56px;border-radius:50%;background:#f0fdf4;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M3 10h18M7 15h.01M11 15h2" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/><rect x="3" y="6" width="18" height="14" rx="2" stroke="#16a34a" stroke-width="2"/></svg>
      </div>
      <h2 style="margin:0;font-size:20px;color:#111">Simulasi Pembayaran</h2>
      <p style="color:#888;font-size:13px;margin:6px 0 0">MODE DEMO — Tanpa Midtrans</p>
    </div>
    <div style="background:#fafafa;border-radius:10px;padding:16px;margin-bottom:20px">
      <div style="font-size:13px;color:#666">Kode Pesanan</div>
      <div style="font-size:18px;font-weight:700;color:#111;margin:4px 0">${orderCode}</div>
    </div>
    <div style="display:flex;gap:10px">
      <button id="mock-cancel" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:10px;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#666">Batal</button>
      <button id="mock-pay" style="flex:1;padding:12px;border:none;border-radius:10px;background:#16a34a;color:#fff;cursor:pointer;font-size:14px;font-weight:700">✓ Bayar Sekarang</button>
    </div>
    <p style="margin:14px 0 0;font-size:11px;color:#bbb">Ini adalah simulasi pembayaran untuk pengembangan.</p>
  `;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  card.querySelector('#mock-pay').onclick = async () => {
    card.querySelector('#mock-pay').textContent = 'Memproses...';
    card.querySelector('#mock-pay').disabled = true;
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]');
      const r = await fetch('/mock-payment/settle/' + encodeURIComponent(orderCode), {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf ? csrf.content : '' }
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.message || 'Gagal');
      overlay.remove();
      onDone();
    } catch (err) {
      card.querySelector('#mock-pay').textContent = '✓ Bayar Sekarang';
      card.querySelector('#mock-pay').disabled = false;
      alert('Gagal: ' + err.message);
    }
  };
  card.querySelector('#mock-cancel').onclick = () => { overlay.remove(); onDone(); };
}

q('#refresh').onclick=async()=>{q('#message').textContent='Memeriksa status pembayaran…';try{const r=await fetch('/api/pesanan/'+encodeURIComponent(window.ORDER_CODE));const d=await r.json();if(!r.ok)throw Error(d.message||'Gagal membaca status');q('#payment-state').textContent=d.paymentStatus==='paid'?'Pembayaran berhasil'+(d.mock?' (Simulasi)':''):d.paymentStatus==='failed'?'Pembayaran gagal atau kedaluwarsa':'Menunggu pembayaran';q('#delivery-state').textContent=d.status;q('#resume-pay').style.display=d.paymentStatus==='pending'?'block':'none';if(d.receiptUrl){const a=document.querySelector('#receipt-link');if(a){a.href=d.receiptUrl;a.style.display='inline-flex'}}q('#message').textContent=d.paymentStatus==='paid'?'Terima kasih! Pesanan sedang diproses.':'Status pembayaran akan diperbarui setelah dikonfirmasi.'+(d.mock?' Klik "Lanjutkan Pembayaran" untuk simulasi.':'');}catch(e){q('#message').textContent=e.message}};

q('#resume-pay').onclick=async()=>{
  if(window.PAYMENT_MOCK){
    // Mock mode: tampilkan popup mock
    mockSnapPay(window.ORDER_CODE, ()=>q('#refresh').click());
    return;
  }
  if(!window.snap){q('#message').textContent='Layanan Midtrans belum tersedia.';return}
  try{const r=await fetch('/api/pesanan/'+encodeURIComponent(window.ORDER_CODE)+'/pay');const d=await r.json();if(!r.ok)throw Error(d.message||'Token pembayaran gagal');window.snap.pay(d.token,{onSuccess:()=>q('#refresh').click(),onPending:()=>q('#refresh').click(),onClose:()=>q('#refresh').click(),onError:()=>q('#refresh').click()})}catch(e){q('#message').textContent=e.message}
};
q('#refresh').click()})();
