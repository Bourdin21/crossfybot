================================================================================
  CROSSFY BOT — v5.1
  Guía de instalación y uso
================================================================================

  Auto-reserva de clases en app.crossfyapp.com
  Desarrollado como extensión de Chrome (Manifest v3)

--------------------------------------------------------------------------------
  CONTENIDO DEL ZIP
--------------------------------------------------------------------------------

  crossfy-extension-v2/
  ├── manifest.json   →  Configuración de la extensión
  ├── popup.html      →  Ventana del botón de activación
  ├── popup.js        →  Lógica del popup
  ├── content.js      →  El bot completo (se inyecta en la página)
  └── icon128.png     →  Ícono de la extensión

--------------------------------------------------------------------------------
  REQUISITOS
--------------------------------------------------------------------------------

  - Google Chrome (o cualquier navegador basado en Chromium: Brave, Edge, etc.)
  - Tener una cuenta activa en app.crossfyapp.com
  - Estar incluido en la lista de usuarios autorizados del bot

--------------------------------------------------------------------------------
  INSTALACIÓN (una sola vez)
--------------------------------------------------------------------------------

  PASO 1 — Descomprimir el ZIP
  ─────────────────────────────
  Descomprimí el archivo .zip en una carpeta FIJA en tu computadora.
  Recomendado: Documentos/crossfy-bot/

  ⚠ IMPORTANTE: No muevas ni elimines esta carpeta una vez instalada.
     Chrome necesita que los archivos estén siempre en el mismo lugar.

  PASO 2 — Abrir el gestor de extensiones de Chrome
  ───────────────────────────────────────────────────
  En la barra de direcciones de Chrome escribí:

      chrome://extensions

  y presioná Enter.

  PASO 3 — Activar el modo desarrollador
  ────────────────────────────────────────
  En la esquina superior derecha de esa página vas a ver un toggle
  que dice "Modo desarrollador". Activalo (debe quedar en azul/ON).

  PASO 4 — Cargar la extensión
  ──────────────────────────────
  Hacé click en el botón "Cargar descomprimida" (aparece arriba a la izquierda).
  Seleccioná la CARPETA crossfy-extension-v2/ (no el ZIP, la carpeta).

  Si todo salió bien vas a ver "Crossfy Bot" en la lista de extensiones.

  PASO 5 — Anclar el ícono a la barra
  ──────────────────────────────────────
  Hacé click en el ícono de piezas de puzzle 🧩 (barra de Chrome, arriba a la
  derecha) y luego clavá 📌 el ícono de Crossfy Bot para tenerlo siempre visible.

--------------------------------------------------------------------------------
  CÓMO USAR EL BOT
--------------------------------------------------------------------------------

  1. Abrí app.crossfyapp.com e iniciá sesión con tu cuenta.

  2. Hacé click en el ícono 🤖 del bot en la barra de Chrome.
     Se abre un pequeño popup con el botón "⚡ ACTIVAR BOT".

  3. Hacé click en "⚡ ACTIVAR BOT".
     El bot se inyecta en la página y carga automáticamente el listado
     de clases de HOY y MAÑANA con disponibilidad de cupo.

  4. Hacé click en la clase que querés reservar.
     Se abre un modal para elegir el modo:

       ⚔ ATACAR   →  Para clases de mañana.
                      El bot espera hasta 15 segundos antes de la apertura
                      de inscripciones (24hs antes de la clase) y dispara
                      un intento de reserva cada 200ms hasta conseguir lugar
                      o agotar la ventana de 5 minutos.

       🛡 DEFENDER →  Para clases de hoy con lista de espera.
                      El bot monitorea cada 2 segundos y reserva
                      automáticamente si aparece un lugar libre.

  5. Una vez iniciado el bot, el panel de ESTADO (esquina inferior derecha)
     muestra en tiempo real: modo activo, clase objetivo, intentos y log.
     El HISTORIAL de reservas se guarda en esquina inferior izquierda.

  6. Para detener el bot manualmente: click en "■ DETENER" dentro del panel.

--------------------------------------------------------------------------------
  AUTORIZACIÓN
--------------------------------------------------------------------------------

  El bot verifica si tu email está habilitado consultando un archivo remoto
  en GitHub antes de arrancar. Si no estás autorizado, el bot no se activa.

  Si ves el mensaje "Usuario no autorizado", contactá al administrador
  del bot para que agregue tu email a la lista.

  La verificación se cachea por 7 días. En modo ATACAR, el bot re-valida
  tu autorización justo antes de arrancar el loop (≈24hs después).

--------------------------------------------------------------------------------
  SOLUCIÓN DE PROBLEMAS
--------------------------------------------------------------------------------

  "URL incorrecta" en el popup
  → Asegurate de estar en app.crossfyapp.com antes de hacer click en el ícono.

  El bot no aparece en la página
  → Recargá la página y volvé a hacer click en el ícono del bot.
  → Si el problema persiste, desactivá y volvé a activar la extensión en
    chrome://extensions.

  "No se detectó email del usuario"
  → El bot busca tu email en el localStorage de Crossfy. Cerrá sesión,
    volvé a iniciarla y reintentá.

  "No se pudo validar auth y no hay caché"
  → Problema de conexión al servidor de autorización (GitHub).
    Verificá tu conexión a internet y reintentá.

  Actualizaciones de la extensión
  → Si recibís una nueva versión, reemplazá los archivos en la misma carpeta
    y hacé click en el ícono de recarga 🔄 en chrome://extensions.
    No necesitás desinstalar y volver a instalar.

--------------------------------------------------------------------------------
  NOTAS TÉCNICAS
--------------------------------------------------------------------------------

  - La extensión NO recolecta ni envía datos personales a ningún servidor
    externo, excepto para verificar la autorización contra GitHub.
  - El historial de reservas se guarda localmente en el navegador (localStorage).
  - El bot solo funciona mientras la pestaña de Crossfy esté abierta y activa.
  - Si recargás la página, necesitás volver a inyectar el bot con el popup.

--------------------------------------------------------------------------------
  VERSIÓN
--------------------------------------------------------------------------------

  v5.1  —  Extensión de Chrome (Manifest v3)
            Popup de activación manual
            Listado de clases HOY + MAÑANA con estado de cupo
            Modo ataque: disparo cada 200ms, 15s de anticipación
            Modo defensa: polling cada 2s, sin límite de tiempo
            Sistema de auth remoto con caché de 7 días
            Log de eventos en panel, toast solo para eventos críticos
            Historial de reservas persistente (últimas 10)

================================================================================