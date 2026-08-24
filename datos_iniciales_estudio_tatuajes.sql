-- =====================================================================
-- datos_iniciales_estudio_tatuajes.sql
-- Proyecto Gestión de Citas — temática: Estudio de Tatuajes
--
-- RESPETA LAS RESTRICCIONES DEL ENUNCIADO:
--   * No modifica la estructura de la base de datos.
--   * NO toca los catálogos creados por el seeder del API
--     (roles, estados_cita, dias_semana, tipos_restriccion_horario,
--      especialidad "General", usuario admin@citas.com).
--   * Únicamente INSERTA los datos iniciales requeridos.
--
-- Requisito previo: el seeder del API ya debe haberse ejecutado.
-- Uso:  mysql -u root -p citas < datos_iniciales_estudio_tatuajes.sql
-- =====================================================================

SET NAMES utf8mb4;
SET @now = NOW(3);

-- =====================================================================
-- PASO 0 — VERIFICACIÓN DE CATÁLOGOS
-- Ejecutá estos SELECT ANTES de correr el resto del script.
-- Si algún nombre no coincide exactamente con el del seeder, ajustá
-- los literales de las variables del PASO 1 y volvé a intentar.
-- =====================================================================
-- SELECT id, nombre FROM roles;
-- SELECT id, nombre FROM estados_cita;
-- SELECT id, nombre FROM tipos_restriccion_horario;
-- SELECT id, nombre FROM dias_semana;
-- SELECT id, nombre FROM especialidades;

-- =====================================================================
-- PASO 1 — REFERENCIAS A LOS CATÁLOGOS EXISTENTES (solo lectura)
-- =====================================================================
SET @rolEmpleado = (SELECT id FROM roles WHERE nombre = 'Empleado'   LIMIT 1);
SET @rolCliente  = (SELECT id FROM roles WHERE nombre = 'Cliente'    LIMIT 1);

SET @estPendiente  = (SELECT id FROM estados_cita WHERE nombre = 'Pendiente'  LIMIT 1);
SET @estConfirmada = (SELECT id FROM estados_cita WHERE nombre = 'Confirmada' LIMIT 1);
SET @estFinalizada = (SELECT id FROM estados_cita WHERE nombre = 'Finalizada' LIMIT 1);
SET @estCancelada  = (SELECT id FROM estados_cita WHERE nombre = 'Cancelada'  LIMIT 1);

SET @tipoGeneral  = (SELECT id FROM tipos_restriccion_horario WHERE nombre = 'General del establecimiento' LIMIT 1);
SET @tipoEmpleado = (SELECT id FROM tipos_restriccion_horario WHERE nombre = 'Específica de empleado'      LIMIT 1);
SET @tipoParcial  = (SELECT id FROM tipos_restriccion_horario WHERE nombre = 'Parcial por horas'           LIMIT 1);
SET @tipoDiaCompl = (SELECT id FROM tipos_restriccion_horario WHERE nombre = 'Día completo'                LIMIT 1);

SET @admin = (SELECT id FROM usuarios WHERE correo = 'admin@citas.com' LIMIT 1);

-- Control: ninguno de estos valores debe ser NULL.
SELECT @rolEmpleado, @rolCliente, @estPendiente, @estConfirmada,
       @estFinalizada, @estCancelada, @tipoGeneral, @tipoEmpleado,
       @tipoParcial, @tipoDiaCompl, @admin;

-- =====================================================================
-- PASO 2 — LIMPIEZA DE DATOS PROPIOS (re-ejecutable)
-- Borra ÚNICAMENTE lo que inserta este script. Los catálogos del
-- seeder y el usuario administrador quedan intactos.
-- Las tablas _CitaAdicionales y _EmpleadoServicios se limpian solas
-- por CASCADE al borrar citas / empleados / servicios.
-- =====================================================================
DELETE FROM `citas`;
DELETE FROM `restricciones_horario`;
DELETE FROM `horarios_atencion`;
DELETE FROM `empleados`;
DELETE FROM `servicios`;
DELETE FROM `servicios_adicionales`;
DELETE FROM `usuarios` WHERE `correo` <> 'admin@citas.com';
DELETE FROM `especialidades` WHERE `nombre` <> 'General';

-- =====================================================================
-- PASO 3 — ESPECIALIDADES  (mínimo 3; "General" ya existe)
-- =====================================================================
INSERT INTO `especialidades` (`nombre`, `descripcion`, `activo`) VALUES
  ('Blackwork',        'Tinta negra sólida, trabajo geométrico y ornamental', 1),
  ('Realismo a color', 'Retratos y piezas a color con sombreado',             1),
  ('Fine line',        'Trazo fino, minimalismo y lettering',                 1);

SET @espBlack = (SELECT id FROM especialidades WHERE nombre = 'Blackwork'        LIMIT 1);
SET @espColor = (SELECT id FROM especialidades WHERE nombre = 'Realismo a color' LIMIT 1);
SET @espFine  = (SELECT id FROM especialidades WHERE nombre = 'Fine line'        LIMIT 1);
SET @espGral  = (SELECT id FROM especialidades WHERE nombre = 'General'          LIMIT 1);

-- =====================================================================
-- PASO 4 — USUARIOS  (3 empleados + 2 clientes; el admin ya existe)
-- Contraseña de todos estos usuarios: Tattoo123!
-- =====================================================================
SET @pwd = '$2b$10$4moL.adu6aldZgUFwOoXWeTrCCtfEyc1LHtPpPe/gursPOTsPlXqS';

INSERT INTO `usuarios`
  (`nombre`, `primerApellido`, `segundoApellido`, `correo`, `telefono`, `passwordHash`, `activo`, `rolId`, `creadoEn`, `actualizadoEn`) VALUES
  ('Mariana', 'Rojas',   'Vargas',   'mariana.tatuadora@estudio.cr', '8888-0001', @pwd, 1, @rolEmpleado, @now, @now),
  ('Diego',   'Morales', 'Serrano',  'diego.tatuador@estudio.cr',    '8888-0002', @pwd, 1, @rolEmpleado, @now, @now),
  ('Sofía',   'Alvarado','Núñez',    'sofia.tatuadora@estudio.cr',   '8888-0003', @pwd, 1, @rolEmpleado, @now, @now),
  ('Ana',     'Jiménez', 'Chaves',   'ana.cliente@correo.com',       '7000-1111', @pwd, 1, @rolCliente,  @now, @now),
  ('Luis',    'Campos',  'Mora',     'luis.cliente@correo.com',      '7000-2222', @pwd, 1, @rolCliente,  @now, @now);

SET @uMariana = (SELECT id FROM usuarios WHERE correo = 'mariana.tatuadora@estudio.cr' LIMIT 1);
SET @uDiego   = (SELECT id FROM usuarios WHERE correo = 'diego.tatuador@estudio.cr'    LIMIT 1);
SET @uSofia   = (SELECT id FROM usuarios WHERE correo = 'sofia.tatuadora@estudio.cr'   LIMIT 1);
SET @cAna     = (SELECT id FROM usuarios WHERE correo = 'ana.cliente@correo.com'       LIMIT 1);
SET @cLuis    = (SELECT id FROM usuarios WHERE correo = 'luis.cliente@correo.com'      LIMIT 1);

-- =====================================================================
-- PASO 5 — SERVICIOS  (8 servicios; cada empleado tendrá entre 3 y 5)
-- =====================================================================
INSERT INTO `servicios`
  (`nombre`, `descripcion`, `precioBase`, `duracionMinutos`, `imagen`, `activo`, `especialidadId`, `creadoEn`, `actualizadoEn`) VALUES
  ('Tatuaje pequeño blackwork',   'Pieza de hasta 8 cm en tinta negra sólida, una sola sesión.',           35000.00,  60, '/uploads/servicios/blackwork-pequeno.jpg', 1, @espBlack, @now, @now),
  ('Manga en progreso blackwork', 'Sesión de avance para manga completa en estilo ornamental.',           120000.00, 240, '/uploads/servicios/manga-blackwork.jpg',   1, @espBlack, @now, @now),
  ('Tatuaje geométrico mediano',  'Diseño geométrico de 10 a 18 cm con línea gruesa y relleno.',           70000.00, 120, '/uploads/servicios/geometrico.jpg',        1, @espBlack, @now, @now),
  ('Retrato a color',             'Retrato realista a color, requiere valoración previa del diseño.',     150000.00, 300, '/uploads/servicios/retrato-color.jpg',     1, @espColor, @now, @now),
  ('Cover-up a color',            'Cobertura de un tatuaje antiguo mediante saturación de color.',        130000.00, 240, '/uploads/servicios/coverup.jpg',           1, @espColor, @now, @now),
  ('Lettering fine line',         'Frase o nombre en trazo fino, hasta 12 cm de largo.',                   28000.00,  45, '/uploads/servicios/lettering.jpg',         1, @espFine,  @now, @now),
  ('Micro tatuaje fine line',     'Pieza minimalista de menos de 5 cm, ideal como primer tatuaje.',        22000.00,  30, '/uploads/servicios/micro.jpg',             1, @espFine,  @now, @now),
  ('Sesión de retoque',           'Retoque de línea y color sobre un tatuaje ya cicatrizado.',             20000.00,  45, '/uploads/servicios/retoque.jpg',           1, @espGral,  @now, @now);

SET @svPequeno   = (SELECT id FROM servicios WHERE nombre = 'Tatuaje pequeño blackwork'   LIMIT 1);
SET @svManga     = (SELECT id FROM servicios WHERE nombre = 'Manga en progreso blackwork' LIMIT 1);
SET @svGeo       = (SELECT id FROM servicios WHERE nombre = 'Tatuaje geométrico mediano'  LIMIT 1);
SET @svRetrato   = (SELECT id FROM servicios WHERE nombre = 'Retrato a color'             LIMIT 1);
SET @svCoverup   = (SELECT id FROM servicios WHERE nombre = 'Cover-up a color'            LIMIT 1);
SET @svLettering = (SELECT id FROM servicios WHERE nombre = 'Lettering fine line'         LIMIT 1);
SET @svMicro     = (SELECT id FROM servicios WHERE nombre = 'Micro tatuaje fine line'     LIMIT 1);
SET @svRetoque   = (SELECT id FROM servicios WHERE nombre = 'Sesión de retoque'           LIMIT 1);

-- =====================================================================
-- PASO 6 — SERVICIOS ADICIONALES  (mínimo 8)
-- =====================================================================
INSERT INTO `servicios_adicionales`
  (`nombre`, `descripcion`, `precio`, `activo`, `creadoEn`, `actualizadoEn`) VALUES
  ('Diseño personalizado',        'Boceto original hecho a la medida antes de la sesión.',        25000.00, 1, @now, @now),
  ('Kit de cuidado posterior',    'Pomada cicatrizante, film protector y jabón neutro.',           8000.00, 1, @now, @now),
  ('Retoque a los 30 días',       'Sesión corta de retoque incluida en el paquete.',              15000.00, 1, @now, @now),
  ('Sesión de fotos del trabajo', 'Fotografía profesional de la pieza terminada.',                12000.00, 1, @now, @now),
  ('Anestesia tópica',            'Crema anestésica aplicada antes y durante la sesión.',         10000.00, 1, @now, @now),
  ('Rediseño de boceto',          'Ajuste completo del diseño previo a la cita.',                 15000.00, 1, @now, @now),
  ('Film protector premium',      'Apósito de segunda piel para los primeros cinco días.',         5000.00, 1, @now, @now),
  ('Asesoría de estilo previa',   'Sesión de 30 minutos para definir estilo y ubicación.',         7000.00, 1, @now, @now);

SET @adDiseno   = (SELECT id FROM servicios_adicionales WHERE nombre = 'Diseño personalizado'     LIMIT 1);
SET @adKit      = (SELECT id FROM servicios_adicionales WHERE nombre = 'Kit de cuidado posterior' LIMIT 1);
SET @adRetoque  = (SELECT id FROM servicios_adicionales WHERE nombre = 'Retoque a los 30 días'    LIMIT 1);
SET @adAnestesia= (SELECT id FROM servicios_adicionales WHERE nombre = 'Anestesia tópica'         LIMIT 1);
SET @adFilm     = (SELECT id FROM servicios_adicionales WHERE nombre = 'Film protector premium'   LIMIT 1);
SET @adAsesoria = (SELECT id FROM servicios_adicionales WHERE nombre = 'Asesoría de estilo previa'LIMIT 1);

-- =====================================================================
-- PASO 7 — EMPLEADOS  (mínimo 3, cada uno ligado a un usuario)
-- =====================================================================
INSERT INTO `empleados`
  (`usuarioId`, `especialidadId`, `codigoEmpleado`, `descripcion`, `activo`, `creadoEn`, `actualizadoEn`) VALUES
  (@uMariana, @espBlack, 'TAT-001', 'Especialista en blackwork ornamental, seis años de experiencia.', 1, @now, @now),
  (@uDiego,   @espColor, 'TAT-002', 'Realismo a color y cobertura de piezas antiguas.',                1, @now, @now),
  (@uSofia,   @espFine,  'TAT-003', 'Fine line, lettering y micro tatuajes.',                          1, @now, @now);

SET @e1 = (SELECT id FROM empleados WHERE codigoEmpleado = 'TAT-001' LIMIT 1);
SET @e2 = (SELECT id FROM empleados WHERE codigoEmpleado = 'TAT-002' LIMIT 1);
SET @e3 = (SELECT id FROM empleados WHERE codigoEmpleado = 'TAT-003' LIMIT 1);

-- =====================================================================
-- PASO 8 — SERVICIOS POR EMPLEADO  (mínimo 3 cada uno)
-- Tabla implícita de Prisma: A = empleados.id, B = servicios.id
-- =====================================================================
INSERT INTO `_EmpleadoServicios` (`A`, `B`) VALUES
  (@e1, @svPequeno), (@e1, @svManga),   (@e1, @svGeo),     (@e1, @svRetoque),
  (@e2, @svRetrato), (@e2, @svCoverup), (@e2, @svGeo),     (@e2, @svRetoque),
  (@e3, @svLettering), (@e3, @svMicro), (@e3, @svPequeno), (@e3, @svRetoque);

-- =====================================================================
-- PASO 9 — HORARIOS DE ATENCIÓN
-- El estudio abre de lunes a sábado y cierra el domingo.
-- =====================================================================
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '10:00:00', '19:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Lunes';
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '10:00:00', '19:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Martes';
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '10:00:00', '19:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Miércoles';
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '10:00:00', '19:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Jueves';
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '10:00:00', '19:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Viernes';
INSERT INTO `horarios_atencion` (`diaSemanaId`, `horaInicio`, `horaFin`, `activo`)
SELECT id, '09:00:00', '17:00:00', 1 FROM `dias_semana` WHERE `nombre` = 'Sábado';
-- Domingo: sin horario registrado (día inactivo, no se pueden crear citas).

-- =====================================================================
-- PASO 10 — RESTRICCIONES DE HORARIO
-- Cumple el mínimo exigido: 2 generales, 3 de empleado,
-- 2 parciales por horas y 1 de día completo.
-- =====================================================================
INSERT INTO `restricciones_horario`
  (`tipoRestriccionId`, `empleadoId`, `fecha`, `horaInicio`, `horaFin`, `todoElDia`, `motivo`, `activo`, `creadoEn`, `actualizadoEn`) VALUES
  -- 2 generales del establecimiento
  (@tipoGeneral,  NULL, '2026-09-15', NULL,       NULL,       1, 'Feriado nacional: el estudio permanece cerrado',      1, @now, @now),
  (@tipoGeneral,  NULL, '2026-12-24', '12:00:00', '17:00:00', 0, 'Cierre especial por fin de año',                      1, @now, @now),
  -- 3 específicas de empleado
  (@tipoEmpleado, @e1,  '2026-09-18', '10:00:00', '12:00:00', 0, 'Capacitación de bioseguridad',                        1, @now, @now),
  (@tipoEmpleado, @e2,  '2026-09-19', '13:00:00', '15:00:00', 0, 'Cita médica del artista',                             1, @now, @now),
  (@tipoEmpleado, @e3,  '2026-09-21', '10:00:00', '12:00:00', 0, 'Reunión interna del estudio',                         1, @now, @now),
  -- 2 parciales por horas
  (@tipoParcial,  NULL, '2026-09-22', '12:00:00', '13:00:00', 0, 'Limpieza y esterilización de equipo',                 1, @now, @now),
  (@tipoParcial,  @e1,  '2026-09-23', '15:00:00', '17:00:00', 0, 'Sesión de fotos del portafolio',                      1, @now, @now),
  -- 1 de día completo
  (@tipoDiaCompl, NULL, '2026-10-02', NULL,       NULL,       1, 'Mantenimiento general del local',                     1, @now, @now);

-- =====================================================================
-- PASO 11 — CITAS
-- 4 pendientes, 4 confirmadas, 3 finalizadas, 2 canceladas = 13.
-- Distribuidas entre los tres empleados, sin traslapes, dentro del
-- horario de atención y sin chocar con ninguna restricción.
-- costoTotal = precioServicio + costoAdicionales
-- =====================================================================

-- ---- PENDIENTES ----
INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e1, @svPequeno, @estPendiente, @admin, '2026-09-08','10:00:00','11:00:00', 60, 35000.00, 33000.00, 68000.00, 'Antebrazo izquierdo, mandala pequeño.', @now, @now);
SET @cita1 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e2, @svRetrato, @estPendiente, @admin, '2026-09-09','11:00:00','16:00:00', 300, 150000.00, 10000.00, 160000.00, 'Retrato en la pantorrilla, trae referencia impresa.', @now, @now);
SET @cita2 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e3, @svLettering, @estPendiente, @admin, '2026-09-10','10:00:00','10:45:00', 45, 28000.00, 0.00, 28000.00, 'Frase corta en la clavícula.', @now, @now);
SET @cita3 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e1, @svGeo, @estPendiente, @admin, '2026-09-11','14:00:00','16:00:00', 120, 70000.00, 7000.00, 77000.00, 'Pieza geométrica en el gemelo derecho.', @now, @now);
SET @cita4 = LAST_INSERT_ID();

-- ---- CONFIRMADAS ----
INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e1, @svManga, @estConfirmada, @admin, '2026-09-12','09:00:00','13:00:00', 240, 120000.00, 40000.00, 160000.00, 'Segunda sesión de la manga, brazo derecho.', @now, @now);
SET @cita5 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e2, @svCoverup, @estConfirmada, @admin, '2026-09-16','12:00:00','16:00:00', 240, 130000.00, 18000.00, 148000.00, 'Cobertura de un tatuaje del hombro.', @now, @now);
SET @cita6 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e3, @svMicro, @estConfirmada, @admin, '2026-09-17','15:00:00','15:30:00', 30, 22000.00, 0.00, 22000.00, 'Micro tatuaje detrás de la oreja.', @now, @now);
SET @cita7 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e1, @svRetoque, @estConfirmada, @admin, '2026-09-22','10:00:00','10:45:00', 45, 20000.00, 5000.00, 25000.00, 'Retoque de línea de la manga.', @now, @now);
SET @cita8 = LAST_INSERT_ID();

-- ---- FINALIZADAS ----
INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e1, @svPequeno, @estFinalizada, @admin, '2026-08-05','10:00:00','11:00:00', 60, 35000.00, 8000.00, 43000.00, 'Primera pieza de la clienta, cicatrizó sin problemas.', @now, @now);
SET @cita9 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e2, @svRetrato, @estFinalizada, @admin, '2026-08-06','11:00:00','16:00:00', 300, 150000.00, 25000.00, 175000.00, 'Retrato familiar en el antebrazo.', @now, @now);
SET @cita10 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e3, @svLettering, @estFinalizada, @admin, '2026-08-07','16:00:00','16:45:00', 45, 28000.00, 0.00, 28000.00, 'Lettering en el costado.', @now, @now);
SET @cita11 = LAST_INSERT_ID();

-- ---- CANCELADAS ----
INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`motivoCancelacion`,`creadoEn`,`actualizadoEn`)
VALUES (@cLuis, @e1, @svGeo, @estCancelada, @admin, '2026-08-11','13:00:00','15:00:00', 120, 70000.00, 0.00, 70000.00, 'Diseño geométrico en el muslo.', 'El cliente reprogramará el próximo mes.', @now, @now);
SET @cita12 = LAST_INSERT_ID();

INSERT INTO `citas` (`clienteId`,`empleadoId`,`servicioId`,`estadoCitaId`,`creadoPorUsuarioId`,`fecha`,`horaInicio`,`horaFin`,`duracionMinutos`,`precioServicio`,`costoAdicionales`,`costoTotal`,`observaciones`,`motivoCancelacion`,`creadoEn`,`actualizadoEn`)
VALUES (@cAna, @e2, @svCoverup, @estCancelada, @admin, '2026-09-26','09:00:00','13:00:00', 240, 130000.00, 0.00, 130000.00, 'Cobertura en la espalda baja.', 'Cancelada por el cliente por motivos personales.', @now, @now);
SET @cita13 = LAST_INSERT_ID();

-- =====================================================================
-- PASO 12 — ADICIONALES POR CITA
-- Tabla implícita de Prisma: A = citas.id, B = servicios_adicionales.id
-- Los montos coinciden con el campo costoAdicionales de cada cita.
-- =====================================================================
INSERT INTO `_CitaAdicionales` (`A`, `B`) VALUES
  (@cita1,  @adDiseno),   (@cita1,  @adKit),        -- 25000 +  8000 = 33000
  (@cita2,  @adAnestesia),                          --          10000
  (@cita4,  @adAsesoria),                           --           7000
  (@cita5,  @adDiseno),   (@cita5,  @adRetoque),    -- 25000 + 15000 = 40000
  (@cita6,  @adKit),      (@cita6,  @adAnestesia),  --  8000 + 10000 = 18000
  (@cita8,  @adFilm),                               --           5000
  (@cita9,  @adKit),                                --           8000
  (@cita10, @adDiseno);                             --          25000

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================
SELECT 'especialidades'        AS tabla, COUNT(*) AS filas, '>= 3'  AS minimo FROM `especialidades`
UNION ALL SELECT 'usuarios (sin admin)', COUNT(*), '5'  FROM `usuarios` WHERE correo <> 'admin@citas.com'
UNION ALL SELECT 'empleados',            COUNT(*), '>= 3' FROM `empleados`
UNION ALL SELECT 'servicios',            COUNT(*), '8'  FROM `servicios`
UNION ALL SELECT 'servicios_adicionales',COUNT(*), '>= 8' FROM `servicios_adicionales`
UNION ALL SELECT 'servicios x empleado', COUNT(*), '12' FROM `_EmpleadoServicios`
UNION ALL SELECT 'horarios_atencion',    COUNT(*), '6'  FROM `horarios_atencion`
UNION ALL SELECT 'restricciones',        COUNT(*), '8'  FROM `restricciones_horario`
UNION ALL SELECT 'citas',                COUNT(*), '13' FROM `citas`;

-- Desglose de citas por estado (debe dar 4 / 4 / 3 / 2)
SELECT ec.nombre AS estado, COUNT(*) AS citas
FROM `citas` c
JOIN `estados_cita` ec ON ec.id = c.estadoCitaId
GROUP BY ec.nombre
ORDER BY ec.orden;
