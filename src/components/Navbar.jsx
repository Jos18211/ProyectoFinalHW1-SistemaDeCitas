import { useEffect, useState } from "react";
import dragonLogo from "@/assets/DragonLogo.PNG";

import {
    Home,
    Calendar,
    Briefcase,
    Tag,
    Clock,
    Users,
    ShieldAlert,
    BarChart3,
    User,
    LogOut,
    Menu,
    Moon,
    Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Acceso directo visible siempre en escritorio, junto al usuario y "Salir"
const QUICK_ITEMS = [
    { to: "/", label: "Inicio", icon: Home, roles: null },
    { to: "/citas", label: "Citas", icon: Calendar, roles: "auth" },
    { to: "/servicios", label: "Servicios", icon: Briefcase, roles: "auth" },
];




// El resto de secciones solo vive dentro del menú ☰
const MENU_ITEMS = [
    { to: "/servicios", label: "Servicios", icon: Briefcase, roles: "auth" },
    { to: "/adicionales", label: "Adicionales", icon: Tag, roles: "auth" },
    { to: "/horarios", label: "Horarios", icon: Clock, roles: "auth" },
    { to: "/empleados", label: "Empleados", icon: Users, roles: ["Administrador", "Empleado"] },
    { to: "/restricciones", label: "Restricciones", icon: ShieldAlert, roles: ["Administrador", "Empleado"] },
    { to: "/agenda-diaria", label: "Agenda diaria", icon: BarChart3, roles: ["Administrador"] },
];

function puedeVerItem(item, estaAutenticado, rol) {
    if (item.roles === null) return true;
    if (!estaAutenticado) return false;
    if (item.roles === "auth") return true;
    return item.roles.includes(rol);
}

export function Navbar() {
    const [darkMode, setDarkMode] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { estaAutenticado, usuario, rol, logout } = useAuth();
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        isActive
            ? "flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            : "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground";

    const mobileLinkClass = ({ isActive }) =>
        isActive
            ? "flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground";

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    function toggleTheme() {
        setDarkMode((prev) => !prev);
    }

    function handleLogout() {
        logout();
        setMenuAbierto(false);
        navigate("/login");
    }

    const itemsRapidos = QUICK_ITEMS.filter((item) => puedeVerItem(item, estaAutenticado, rol));
    const itemsPanel = [...QUICK_ITEMS, ...MENU_ITEMS].filter((item) =>
        puedeVerItem(item, estaAutenticado, rol)
    );

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center">
    <img
        src={dragonLogo}
        alt=""
        className="h-full w-full object-contain"
    />
</div>

        
            <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                Palermo´s <span className="text-primary">Tattoo</span>
            </h1>
            </div>

            <div className="flex items-center gap-2">
            {/* Acceso directo a Citas — solo escritorio */}
            <div className="hidden lg:flex">
                {itemsRapidos.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={linkClass}
                  end={to === "/"}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Usuario / sesión — solo escritorio */}
            <div className="hidden items-center gap-2 lg:flex">
              {estaAutenticado ? (
                <>
                  <NavLink to="/perfil" className={linkClass}>
                    <User className="h-4 w-4" />
                    {usuario?.nombre ?? "Perfil"}
                  </NavLink>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>
                    Iniciar sesión
                  </NavLink>
                  <NavLink to="/registro" className={linkClass}>
                    Registrarse
                  </NavLink>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="rounded-full border-border bg-background hover:bg-accent hover:text-accent-foreground"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Menú con el resto de secciones — visible siempre, escritorio y móvil */}
            <Sheet open={menuAbierto} onOpenChange={setMenuAbierto}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Palermo´s Tattoo</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1">
                  {itemsPanel.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/"}
                      className={mobileLinkClass}
                      onClick={() => setMenuAbierto(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </NavLink>
                  ))}
                </div>
                {/* En escritorio la sesión ya se ve en la barra; en móvil solo vive aquí */}
                <div className="mt-auto flex flex-col gap-2 border-t pt-4 lg:hidden">
                  {estaAutenticado ? (
                    <>
                      <NavLink
                        to="/perfil"
                        className={mobileLinkClass}
                        onClick={() => setMenuAbierto(false)}
                      >
                        <User className="h-4 w-4" />
                        {usuario?.nombre ?? "Perfil"}
                      </NavLink>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className={mobileLinkClass}
                        onClick={() => setMenuAbierto(false)}
                      >
                        Iniciar sesión
                      </NavLink>
                      <NavLink
                        to="/registro"
                        className={mobileLinkClass}
                        onClick={() => setMenuAbierto(false)}
                      >
                        Registrarse
                      </NavLink>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    );
}
