# TODO - Mini Foro con Supabase

## 1. Base de datos (Supabase)
- [x] Crear tabla `guides` con: id, title, content, author_id, created_at
- [x] Agregar campo `role` a los usuarios en la tabla de autenticación (opcional, para distinguir autores)
- [] Políticas RLS:
    - [ ] Solo autores pueden insertar/editar/eliminar guías
    - [x] Todos pueden leer guías

## 2. Funcionalidad principal
- [x] Listar guías en la página principal
- [x] Ver detalle de una guía
- [x] Formulario para crear guía (solo autores)

## 3. Seguridad y experiencia
- [ ] Validar permisos antes de mostrar opciones de edición/creación
- [ ] Manejar errores de Supabase y mostrar mensajes claros

---
