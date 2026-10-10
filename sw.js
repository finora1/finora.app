const V="finora-v4";
const SHELL=["./","manifest.webmanifest","icon-192.png","icon-512.png"];
const LIVE=["firestore.googleapis.com","identitytoolkit.googleapis.com","securetoken.googleapis.com","firebaseinstallations.googleapis.com"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=="GET"||LIVE.some(h=>u.hostname.includes(h)))return;
 if(r.mode==="navigate"){
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put("./",c));return res}).catch(()=>caches.match("./")));
  return}
 e.respondWith(caches.match(r).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);
  return hit||net}))
});
