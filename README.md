# Sistema de Gestión de Citas — Estudio de Tatuajes

FrontEnd de un sistema de gestión de citas para un estudio de tatuajes ficticio ("Palermo's Tattoo"). Permite administrar servicios, artistas (empleados), horarios, restricciones y el ciclo completo de citas (creación, disponibilidad en tiempo real, cambio de estado y cancelación), con tres roles de usuario: **Administrador**, **Empleado** y **Cliente**.

Este proyecto consume una API externa ya desarrollada (Node/Express + Prisma + MySQL) — el FrontEnd **no** implementa lógica de backend ni base de datos propia.

## Tecnologías

- React 19 + Vite
- React Router
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- React Hook Form + Zod (formularios y validaciones)
- react-hot-toast (notificaciones)

## Requisito previo: el backend

Este FrontEnd **no funciona por sí solo** — necesita la API de citas corriendo en paralelo, con su base de datos MySQL ya migrada y con el seeder ejecutado (roles, estados de cita, días de la semana, tipos de restricción, usuario administrador).

Repositorio del API: [https://github.com/npaniagua26/api-citas](https://github.com/npaniagua26/api-citas)

Por defecto, la API debe estar disponible en `http://localhost:3000`.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` (puerto por defecto de Vite).

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (no se versiona) con:

```env
VITE_API_URL=http://localhost:3000
VITE_IMAGE_URL=http://localhost:3000/images
```

## Roles del sistema

| Rol | Puede hacer |
|---|---|
| **Administrador** | Gestión completa: servicios, adicionales, empleados, citas, agenda diaria del establecimiento. |
| **Empleado** | Gestiona las citas que tiene asignadas y su propia agenda. |
| **Cliente** | Se registra, consulta sus propias citas y puede cancelar las que estén pendientes. |

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@citas.com` | `Admin12345` |
| Empleado | `mariana.tatuadora@estudio.cr` | `Tattoo123!` |
| Empleado | `diego.tatuador@estudio.cr` | `Tattoo123!` |
| Empleado | `sofia.tatuadora@estudio.cr` | `Tattoo123!` |
| Cliente | `ana.cliente@correo.com` | `Tattoo123!` |
| Cliente | `luis.cliente@correo.com` | `Tattoo123!` |

*(Estos usuarios se crean mediante el script `datos_iniciales_estudio_tatuajes.sql`, que se ejecuta contra la base de datos del API después de su propio seeder.)*

## Módulos principales

- **Autenticación**: inicio de sesión, registro público de clientes, perfil.
- **Servicios**: catálogo con imagen, precio base y duración.
- **Servicios adicionales**: extras opcionales que se suman al costo de una cita.
- **Empleados**: perfil, especialidad, servicios que puede atender, agenda y restricciones.
- **Horarios de atención**: horario general del establecimiento (solo lectura).
- **Restricciones de horario**: cierres generales o de un empleado específico (solo lectura).
- **Citas** (proceso principal): creación con validación de disponibilidad en tiempo real, cálculo automático de costo y duración, cambio de estado y cancelación.
- **Agenda diaria del establecimiento**: vista consolidada por hora y por empleado (solo Administrador).

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables (formularios, diálogos, UI base en ui/)
├── context/        # AuthContext (sesión y rol del usuario)
├── lib/            # Funciones puras (cálculo de citas, formateo de horas/moneda, colores)
├── pages/          # Una página por ruta
├── schemas/        # Validaciones de formularios con Zod
└── services/       # Funciones que consumen el API (una por entidad)
```

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Construcción para producción
npm run preview   # Previsualizar la build de producción
npm run lint      # Revisar el código con ESLint
```
