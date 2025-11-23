// Pro Tools - client side
// Keep code small and dependency-free

// ---------- Text → Emoji ----------
const emojiMaps = {
  mix: { a:'😀', e:'😁', i:'😂', o:'🤣', u:'😅' },
  minimal: { a:'🙂', e:'🙂', i:'🙂', o:'🙂', u:'🙂' },
  unicode: { a:'\u{1F600}' }
};
document.getElementById('t2e_btn').addEventListener('click', ()=>{
  const txt = document.getElementById('t2e_in').value || '';
  const style = document.getElementById('emojiStyle').value || 'mix';
  const map = emojiMaps[style] || emojiMaps.mix;
  const out = txt.replace(/[aeiou]/gi, ch => map[ch.toLowerCase()] || ch);
  document.getElementById('t2e_out').innerText = out || '—';
  const copyBtn = document.getElementById('t2e_copy');
  copyBtn.style.display = out ? 'inline-block' : 'none';
  copyBtn.onclick = ()=>{ navigator.clipboard.writeText(out).then(()=> alert('Copied to clipboard')) };
});

// ---------- Word Counter ----------
document.getElementById('wc_btn').addEventListener('click', ()=>{
  const t = (document.getElementById('wc_in').value || '').trim();
  if(!t){ document.getElementById('wc_out').innerText='No text.'; return; }
  const words = t.split(/\s+/).filter(Boolean).length;
  const chars = t.length;
  const readingMin = Math.max(1, Math.round(words/200));
  let score = 30;
  if(words>300) score += 40; else score += Math.round((words/300)*40);
  if(/<h1|#\s/.test(t)) score += 15;
  document.getElementById('wc_out').innerHTML = `Words: <b>${words}</b> · Characters: <b>${chars}</b> · Reading: <b>${readingMin} min</b> · SEO score: <b>${score}%</b>`;
});
document.getElementById('wc_clear').addEventListener('click', ()=>{
  document.getElementById('wc_in').value=''; document.getElementById('wc_out').innerText='';
});

// ---------- Image Compressor (client-side) ----------
let lastCompressed = null;
document.getElementById('img_compress').addEventListener('click', ()=>{
  const f = document.getElementById('img_file').files[0];
  if(!f) return alert('Select an image');
  const maxW = parseInt(document.getElementById('img_width').value) || 1200;
  let q = parseFloat(document.getElementById('img_quality').value);
  if(isNaN(q) || q<=0 || q>1) q = 0.75;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = ()=>{
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob=>{
        lastCompressed = blob;
        const url = URL.createObjectURL(blob);
        document.getElementById('img_preview').innerHTML = `<img src="${url}" style="max-width:100%"/><p class="muted">Compressed: ${Math.round(blob.size/1024)} KB</p>`;
        document.getElementById('img_download').onclick = ()=> {
          const a = document.createElement('a');
          a.href = url; a.download = 'compressed.jpg'; document.body.appendChild(a); a.click(); a.remove();
        };
      }, 'image/jpeg', q);
    };
  };
  reader.readAsDataURL(f);
});
document.getElementById('img_download').addEventListener('click', ()=>{
  if(!lastCompressed) return alert('No compressed image ready.');
  const url = URL.createObjectURL(lastCompressed);
  const a = document.createElement('a'); a.href = url; a.download = 'compressed.jpg'; document.body.appendChild(a); a.click(); a.remove();
});

// ---------- QR Generator (using qrserver API) ----------
let lastQR = '';
document.getElementById('qr_gen').addEventListener('click', ()=>{
  const v = (document.getElementById('qr_text').value || '').trim();
  if(!v) return alert('Enter URL or text');
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(v)}`;
  lastQR = url;
  document.getElementById('qr_preview').innerHTML = `<img src="${url}" alt="QR" style="max-width:100%"/>`;
  document.getElementById('qr_dl').onclick = ()=> {
    const a = document.createElement('a'); a.href = url; a.download = 'qr.png'; document.body.appendChild(a); a.click(); a.remove();
  };
});

// ---------- Password Generator ----------
document.getElementById('pw_gen').addEventListener('click', ()=>{
  const len = Math.max(4, parseInt(document.getElementById('pw_len').value) || 12);
  const type = document.getElementById('pw_type').value;
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';
  if(type === 'chars') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(type === 'nums') chars = '0123456789';
  let out = '';
  for(let i=0;i<len;i++) out += chars.charAt(Math.floor(Math.random()*chars.length));
  document.getElementById('pw_out').innerText = out;
});