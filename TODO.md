# TODO - Mini Foro con Supabase

## 1. Base de datos (Supabase)
- [ ] Crear tabla `guides` con: id, title, content, author_id, created_at
- [ ] Agregar campo `role` a los usuarios en la tabla de autenticación (opcional, para distinguir autores)
- [ ] Políticas RLS:
    - [ ] Solo autores pueden insertar/editar/eliminar guías
    - [ ] Todos pueden leer guías

## 2. Funcionalidad principal
- [ ] Listar guías en la página principal
- [ ] Ver detalle de una guía
- [ ] Formulario para crear guía (solo autores)

## 3. Seguridad y experiencia
- [ ] Validar permisos antes de mostrar opciones de edición/creación
- [ ] Manejar errores de Supabase y mostrar mensajes claros

---

> Cuando completes lo esencial, puedes agregar mejoras como edición, borrado, búsqueda o paginación. Si necesitas ejemplos de código para alguna parte, ¡pídelo!
