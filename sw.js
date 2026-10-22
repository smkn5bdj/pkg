const C='pkg-v2',A=['./','index.html','icon.svg','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))));self.clients.claim()});
// Jaringan dulu supaya pembaruan langsung terlihat. Jika jaringan lambat (lebih dari 2,5 detik) atau mati, pakai salinan tersimpan agar aplikasi tetap cepat terbuka.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!='GET'||u.origin!=location.origin)return;
 e.respondWith(new Promise(res=>{let done=false;
  const fb=()=>caches.match(e.request).then(r=>{if(r&&!done){done=true;res(r)}return r});
  const t=setTimeout(fb,2500);
  fetch(e.request).then(r=>{clearTimeout(t);if(!done){done=true;res(r)}const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))})
   .catch(()=>{clearTimeout(t);fb().then(r=>{if(!r&&!done){done=true;res(Response.error())}})})}))});
