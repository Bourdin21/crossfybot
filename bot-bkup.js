/* =======================
 * Crossfy Bot — Chrome Extension content.js
 * v5.1 — auto-inyección + listado de clases con modo selector
 * Se inyecta automáticamente en https://app.crossfyapp.com/
 * authorized.json → https://raw.githubusercontent.com/Bourdin21/crossfybot/main/authorized.json
 * ======================= */
(async function () {
  "use strict";

  // Evitar doble inyección si el script corre más de una vez
  if (document.getElementById("cfy-design-system")) return;

  const MODO_ATAQUE  = "ataque";
  const MODO_DEFENSA = "defensa";

  // ---------------------------------------------------------------------------
  // DESIGN SYSTEM
  // ---------------------------------------------------------------------------
  function inyectarEstilosGlobales() {
    if (document.getElementById("cfy-design-system")) return;
    const s = document.createElement("style");
    s.id = "cfy-design-system";
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@500;700&display=swap');

      :root {
        --cfy-bg:       #0d0f12;
        --cfy-surface:  #13161b;
        --cfy-border:   #1e2530;
        --cfy-green:    #00e676;
        --cfy-blue:     #40c4ff;
        --cfy-red:      #ff5252;
        --cfy-yellow:   #ffd740;
        --cfy-text:     #cdd6e0;
        --cfy-muted:    #4a5568;
        --cfy-font-mono:'JetBrains Mono', monospace;
        --cfy-font-ui:  'Barlow Condensed', sans-serif;
        --cfy-glow-g:   0 0 12px rgba(0,230,118,.35);
        --cfy-glow-b:   0 0 12px rgba(64,196,255,.35);
        --cfy-glow-r:   0 0 12px rgba(255,82,82,.35);
      }

      .cfy-panel::-webkit-scrollbar { width:4px; }
      .cfy-panel::-webkit-scrollbar-track { background:var(--cfy-bg); }
      .cfy-panel::-webkit-scrollbar-thumb { background:var(--cfy-border); border-radius:2px; }

      @keyframes cfy-fadein  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cfy-fadeout { from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(-6px)} }
      @keyframes cfy-slidein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cfy-pulse   { 0%,100%{opacity:1;box-shadow:0 0 6px var(--cfy-green)} 50%{opacity:.5;box-shadow:0 0 16px var(--cfy-green)} }
      @keyframes cfy-pulse-r { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes cfy-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

      /* ── Panel base ── */
      .cfy-panel {
        background: var(--cfy-surface);
        border: 1px solid var(--cfy-border);
        border-radius: 6px;
        font-family: var(--cfy-font-mono);
        color: var(--cfy-text);
        font-size: 12px;
        position: fixed;
        z-index: 9999;
      }

      /* ── Botón base ── */
      .cfy-btn {
        padding: 9px 14px;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--cfy-font-ui);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .06em;
        text-transform: uppercase;
        position: relative;
        overflow: hidden;
        background: transparent;
      }
      .cfy-btn::before {
        content:''; position:absolute; left:-20%; width:40%; height:200%; top:-50%;
        background:rgba(255,255,255,.06); transform:skewX(-20deg); transition:left .4s ease;
      }
      .cfy-btn:hover::before { left:130%; }
      .cfy-btn-full { width:100%; margin-bottom:7px; }

      .cfy-btn-ataque  { color:var(--cfy-blue);  border-color:var(--cfy-blue); }
      .cfy-btn-ataque:hover  { background:rgba(64,196,255,.08); box-shadow:var(--cfy-glow-b); }
      .cfy-btn-defensa { color:var(--cfy-green); border-color:var(--cfy-green); }
      .cfy-btn-defensa:hover { background:rgba(0,230,118,.08);  box-shadow:var(--cfy-glow-g); }
      .cfy-btn-stop    { color:var(--cfy-red);   border-color:var(--cfy-muted); }
      .cfy-btn-stop:hover    { border-color:var(--cfy-red); background:rgba(255,82,82,.08); box-shadow:var(--cfy-glow-r); }
      .cfy-btn-muted   { color:var(--cfy-muted); border-color:var(--cfy-border); }
      .cfy-btn-muted:hover   { border-color:var(--cfy-muted); color:var(--cfy-text); }

      /* ── Dot de estado ── */
      .cfy-dot {
        display:inline-block; width:7px; height:7px; border-radius:50%;
        margin-right:6px; vertical-align:middle; background:var(--cfy-muted);
      }
      .cfy-dot.active { background:var(--cfy-green); animation:cfy-pulse 1.6s ease-in-out infinite; }
      .cfy-dot.error  { background:var(--cfy-red);   animation:cfy-pulse-r 1s ease-in-out infinite; }
      .cfy-dot.wait   { background:var(--cfy-yellow); }

      /* ── Card de clase ── */
      .cfy-clase-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        margin-bottom: 5px;
        border: 1px solid var(--cfy-border);
        border-radius: 4px;
        cursor: pointer;
        transition: border-color .15s, background .15s;
        background: transparent;
        width: 100%;
        text-align: left;
      }
      .cfy-clase-card:hover {
        border-color: var(--cfy-blue);
        background: rgba(64,196,255,.05);
      }
      .cfy-clase-hora {
        color: var(--cfy-green);
        font-weight: 700;
        font-size: 13px;
        min-width: 40px;
        flex-shrink: 0;
      }
      .cfy-clase-info { flex: 1; }
      .cfy-clase-disc { color: var(--cfy-text); font-size: 11px; }
      .cfy-clase-cupo {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .06em;
        padding: 2px 6px;
        border-radius: 3px;
        flex-shrink: 0;
      }
      .cfy-cupo-ok    { background:rgba(0,230,118,.12); color:var(--cfy-green); border:1px solid rgba(0,230,118,.25); }
      .cfy-cupo-no    { background:rgba(255,82,82,.1);  color:var(--cfy-red);   border:1px solid rgba(255,82,82,.2); }

      /* ── Separador de día ── */
      .cfy-dia-header {
        font-family: var(--cfy-font-ui);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: var(--cfy-muted);
        padding: 8px 0 5px;
        border-bottom: 1px solid var(--cfy-border);
        margin-bottom: 6px;
      }
      .cfy-dia-header:first-child { padding-top: 0; }

      /* ── Spinner de carga ── */
      .cfy-spinner {
        width: 16px; height: 16px;
        border: 2px solid var(--cfy-border);
        border-top-color: var(--cfy-green);
        border-radius: 50%;
        animation: cfy-spin .7s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
      }

      /* ── Toast crítico ── */
      .cfy-toast-critical {
        display:flex; align-items:center; gap:10px; padding:12px 16px;
        border-radius:5px; font-family:var(--cfy-font-mono); font-size:12px;
        min-width:270px; max-width:360px; border-left:3px solid transparent;
        background:var(--cfy-surface); box-shadow:0 4px 20px rgba(0,0,0,.7);
        animation:cfy-fadein .22s ease; pointer-events:auto;
      }
      .cfy-toast-critical.success { border-left-color:var(--cfy-green); color:var(--cfy-green); }
      .cfy-toast-critical.danger  { border-left-color:var(--cfy-red);   color:var(--cfy-red);   }
      .cfy-toast-critical-msg { color:var(--cfy-text); flex:1; }
      .cfy-toast-critical-cls { cursor:pointer; opacity:.5; }
      .cfy-toast-critical-cls:hover { opacity:1; }

      /* ── Log de eventos ── */
      .cfy-log-entry {
        display:flex; align-items:baseline; gap:6px;
        padding:3px 0; border-bottom:1px solid var(--cfy-border);
        font-size:10px; line-height:1.4;
      }
      .cfy-log-entry:last-child { border-bottom:none; }
      .cfy-log-time  { color:var(--cfy-muted); flex-shrink:0; font-size:9px; }
      .cfy-log-msg           { color:var(--cfy-text); }
      .cfy-log-msg.info      { color:var(--cfy-blue); }
      .cfy-log-msg.success   { color:var(--cfy-green); }
      .cfy-log-msg.warning   { color:var(--cfy-yellow); }
      .cfy-log-msg.danger    { color:var(--cfy-red); }

      /* ── Badge de modo ── */
      .cfy-badge {
        display:inline-block; padding:2px 8px; border-radius:3px;
        font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
        font-family:var(--cfy-font-ui);
      }
      .cfy-badge-ataque  { background:rgba(64,196,255,.15); color:var(--cfy-blue);  border:1px solid rgba(64,196,255,.3); }
      .cfy-badge-defensa { background:rgba(0,230,118,.12);  color:var(--cfy-green); border:1px solid rgba(0,230,118,.3); }

      /* ── Historial items ── */
      .cfy-hist-item {
        display:flex; justify-content:space-between; align-items:center;
        padding:5px 0; border-bottom:1px solid var(--cfy-border); font-size:11px;
      }
      .cfy-hist-item:last-child { border-bottom:none; }
      .cfy-hist-fecha { color:var(--cfy-muted); }
      .cfy-hist-hora  { color:var(--cfy-green); font-weight:600; }

      /* ── Modal de confirmación de modo ── */
      .cfy-overlay {
        position:fixed; inset:0; background:rgba(0,0,0,.75);
        display:flex; align-items:center; justify-content:center;
        z-index:99999; backdrop-filter:blur(3px);
      }
      .cfy-modal {
        background:var(--cfy-bg); border:1px solid var(--cfy-border); border-radius:8px;
        width:340px; font-family:var(--cfy-font-mono);
        box-shadow:0 0 60px rgba(0,0,0,.8); animation:cfy-slidein .2s ease; overflow:hidden;
      }
      .cfy-modal-header {
        padding:16px 20px 12px; border-bottom:1px solid var(--cfy-border);
        font-family:var(--cfy-font-ui); font-size:11px; font-weight:700;
        letter-spacing:.1em; text-transform:uppercase; color:var(--cfy-muted);
      }
      .cfy-modal-clase {
        padding:14px 20px; border-bottom:1px solid var(--cfy-border);
      }
      .cfy-modal-body { padding:14px 16px 16px; }
      .cfy-modal-btns { display:flex; gap:8px; margin-bottom:10px; }
      .cfy-modal-btns .cfy-btn { flex:1; text-align:center; }
    `;
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------------------
  // AUTH REMOTO
  // ---------------------------------------------------------------------------
  const REMOTE_AUTH_URL   = "https://raw.githubusercontent.com/Bourdin21/crossfybot/main/authorized.json";
  const AUTH_CACHE_KEY    = "crossfy_authorized_cache";
  const AUTH_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  function saveAuthCache(entries) {
    try { localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ ts: Date.now(), entries })); } catch {}
  }
  function readAuthCache() {
    try {
      const raw = localStorage.getItem(AUTH_CACHE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !Array.isArray(obj.entries) || typeof obj.ts !== "number") return null;
      if (Date.now() - obj.ts > AUTH_CACHE_TTL_MS) return null;
      return obj.entries;
    } catch { return null; }
  }
  async function fetchAuthorizedList() {
    let res;
    try { res = await fetch(REMOTE_AUTH_URL, { method:"GET", mode:"cors", cache:"no-cache" }); }
    catch (e) { throw new Error(`Sin conexión al servidor de auth: ${e?.message ?? e}`); }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let raw;
    try { raw = await res.json(); } catch { throw new Error("authorized.json no es JSON válido."); }
    return normalizeAuthPayload(raw);
  }
  function normalizeAuthPayload(payload) {
    if (!payload || !Array.isArray(payload.users))
      throw new Error("Formato inválido: se esperaba { users:[...] }.");
    const now = new Date();
    return payload.users
      .filter(u => (u.active === undefined ? true : !!u.active) && (!u.until || new Date(u.until) >= now))
      .map(u => ({ email: String(u.email||"").trim().toLowerCase(), until: u.until ?? null }))
      .filter(u => u.email);
  }
  function isEmailAllowed(email, entries) {
    const now = new Date();
    return entries.some(u => u.email === email && (!u.until || new Date(u.until) >= now));
  }
  function getCrossfyEmail() {
    try {
      const raw = localStorage.getItem("CROSSFY-USUARIO");
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return (obj.email || obj.Email || "").trim().toLowerCase() || null;
    } catch { return null; }
  }
  async function gatekeepOrInit(initFn) {
    const email = getCrossfyEmail();
    if (!email) { setLog("No se detectó email del usuario en Crossfy.", "danger"); return; }
    let remoteEntries = null;
    try { remoteEntries = await fetchAuthorizedList(); saveAuthCache(remoteEntries); }
    catch (err) { console.warn("[auth]", err); }
    let allow = false, source = "";
    if (remoteEntries) { allow = isEmailAllowed(email, remoteEntries); source = "remoto"; }
    else { const c = readAuthCache(); if (c) { allow = isEmailAllowed(email, c); source = "caché"; } }
    if (!allow) {
      setLog(remoteEntries
        ? `Usuario no autorizado: ${email}`
        : "No se pudo validar auth y no hay caché.", "danger");
      return;
    }
    setLog(`Autorizado (${source})`, "success");
    initFn();
  }

  // ---------------------------------------------------------------------------
  // ESTADO GLOBAL
  // ---------------------------------------------------------------------------
  let intervalo           = null;
  let intentos            = 0;
  let panelPrincipal      = null;
  let panelEstado         = null;
  let panelHistorial      = null;
  let claseSeleccionada   = null;
  let ataqueCancelado     = false;
  let erroresConsecutivos = 0;
  const MAX_ERRORES       = 5;
  const LOG_MAX           = 6;
  let logEntries          = [];

  // ---------------------------------------------------------------------------
  // UTILS
  // ---------------------------------------------------------------------------
  function formatearFechaDDMMYYYY(fecha) {
    return [
      String(fecha.getDate()).padStart(2,"0"),
      String(fecha.getMonth()+1).padStart(2,"0"),
      fecha.getFullYear()
    ].join("/");
  }

  function labelDia(fecha) {
    const hoy    = new Date();
    const mañana = new Date(); mañana.setDate(mañana.getDate() + 1);
    const esHoy    = fecha.toDateString() === hoy.toDateString();
    const esMañana = fecha.toDateString() === mañana.toDateString();
    if (esHoy)    return `HOY · ${formatearFechaDDMMYYYY(fecha)}`;
    if (esMañana) return `MAÑANA · ${formatearFechaDDMMYYYY(fecha)}`;
    return formatearFechaDDMMYYYY(fecha);
  }

  // ---------------------------------------------------------------------------
  // LOG Y NOTIFICACIONES
  // ---------------------------------------------------------------------------
  function setLog(msg, tipo = "info") {
    const hora = new Date().toTimeString().slice(0, 8);
    logEntries.push({ hora, msg, tipo });
    if (logEntries.length > LOG_MAX) logEntries.shift();
    _renderLog();
  }
  function _renderLog() {
    const el = document.getElementById("cfy-log-container");
    if (!el) return;
    el.innerHTML = logEntries.slice().reverse().map(e =>
      `<div class="cfy-log-entry">
        <span class="cfy-log-time">${e.hora}</span>
        <span class="cfy-log-msg ${e.tipo}">${e.msg}</span>
      </div>`
    ).join("");
  }
  function notificarCritico(msg, tipo = "success") {
    let cont = document.getElementById("cfy-toast-container");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "cfy-toast-container";
      Object.assign(cont.style, {
        position:"fixed", bottom:"20px", left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", gap:"8px", zIndex:"100000", pointerEvents:"none",
      });
      document.body.appendChild(cont);
    }
    const toast = document.createElement("div");
    toast.className = `cfy-toast-critical ${tipo}`;
    toast.innerHTML = `
      <span style="font-weight:700">${tipo === "success" ? "✓" : "✕"}</span>
      <span class="cfy-toast-critical-msg">${msg}</span>
      <span class="cfy-toast-critical-cls">✕</span>`;
    const cerrar = () => { toast.style.animation = "cfy-fadeout .2s ease forwards"; setTimeout(() => toast.remove(), 220); };
    toast.querySelector(".cfy-toast-critical-cls").addEventListener("click", cerrar);
    cont.appendChild(toast);
    setTimeout(cerrar, 6000);
  }

  // ---------------------------------------------------------------------------
  // PANEL DE ESTADO (bottom-right) — sin cambios de lógica
  // ---------------------------------------------------------------------------
  function actualizarPanelEstado(estado, clase = null, modo = null) {
    if (!panelEstado) return;
    const esActivo = intervalo !== null;
    const esError  = estado.toLowerCase().includes("error") || estado.toLowerCase().includes("fatal") || estado.toLowerCase().includes("expirad");
    const esEspera = estado.toLowerCase().includes("esperando") || estado.toLowerCase().includes("preparando");
    const dotClass = esActivo && !esError ? "active" : esError ? "error" : esEspera ? "wait" : "";
    let modoHtml = "";
    if (modo === MODO_ATAQUE)  modoHtml = `<span class="cfy-badge cfy-badge-ataque">⚔ ATAQUE</span>`;
    if (modo === MODO_DEFENSA) modoHtml = `<span class="cfy-badge cfy-badge-defensa">🛡 DEFENSA</span>`;
    let claseHtml = "";
    if (clase) {
      const f      = clase.fecha instanceof Date ? clase.fecha : new Date(clase.fecha);
      const nombre = clase.nombreDisciplina || clase.nombre || "Clase";
      const hora   = f.toTimeString().slice(0,5);
      claseHtml = `
        <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--cfy-border)">
          <div style="color:var(--cfy-muted);font-size:10px;letter-spacing:.08em;margin-bottom:4px">OBJETIVO</div>
          <div style="color:#fff;font-size:14px;font-weight:700">${nombre}</div>
          <div style="color:var(--cfy-muted);font-size:11px;margin-top:2px">${formatearFechaDDMMYYYY(f)} · ${hora}</div>
        </div>`;
    }
    panelEstado.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-family:var(--cfy-font-ui);font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--cfy-muted)">ESTADO</span>
        ${modoHtml}
      </div>
      ${claseHtml}
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span class="cfy-dot ${dotClass}"></span>
        <span style="color:${esError?"var(--cfy-red)":esActivo?"var(--cfy-green)":"var(--cfy-text)"};font-size:12px">${estado}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--cfy-border)">
        <span style="color:var(--cfy-muted);font-size:10px;letter-spacing:.06em">INTENTOS</span>
        <span id="cfy-intentos-val" style="color:var(--cfy-green);font-weight:700;font-size:13px">${String(intentos).padStart(4,"0")}</span>
      </div>
      <div style="color:var(--cfy-muted);font-size:10px;letter-spacing:.06em;margin-bottom:6px">LOG</div>
      <div id="cfy-log-container"></div>`;
    _renderLog();
  }

  function detenerBot(mensaje, tipo = "info", estado = "", clase = null) {
    if (intervalo) { clearInterval(intervalo); intervalo = null; }
    ataqueCancelado     = true;
    erroresConsecutivos = 0;
    setLog(mensaje, tipo);
    if (tipo === "success" || tipo === "danger") notificarCritico(mensaje, tipo);
    actualizarPanelEstado(estado || mensaje, clase, null);
    // Restaurar el panel principal al estado de listado (sin bot activo)
    actualizarEstadoPanelPrincipal(false);
  }

  // ---------------------------------------------------------------------------
  // HISTORIAL
  // ---------------------------------------------------------------------------
  const HISTORIAL_KEY = "crossfy_historial_reservas";
  const HISTORIAL_MAX = 10;

  function guardarEnHistorial(registro) {
    const h = JSON.parse(localStorage.getItem(HISTORIAL_KEY) ?? "[]");
    h.push(registro);
    if (h.length > HISTORIAL_MAX) h.splice(0, h.length - HISTORIAL_MAX);
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(h));
  }
  function actualizarHistorialUI() {
    if (!panelHistorial) return;
    const h = JSON.parse(localStorage.getItem(HISTORIAL_KEY) ?? "[]").slice().reverse();
    let inner = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-family:var(--cfy-font-ui);font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--cfy-muted)">HISTORIAL</span>
      <span style="color:var(--cfy-muted);font-size:10px">${h.length}/${HISTORIAL_MAX}</span>
    </div>`;
    if (!h.length) {
      inner += `<div style="color:var(--cfy-muted);font-size:11px;text-align:center;padding:12px 0">— sin reservas —</div>`;
    } else {
      inner += h.map(i => `
        <div class="cfy-hist-item">
          <div>
            <div style="color:var(--cfy-text);font-size:10px;opacity:.7">${i.nombreDisciplina ?? ""}</div>
            <div class="cfy-hist-fecha">${i.fecha}</div>
          </div>
          <div class="cfy-hist-hora">${i.horaReserva?.slice(0,5) ?? ""}</div>
        </div>`).join("");
    }
    panelHistorial.innerHTML = inner;
  }

  // ---------------------------------------------------------------------------
  // API CROSSFY
  // ---------------------------------------------------------------------------
  function parseApiError(xhr, fallback = "Error desconocido") {
    try {
      const src  = xhr?.response ?? xhr?.responseText;
      const data = typeof src === "string" ? JSON.parse(src) : src;
      return data?.message || fallback;
    } catch { return fallback; }
  }

  function intentarReservar(idClase, claseBase) {
    crossfy.service.clases.reservar(idClase, {
      successCallback() {
        const ahora = new Date();
        guardarEnHistorial({
          fecha:            formatearFechaDDMMYYYY(claseBase.fecha instanceof Date ? claseBase.fecha : new Date(claseBase.fecha)),
          horaReserva:      ahora.toTimeString().slice(0,8),
          timestamp:        ahora.toISOString(),
          nombreDisciplina: claseBase.nombreDisciplina ?? claseBase.nombre ?? "",
        });
        actualizarHistorialUI();
        detenerBot("Clase reservada exitosamente", "success", "RESERVADO", claseBase);
      },
      errorCallback(xhr) {
        const msg = parseApiError(xhr, "Falló la reserva");
        if (msg.includes("Ya tiene un turno reservado")) {
          detenerBot(msg, "warning", "YA RESERVADO", claseBase);
        } else if (msg.includes("Ya no se pueden reservar")) {
          detenerBot(msg, "danger", "FUERA DE HORARIO", claseBase);
        } else {
          setLog(msg, "danger");
        }
      },
    });
  }

  // ---------------------------------------------------------------------------
  // TICK — sin bloqueo: cada 200ms dispara independientemente del request previo
  // ---------------------------------------------------------------------------
  function verificarYReservarClase(clase, modo) {
    if (intervalo === null) return;
    intentos++;
    const el = document.getElementById("cfy-intentos-val");
    if (el) el.textContent = String(intentos).padStart(4,"0");

    const fechaParam = formatearFechaDDMMYYYY(clase.fecha instanceof Date ? clase.fecha : new Date(clase.fecha));
    crossfy.service.clases.getClases(null, fechaParam, {
      successCallback(dataDias) {
        erroresConsecutivos = 0;
        const claseActualizada = dataDias?.[0]?.clases?.find(c => c.id === clase.id);
        if (!claseActualizada) return;

        if (!claseActualizada.sinLugares) {
          intentarReservar(claseActualizada.id, clase);
        } else if (modo === MODO_ATAQUE) {
          const claseDate    = clase.fecha instanceof Date ? clase.fecha : new Date(clase.fecha);
          const horaApertura = new Date(claseDate.getTime() - 24 * 60 * 60_000 - 60_000);
          if (new Date() >= horaApertura) {
            detenerBot("Sin cupo en modo ataque", "danger", "SIN CUPO", clase);
          }
          // Si la inscripción no abrió → seguir disparando silenciosamente
        }
        // Modo defensa sin cupo → seguir siempre
      },
      errorCallback(xhr) {
        erroresConsecutivos++;
        const msg = parseApiError(xhr, "Error al consultar clases");
        if (erroresConsecutivos >= MAX_ERRORES) {
          detenerBot(`${MAX_ERRORES} errores consecutivos: ${msg}`, "danger", "ERROR FATAL", clase);
        } else {
          setLog(`Error ${erroresConsecutivos}/${MAX_ERRORES}: ${msg}`, "warning");
        }
      },
    });
  }

  // ---------------------------------------------------------------------------
  // INICIO DEL BOT — sin cambios de lógica respecto a v5
  // ---------------------------------------------------------------------------
  function iniciarBotConClase(modo, claseSel) {
    if (intervalo) { setLog("Ya hay un proceso activo. Detenelo primero.", "warning"); return; }
    claseSeleccionada   = claseSel;
    intentos            = 0;
    ataqueCancelado     = false;
    erroresConsecutivos = 0;
    actualizarPanelEstado("Preparando…", claseSeleccionada, modo);
    actualizarEstadoPanelPrincipal(true); // bloquear botones durante ejecución

    if (modo === MODO_ATAQUE) {
      const claseDate     = claseSeleccionada.fecha instanceof Date ? claseSeleccionada.fecha : new Date(claseSeleccionada.fecha);
      const MS_SEG        = 1_000;
      const MS_MIN        = 60 * MS_SEG;
      const MS_DIA        = 24 * 60 * MS_MIN;
      const ahora         = new Date();
      const inicioTeorico = new Date(claseDate.getTime() - MS_DIA);
      const inicioReal    = new Date(inicioTeorico.getTime() - 15 * MS_SEG); // 15s antes
      const fin           = new Date(claseDate.getTime() + 5 * MS_MIN);

      if (ahora >= claseDate) {
        setLog("Inscripción habilitada → modo defensa", "info");
        actualizarPanelEstado("Modo defensa (habilitada)", claseSeleccionada, MODO_DEFENSA);
        intervalo = setInterval(() => verificarYReservarClase(claseSeleccionada, MODO_DEFENSA), 2000);
        return;
      }
      if (ahora >= fin) {
        setLog("Fuera de ventana de ataque.", "warning");
        actualizarPanelEstado("FUERA DE VENTANA", claseSeleccionada, modo);
        actualizarEstadoPanelPrincipal(false);
        return;
      }

      const delay       = Math.max(0, inicioReal - ahora);
      const horaInicio  = inicioReal.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
      const horaTeorica = inicioTeorico.toLocaleTimeString("es-AR", { hour:"2-digit", minute:"2-digit" });
      setLog(`Ataque arranca a las ${horaInicio} (15s antes de ${horaTeorica})`, "info");
      actualizarPanelEstado(`Esperando → ${horaInicio}`, claseSeleccionada, modo);

      setTimeout(async () => {
        if (ataqueCancelado) return;
        if (intervalo !== null) { setLog("Proceso activo. Ataque cancelado.", "warning"); return; }
        if (new Date() >= fin)  { setLog("Ventana expirada.", "danger"); actualizarPanelEstado("EXPIRADO", claseSeleccionada, modo); actualizarEstadoPanelPrincipal(false); return; }

        // Re-validar autorización (~24hs después del inicio)
        setLog("Re-validando autorización…", "info");
        const email = getCrossfyEmail();
        let reauth  = false;
        try {
          const entries = await fetchAuthorizedList();
          saveAuthCache(entries);
          reauth = isEmailAllowed(email, entries);
        } catch {
          const cached = readAuthCache();
          if (cached) reauth = isEmailAllowed(email, cached);
        }
        if (!reauth) {
          setLog("Autorización expirada. Bot no iniciado.", "danger");
          actualizarPanelEstado("AUTH EXPIRADA", claseSeleccionada, modo);
          actualizarEstadoPanelPrincipal(false);
          return;
        }

        setLog("Iniciando ataque…", "info");
        intervalo = setInterval(() => {
          if (ataqueCancelado || new Date() >= fin) {
            detenerBot("Fin de ventana de ataque", "danger", "VENTANA EXPIRADA", claseSeleccionada);
            return;
          }
          verificarYReservarClase(claseSeleccionada, MODO_ATAQUE);
        }, 200);
      }, delay);

    } else {
      setLog("Modo defensa iniciado", "info");
      actualizarPanelEstado("En espera de cupo…", claseSeleccionada, MODO_DEFENSA);
      intervalo = setInterval(() => verificarYReservarClase(claseSeleccionada, MODO_DEFENSA), 2000);
    }
  }

  // ---------------------------------------------------------------------------
  // NUEVO: Panel principal con listado de clases HOY + MAÑANA
  // ---------------------------------------------------------------------------

  /**
   * Carga clases de hoy y mañana en paralelo y renderiza el listado.
   */
  function cargarClases() {
    const listEl = document.getElementById("cfy-clase-lista");
    if (!listEl) return;

    listEl.innerHTML = `<div style="text-align:center;padding:20px 0;color:var(--cfy-muted)">
      <span class="cfy-spinner"></span>Cargando clases…
    </div>`;

    const hoy    = new Date();
    const mañana = new Date(); mañana.setDate(mañana.getDate() + 1);
    const pHoy    = formatearFechaDDMMYYYY(hoy);
    const pMañana = formatearFechaDDMMYYYY(mañana);

    let resHoy = null, resMañana = null, errHoy = false, errMañana = false;

    const intentarRender = () => {
      if ((resHoy !== null || errHoy) && (resMañana !== null || errMañana)) {
        renderClases(listEl, [
          { label: labelDia(hoy),    clases: resHoy    ?? [], error: errHoy },
          { label: labelDia(mañana), clases: resMañana ?? [], error: errMañana },
        ]);
      }
    };

    crossfy.service.clases.getClases(null, pHoy, {
      successCallback(data) { resHoy = data?.[0]?.clases ?? []; intentarRender(); },
      errorCallback()       { errHoy = true; intentarRender(); },
    });
    crossfy.service.clases.getClases(null, pMañana, {
      successCallback(data) { resMañana = data?.[0]?.clases ?? []; intentarRender(); },
      errorCallback()       { errMañana = true; intentarRender(); },
    });
  }

  /**
   * Renderiza el listado de clases agrupado por día.
   */
  function renderClases(container, dias) {
    container.innerHTML = "";

    let hayClases = false;
    dias.forEach(({ label, clases, error }) => {
      const header = document.createElement("div");
      header.className = "cfy-dia-header";
      header.textContent = label;
      container.appendChild(header);

      if (error) {
        container.insertAdjacentHTML("beforeend",
          `<div style="color:var(--cfy-red);font-size:11px;padding:6px 0 8px">Error al cargar clases</div>`);
        return;
      }
      if (!clases.length) {
        container.insertAdjacentHTML("beforeend",
          `<div style="color:var(--cfy-muted);font-size:11px;padding:6px 0 8px">Sin clases disponibles</div>`);
        return;
      }

      hayClases = true;
      clases.forEach(c => {
        const f          = new Date(c.fecha);
        const hora       = f.toTimeString().slice(0,5);
        const nombre     = c.nombreDisciplina || c.disciplina || "Sin nombre";
        const sinLugares = !!c.sinLugares;

        const card = document.createElement("button");
        card.className = `cfy-clase-card${sinLugares ? " sin-cupo" : ""}`;
        card.innerHTML = `
          <span class="cfy-clase-hora">${hora}</span>
          <span class="cfy-clase-info">
            <span class="cfy-clase-disc">${nombre}</span>
          </span>
          <span class="cfy-clase-cupo ${sinLugares ? "cfy-cupo-no" : "cfy-cupo-ok"}">
            ${sinLugares ? "SIN CUPO" : "CON CUPO"}
          </span>`;

          card.addEventListener("click", () => {
            confirmarModo({
              id:               c.id,
              fecha:            f,
              nombre:           nombre,
              nombreDisciplina: nombre,
            });
          });
        container.appendChild(card);
      });
    });

    if (!hayClases) {
      container.insertAdjacentHTML("beforeend",
        `<div style="color:var(--cfy-muted);font-size:11px;text-align:center;padding:10px 0">Sin clases encontradas</div>`);
    }
  }

  /**
   * Modal de selección de modo: ⚔ ATACAR / 🛡 DEFENDER
   */
  function confirmarModo(clase) {
    if (intervalo) {
      setLog("Bot activo. Detenelo antes de seleccionar otra clase.", "warning");
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "cfy-overlay";

    const f      = clase.fecha instanceof Date ? clase.fecha : new Date(clase.fecha);
    const hora   = f.toTimeString().slice(0,5);
    const esMañana = f.toDateString() === (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toDateString(); })();

    overlay.innerHTML = `
      <div class="cfy-modal">
        <div class="cfy-modal-header">Seleccioná el modo</div>
        <div class="cfy-modal-clase">
          <div style="color:#fff;font-size:16px;font-weight:700">${hora} · ${clase.nombreDisciplina}</div>
          <div style="color:var(--cfy-muted);font-size:11px;margin-top:3px">${formatearFechaDDMMYYYY(f)}</div>
          ${esMañana
            ? `<div style="color:var(--cfy-yellow);font-size:10px;margin-top:6px">⚠ Clase de mañana → recomendado ATACAR</div>`
            : `<div style="color:var(--cfy-blue);font-size:10px;margin-top:6px">ℹ Clase de hoy → recomendado DEFENDER</div>`
          }
        </div>
        <div class="cfy-modal-body">
          <div class="cfy-modal-btns">
            <button id="cfy-btn-atacar"  class="cfy-btn cfy-btn-ataque">⚔ ATACAR</button>
            <button id="cfy-btn-defender" class="cfy-btn cfy-btn-defensa">🛡 DEFENDER</button>
          </div>
          <button id="cfy-btn-cancelar" class="cfy-btn cfy-btn-muted" style="width:100%;text-align:center">cancelar</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector("#cfy-btn-atacar").addEventListener("click", () => {
      document.body.removeChild(overlay);
      iniciarBotConClase(MODO_ATAQUE, clase);
    });
    overlay.querySelector("#cfy-btn-defender").addEventListener("click", () => {
      document.body.removeChild(overlay);
      iniciarBotConClase(MODO_DEFENSA, clase);
    });
    overlay.querySelector("#cfy-btn-cancelar").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
  }

  /**
   * Habilita/deshabilita los botones del panel principal según si el bot está activo.
   */
  function actualizarEstadoPanelPrincipal(botActivo) {
    const btnDetener    = document.getElementById("cfy-btn-detener");
    const btnActualizar = document.getElementById("cfy-btn-actualizar");
    if (btnDetener)    btnDetener.style.opacity    = botActivo ? "1" : ".4";
    if (btnActualizar) btnActualizar.style.opacity = botActivo ? ".4" : "1";
    if (btnActualizar) btnActualizar.style.pointerEvents = botActivo ? "none" : "auto";
  }

  // ---------------------------------------------------------------------------
  // CREAR UI COMPLETA
  // ---------------------------------------------------------------------------
  function crearUI() {
    inyectarEstilosGlobales();

    // ── Panel principal (top-right): listado de clases ──
    panelPrincipal = document.createElement("div");
    panelPrincipal.className = "cfy-panel";
    panelPrincipal.style.cssText = "top:20px;right:20px;width:280px;padding:14px;max-height:calc(100vh - 280px);display:flex;flex-direction:column;";

    panelPrincipal.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--cfy-border);flex-shrink:0">
        <div style="width:26px;height:26px;border-radius:4px;background:var(--cfy-green);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">🤖</div>
        <div>
          <div style="font-family:var(--cfy-font-ui);font-weight:700;font-size:15px;letter-spacing:.06em;color:#fff">CROSSFY BOT</div>
          <div style="font-size:9px;color:var(--cfy-muted);letter-spacing:.08em">v5.1 · AUTO-RESERVE</div>
        </div>
      </div>

      <div id="cfy-clase-lista" style="flex:1;overflow-y:auto;margin-bottom:10px;"></div>

      <div style="flex-shrink:0;padding-top:8px;border-top:1px solid var(--cfy-border);display:flex;gap:8px;">
        <button id="cfy-btn-detener"    class="cfy-btn cfy-btn-stop"  style="flex:1;opacity:.4">■ DETENER</button>
        <button id="cfy-btn-actualizar" class="cfy-btn cfy-btn-muted" style="flex:1">↺ ACTUALIZAR</button>
      </div>`;

    document.body.appendChild(panelPrincipal);

    panelPrincipal.querySelector("#cfy-btn-detener").addEventListener("click", () => {
      if (intervalo || !ataqueCancelado) {
        ataqueCancelado = true;
        detenerBot("Bot detenido manualmente", "danger", "DETENIDO", claseSeleccionada);
      } else {
        setLog("No hay proceso activo.", "info");
      }
    });

    panelPrincipal.querySelector("#cfy-btn-actualizar").addEventListener("click", () => {
      if (intervalo) { setLog("Detenelo antes de actualizar.", "warning"); return; }
      cargarClases();
    });

    // ── Panel estado (bottom-right) ──
    panelEstado = document.createElement("div");
    panelEstado.className = "cfy-panel";
    panelEstado.style.cssText = "bottom:20px;right:20px;width:280px;padding:14px;";
    document.body.appendChild(panelEstado);
    actualizarPanelEstado("Listo", null, null);

    // ── Panel historial (bottom-LEFT) ──
    panelHistorial = document.createElement("div");
    panelHistorial.className = "cfy-panel";
    panelHistorial.style.cssText = "bottom:20px;left:20px;width:230px;padding:14px;max-height:220px;overflow-y:auto;";
    document.body.appendChild(panelHistorial);
    actualizarHistorialUI();

    // Cargar clases al inicio
    cargarClases();
  }

  // ---------------------------------------------------------------------------
  // BOOTSTRAP: esperar a que crossfy cargue y pasar gatekeeper
  // ---------------------------------------------------------------------------
  const MAX_WAIT_MS = 20_000;
  const startWait   = Date.now();

  const esperarCrossfy = setInterval(() => {
    if (typeof crossfy !== "undefined" && crossfy?.service?.clases) {
      clearInterval(esperarCrossfy);
      inyectarEstilosGlobales();
      gatekeepOrInit(crearUI);
    } else if (Date.now() - startWait > MAX_WAIT_MS) {
      clearInterval(esperarCrossfy);
      console.warn("[Crossfy Bot] crossfy no se cargó a tiempo.");
    }
  }, 500);
})();
