// Simple DB connector scaffolding: localStorage by default, pluggable for remote REST API later
window.DBConnector = (function(){
  const LS_KEY = 'kushoof:data:v1';

  function load(){
    try{ const raw = localStorage.getItem(LS_KEY); return raw?JSON.parse(raw):null; }catch(e){return null;}
  }
  function save(data){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(data)); return true;}catch(e){console.error(e);return false;}
  }

  // example api: replace with real endpoints when server available
  let remote = null; // {url:'https://...'}
  function setRemote(cfg){ remote = cfg; }

  async function pushToRemote(){
    if(!remote) return Promise.reject(new Error('remote not configured'));
    // simple POST (requires server side)
    return fetch(remote.url, {method:'POST',headers:{'Content-Type':'application/json'},body:localStorage.getItem(LS_KEY)});
  }

  return { load, save, setRemote, pushToRemote };
})();
