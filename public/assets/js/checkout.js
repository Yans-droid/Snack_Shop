(()=>{'use strict';const $=s=>document.querySelector(s), money=n=>'Rp'+Math.round(n).toLocaleString('id-ID');let cart=[];try{cart=JSON.parse(localStorage.getItem('kriukkita_cart')||'[]')}catch(e){};let catalog=[],method='QRIS',shipping={regular:12000,express:22000};const promoCode=localStorage.getItem('kriukkita_promo_code')||'';let promo=null;
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function price(base,w){return Math.round(base*({100:1,250:2.2,500:4}[w])/500)*500}
function render(){const valid=[];let sub=0;for(const item of cart){const ids=item.key.startsWith('combo_')?item.key.split('_').slice(1).map(Number):[Number(item.key.split('_')[0])];const ps=ids.map(id=>catalog.find(p=>p.id===id));if(ps.some(x=>!x))continue;const unit=ids.length===3?Math.max(0,ps.reduce((s,p)=>s+p.basePrice,0)-6000):price(ps[0].basePrice,Number(item.key.split('_')[1]));sub+=unit*item.qty;valid.push({...item,price:unit})}cart=valid;localStorage.setItem('kriukkita_cart',JSON.stringify(cart));const amount=promo?(promo.type==='percent'?Math.floor(sub*promo.value/100):promo.value):0;const disc=promo&&sub>=(promo.min_subtotal||0)?Math.min(sub,promo.type==='percent'&&promo.max_discount?promo.max_discount:amount,amount):0;$('#checkout-promo-label').textContent=promo?'Promo '+promo.code:'Kode promo';const courier=$('#courier').value;const ongkir=courier==='Express'?shipping.express:sub>=50000?0:shipping.regular;$('#summary-items').innerHTML=cart.length?cart.map(i=>`<div class="order-line"><span>${escape(i.name)} (${escape(i.weight)}) × ${i.qty}</span><strong>${money(i.price*i.qty)}</strong></div>`).join(''):'<p>Keranjang kosong. <a class="link" href="/">Lihat katalog</a></p>';$('#subtotal').textContent=money(sub);$('#discount').textContent='-'+money(disc);$('#shipping').textContent=money(ongkir);$('#total').textContent=money(sub-disc+ongkir);$('#pay-button').disabled=!cart.length;}
async function init(){try{const r=await fetch('/api/katalog');if(!r.ok)throw Error('Katalog gagal dimuat');const data=await r.json();catalog=data.products;shipping=data.shipping;render();if(promoCode&&cart.length){const resp=await fetch('/api/promo/validasi',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','X-CSRF-TOKEN':$('meta[name="csrf-token"]').content},body:JSON.stringify({code:promoCode,items:cart.map(i=>({key:i.key,qty:i.qty}))})});const body=await resp.json();if(resp.ok){promo=body;render()}else{localStorage.removeItem('kriukkita_promo_code');error('Kode promo sebelumnya sudah tidak berlaku. Belanja dapat dilanjutkan tanpa diskon.')}}}catch(e){error(e.message)}}
function error(msg){$('#checkout-error').textContent=msg;$('#checkout-error').style.display='block'}
$('#courier').addEventListener('change',render);$('#methods').onclick=e=>{const b=e.target.closest('[data-method]');if(!b)return;method=b.dataset.method;$('#methods').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b))};

/* ─── Mock Snap Popup ─── */
function mockSnapPay(orderCode, total, onDone) {
  // Overlay
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
      <div style="font-size:13px;color:#666">Total Tagihan</div>
      <div style="font-size:28px;font-weight:800;color:#111;margin:4px 0">${money(total)}</div>
      <div style="font-size:12px;color:#999">Kode: ${orderCode}</div>
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
      const r = await fetch('/mock-payment/settle/' + encodeURIComponent(orderCode), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').content
        }
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

  card.querySelector('#mock-cancel').onclick = () => {
    overlay.remove();
    onDone();
  };
}

$('#checkout-form').onsubmit=async e=>{e.preventDefault();$('#checkout-error').style.display='none';if(!cart.length)return error('Keranjang kosong.');
  // Di mock mode, tidak perlu cek window.snap
  if(!window.PAYMENT_MOCK && !window.snap)return error('Layanan pembayaran belum tersedia. Hubungi toko.');
  const btn=$('#pay-button');btn.disabled=true;const form=new FormData(e.target);const payload={buyer:form.get('buyer'),phone:form.get('phone'),city:form.get('city'),address:form.get('address'),courier:form.get('courier'),method,promo_code:promo?.code||'',items:cart.map(i=>({key:i.key,qty:i.qty}))};try{const r=await fetch('/checkout',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json','X-CSRF-TOKEN':$('meta[name="csrf-token"]').content},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw Error(data.message||Object.values(data.errors||{}).flat().join(' ')||'Checkout gagal');localStorage.removeItem('kriukkita_cart');localStorage.removeItem('kriukkita_promo_code');localStorage.removeItem('kriukkita_voucher');const go=()=>location.href='/pesanan/'+encodeURIComponent(data.code);
    if(data.mock || window.PAYMENT_MOCK){
      // Tampilkan mock popup
      mockSnapPay(data.code, data.total, go);
    } else {
      window.snap.pay(data.token,{onSuccess:go,onPending:go,onError:go,onClose:go});
    }
  }catch(ex){error(ex.message);btn.disabled=false}};
init()})();
