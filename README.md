# API de Gimnasio

API REST con Node.js, Express y MongoDB (Mongoose) para gestionar entrenadores y rutinas de un gimnasio.

- **Relación 1:N**: un Entrenador tiene muchas Rutinas (la rutina guarda el `_id` del entrenador).
- **Registro embebido**: cada Rutina guarda sus ejercicios dentro del mismo documento.

## Cómo correrlo

1. Requisitos: Node.js 20.12 o superior y una base de datos en MongoDB Atlas.
2. Clona el repositorio e instala las dependencias:

```bash
npm install
```

3. Copia `.env.example` como `.env` y reemplaza `MONGODB_URI` con tu cadena de conexión de Atlas.
4. Inicia el servidor:

```bash
npm run dev
```

El servidor queda en `http://localhost:3000`. En la terminal deben aparecer `Conectado a MongoDB Atlas` y `Servidor en http://localhost:3000`.

## Validaciones

- Los textos se limpian con `trim` (se quitan los espacios al inicio y al final).
- Se aceptan tildes y ñ.
- **Entrenador**: `nombre` obligatorio, mínimo 2 caracteres y solo letras, tildes y ñ; `aniosExperiencia` entre 0 y 60.
- **Rutina**: `nombre` obligatorio (mínimo 2 caracteres); `nivel` debe ser Principiante, Intermedio o Avanzado; `duracionMinutos` entre 5 y 240; `entrenador` obligatorio y debe existir.
- **Ejercicio** (embebido): `nombre` obligatorio (mínimo 2 caracteres); `series` entre 1 y 10; `repeticiones` entre 1 y 100.
- No se puede eliminar un entrenador que tenga rutinas (responde 409).

## Códigos de respuesta

| Código | Cuándo |
|--------|--------|
| 200 | Consulta, edición o borrado correcto |
| 201 | Registro creado |
| 400 | Datos inválidos o id con formato incorrecto |
| 404 | El registro no existe |
| 409 | Conflicto: el entrenador tiene rutinas |

## Resumen de endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Verifica que la API funciona |
| POST | `/api/entrenadores` | Crear un entrenador |
| GET | `/api/entrenadores` | Listar entrenadores |
| GET | `/api/entrenadores/:id` | Obtener un entrenador |
| PUT | `/api/entrenadores/:id` | Actualizar un entrenador |
| DELETE | `/api/entrenadores/:id` | Eliminar un entrenador (si no tiene rutinas) |
| POST | `/api/rutinas` | Crear una rutina (el entrenador debe existir) |
| GET | `/api/rutinas` | Listar rutinas con los datos del entrenador |
| GET | `/api/rutinas/:id` | Obtener una rutina con los datos del entrenador |
| PUT | `/api/rutinas/:id` | Actualizar una rutina |
| DELETE | `/api/rutinas/:id` | Eliminar una rutina |
| POST | `/api/rutinas/:id/ejercicios` | Agregar un ejercicio embebido a una rutina |

## Pruebas con curl

Los cuerpos JSON están en archivos de la raíz del proyecto. En PowerShell de Windows usa `curl.exe` en lugar de `curl`. Ejecuta los comandos de a uno, en este orden.

### Entrenadores

Crear un entrenador (`entrenador1.json`). Copia el `_id` que devuelve:

```bash
curl -X POST http://localhost:3000/api/entrenadores -H "Content-Type: application/json" --data-binary "@entrenador1.json"
```

Crear un entrenador inválido, debe fallar con 400 (`entrenador-malo.json`):

```bash
curl -X POST http://localhost:3000/api/entrenadores -H "Content-Type: application/json" --data-binary "@entrenador-malo.json"
```

Listar entrenadores:

```bash
curl http://localhost:3000/api/entrenadores
```

Obtener un entrenador (reemplaza `ID_ENTRENADOR` por el `_id` de la creación):

```bash
curl http://localhost:3000/api/entrenadores/ID_ENTRENADOR
```

Actualizar un entrenador (`entrenador-editado.json`):

```bash
curl -X PUT http://localhost:3000/api/entrenadores/ID_ENTRENADOR -H "Content-Type: application/json" --data-binary "@entrenador-editado.json"
```

### Rutinas

Antes de crear una rutina, abre `rutina1.json`, `rutina-mala.json` y `rutina-editada.json` si lo usas, y reemplaza el valor de `entrenador` por el `_id` de un entrenador existente. `rutina-sin-entrenador.json` usa un id que no existe a propósito.

Crear una rutina. Copia el `_id` que devuelve:

```bash
curl -X POST http://localhost:3000/api/rutinas -H "Content-Type: application/json" --data-binary "@rutina1.json"
```

Crear una rutina inválida, debe fallar con 400 (`rutina-mala.json`):

```bash
curl -X POST http://localhost:3000/api/rutinas -H "Content-Type: application/json" --data-binary "@rutina-mala.json"
```

Crear una rutina con un entrenador que no existe, debe fallar con 404 (`rutina-sin-entrenador.json`):

```bash
curl -X POST http://localhost:3000/api/rutinas -H "Content-Type: application/json" --data-binary "@rutina-sin-entrenador.json"
```

Listar rutinas:

```bash
curl http://localhost:3000/api/rutinas
```

Obtener una rutina (reemplaza `ID_RUTINA`):

```bash
curl http://localhost:3000/api/rutinas/ID_RUTINA
```

Actualizar una rutina (`rutina-editada.json`):

```bash
curl -X PUT http://localhost:3000/api/rutinas/ID_RUTINA -H "Content-Type: application/json" --data-binary "@rutina-editada.json"
```

### Ejercicios (registro embebido)

Agregar un ejercicio a una rutina (`ejercicio1.json`):

```bash
curl -X POST http://localhost:3000/api/rutinas/ID_RUTINA/ejercicios -H "Content-Type: application/json" --data-binary "@ejercicio1.json"
```

Agregar un ejercicio inválido, debe fallar con 400 (`ejercicio-malo.json`):

```bash
curl -X POST http://localhost:3000/api/rutinas/ID_RUTINA/ejercicios -H "Content-Type: application/json" --data-binary "@ejercicio-malo.json"
```

### Eliminar

Eliminar un entrenador que tiene rutinas, debe fallar con 409:

```bash
curl -i -X DELETE http://localhost:3000/api/entrenadores/ID_ENTRENADOR
```

Eliminar la rutina:

```bash
curl -X DELETE http://localhost:3000/api/rutinas/ID_RUTINA
```

Eliminar el entrenador (ahora sin rutinas):

```bash
curl -X DELETE http://localhost:3000/api/entrenadores/ID_ENTRENADOR
```