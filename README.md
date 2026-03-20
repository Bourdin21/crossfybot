# crossfybot

Bot de autorización y gestión de usuarios para Crossfy.

## Características

- Gestión de usuarios autorizados mediante `authorized.json`.
- Validación de esquema del archivo de configuración.
- Verificación de autorización con soporte para fechas de expiración.
- Comparación de emails sin distinción de mayúsculas/minúsculas.

## Requisitos

- [Node.js](https://nodejs.org/) >= 18

## Instalación

```bash
npm install
```

## Uso

```bash
npm start
```

El bot carga `authorized.json` y muestra los usuarios activos.

### Verificar autorización programáticamente

```js
const { loadAuthorizedUsers, isAuthorized } = require('./src/auth');

const data = loadAuthorizedUsers();
console.log(isAuthorized('usuario@ejemplo.com', data)); // true | false
```

## Configuración — `authorized.json`

| Campo     | Tipo      | Descripción                                    |
|-----------|-----------|------------------------------------------------|
| `version` | `number`  | Versión del esquema                            |
| `users`   | `array`   | Lista de usuarios                              |
| `updated` | `string`  | Fecha ISO 8601 de la última actualización      |

Cada objeto de usuario contiene:

| Campo    | Tipo      | Requerido | Descripción                               |
|----------|-----------|-----------|-------------------------------------------|
| `email`  | `string`  | sí        | Email del usuario                         |
| `active` | `boolean` | sí        | Si el usuario está activo                 |
| `until`  | `string`  | no        | Fecha ISO 8601 de expiración del acceso   |

## Tests

```bash
npm test
```

## Estructura del proyecto

```
crossfybot/
├── authorized.json   # Configuración de usuarios autorizados
├── package.json
├── src/
│   ├── auth.js       # Módulo de autorización (carga, validación, verificación)
│   └── index.js      # Punto de entrada del bot
└── tests/
    └── auth.test.js  # Tests unitarios para el módulo de autorización
```

## Licencia

ISC