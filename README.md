# API de Biblioteca

API REST con Node.js, Express y MongoDB (Mongoose) para gestionar autores y libros.

- **Relación 1:N**: un Autor tiene muchos Libros.
- **Registro embebido**: cada Libro guarda sus reseñas dentro del mismo documento.

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

El servidor queda en `http://localhost:3000`.

## Validaciones

- Los textos se limpian con `trim` (se quitan los espacios al inicio y al final).
- Se aceptan tildes y ñ.
- **Autor**: `nombre` obligatorio, mínimo 2 caracteres y solo letras; `anioNacimiento` entre 1000 y el año actual.
- **Libro**: `titulo` obligatorio (mínimo 2 caracteres); `autor` obligatorio y debe existir; `anioPublicacion` entre 1000 y el año actual.
- **Reseña**: `usuario` y `comentario` obligatorios (comentario de mínimo 5 caracteres); `calificacion` entre 1 y 5.
- No se puede eliminar un autor que tenga libros.

## Resumen de endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Verifica que la API funciona |
| POST | `/api/autores` | Crear un autor |
| GET | `/api/autores` | Listar autores |
| GET | `/api/autores/:id` | Obtener un autor |
| PUT | `/api/autores/:id` | Actualizar un autor |
| DELETE | `/api/autores/:id` | Eliminar un autor (si no tiene libros) |
| POST | `/api/libros` | Crear un libro |
| GET | `/api/libros` | Listar libros |
| GET | `/api/libros/:id` | Obtener un libro |
| PUT | `/api/libros/:id` | Actualizar un libro |
| DELETE | `/api/libros/:id` | Eliminar un libro |
| POST | `/api/libros/:id/resenas` | Agregar una reseña embebida a un libro |

## Pruebas con curl

Los cuerpos JSON están en archivos de la raíz del proyecto. En PowerShell de Windows usa `curl.exe` en lugar de `curl`.

### Autores

Crear un autor (`autor1.json`):

```bash
curl -X POST http://localhost:3000/api/autores -H "Content-Type: application/json" --data-binary "@autor1.json"
```

Crear un autor inválido, debe fallar (`autor-malo.json`):

```bash
curl -X POST http://localhost:3000/api/autores -H "Content-Type: application/json" --data-binary "@autor-malo.json"
```

Listar autores:

```bash
curl http://localhost:3000/api/autores
```

Obtener un autor (reemplaza `ID_AUTOR` por el `_id` que devolvió la creación):

```bash
curl http://localhost:3000/api/autores/ID_AUTOR
```

Actualizar un autor (`autor-editado.json`):

```bash
curl -X PUT http://localhost:3000/api/autores/ID_AUTOR -H "Content-Type: application/json" --data-binary "@autor-editado.json"
```

Eliminar un autor:

```bash
curl -X DELETE http://localhost:3000/api/autores/ID_AUTOR
```

### Libros

Antes de crear un libro, abre `libro1.json` y reemplaza el valor de `autor` por el `_id` de un autor existente.

Crear un libro:

```bash
curl -X POST http://localhost:3000/api/libros -H "Content-Type: application/json" --data-binary "@libro1.json"
```

Listar libros:

```bash
curl http://localhost:3000/api/libros
```

Obtener un libro (reemplaza `ID_LIBRO`):

```bash
curl http://localhost:3000/api/libros/ID_LIBRO
```

Actualizar un libro:

```bash
curl -X PUT http://localhost:3000/api/libros/ID_LIBRO -H "Content-Type: application/json" --data-binary "@libro-editado.json"

Eliminar un libro:

```bash
curl -X DELETE http://localhost:3000/api/libros/ID_LIBRO
```

### Reseñas (registro embebido)

Agregar una reseña a un libro (`resena1.json`):

```bash
curl -X POST http://localhost:3000/api/libros/ID_LIBRO/resenas -H "Content-Type: application/json" --data-binary "@resena1.json"
```

Agregar una reseña inválida, debe fallar (`resena-mala.json`):

```bash
curl -X POST http://localhost:3000/api/libros/ID_LIBRO/resenas -H "Content-Type: application/json" --data-binary "@resena-mala.json"
```