import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { HomePage } from "./pages/HomePage";
import { PortafolioPage } from "./pages/PortafolioPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Adicionales pages
import { AdicionalesListPage } from "./pages/AdicionalesListPage";
import { AdicionalDetailPage } from "./pages/AdicionalDetailPage";
import { CreateAdicionalPage } from "./pages/CreateAdicionalPage";
import { EditAdicionalPage } from "./pages/EditAdicionalPage";

// Servicios pages
import { ServiciosListPage } from "./pages/ServiciosListPage";
import { ServicioDetailPage } from "./pages/ServicioDetailPage";
import { CreateServicioPage } from "./pages/CreateServicioPage";
import { EditServicioPage } from "./pages/EditServicioPage";

// Empleados pages
import { EmpleadosListPage } from "./pages/EmpleadosListPage";
import { EmpleadoDetailPage } from "./pages/EmpleadoDetailPage";
import { CreateEmpleadoPage } from "./pages/CreateEmpleadoPage";
import { EditEmpleadoPage } from "./pages/EditEmpleadoPage";

// Horarios de atención pages
import { HorariosAtencionPage } from './pages/HorariosAtencionPage'
import { RestriccionesListPage } from './pages/RestriccionesListPage'
import { RestriccionDetailPage } from './pages/RestriccionDetailPage'

// Citas pages
import { CitasListPage } from './pages/CitasListPage'
import { CitaDetailPage } from './pages/CitaDetailPage'
import { CreateCitaPage } from './pages/CreateCitaPage'
import { EditCitaPage } from './pages/EditCitaPage'

// Agenda diaria page
import { AgendaDiariaPage } from './pages/AgendaDiariaPage'

// Accesibilidad demo page
import { AccesibilidadDemoPage } from './pages/AccesibilidadDemoPage'


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portafolio" element={<PortafolioPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/demo-accesibilidad" element={<AccesibilidadDemoPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<ProfilePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/adicionales" element={<AdicionalesListPage />} />
                <Route
                  path="/adicionales/:id"
                  element={<AdicionalDetailPage />}
                />
                <Route path="/servicios" element={<ServiciosListPage />} />
                <Route path="/servicios/:id" element={<ServicioDetailPage />} />
                <Route path="/empleados" element={<EmpleadosListPage />} />
                <Route path="/empleados/:id" element={<EmpleadoDetailPage />} />
                <Route path="/horarios" element={<HorariosAtencionPage />} />
                <Route path="/citas" element={<CitasListPage />} />
                <Route path="/citas/:id" element={<CitaDetailPage />} />
              </Route>

              <Route
                element={<ProtectedRoute rolesPermitidos={["Administrador", "Empleado"]} />}
              >
                <Route path="/citas/nueva" element={<CreateCitaPage />} />
                <Route path="/citas/:id/editar" element={<EditCitaPage />} />
                <Route path="/restricciones" element={<RestriccionesListPage />} />
                <Route path="/restricciones/:id" element={<RestriccionDetailPage />} />
              </Route>

              <Route
                element={<ProtectedRoute rolesPermitidos={["Administrador"]} />}
              >
                <Route
                  path="/adicionales/nuevo"
                  element={<CreateAdicionalPage />}
                />
                <Route
                  path="/adicionales/:id/editar"
                  element={<EditAdicionalPage />}
                />
                <Route
                  path="/servicios/nuevo"
                  element={<CreateServicioPage />}
                />
                <Route
                  path="/servicios/:id/editar"
                  element={<EditServicioPage />}
                />

                <Route
                  path="/empleados/nuevo"
                  element={<CreateEmpleadoPage />}
                />
                <Route
                  path="/empleados/:id/editar"
                  element={<EditEmpleadoPage />}
                />
                <Route path="/agenda-diaria" element={<AgendaDiariaPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
