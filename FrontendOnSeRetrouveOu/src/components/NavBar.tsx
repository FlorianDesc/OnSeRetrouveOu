import MobileNavMenu from "@/components/MobileNavMenu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, getToken } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, [location]);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop - Grid 3 colonnes */}
        <div className="hidden md:grid grid-cols-3 items-center gap-4">
          {/* Logo - À gauche */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/src/assets/sopra_steria_logo.png"
              alt="Sopra Steria"
              className="h-4"
            />
            <span className="text-xl font-bold">OnSeRetrouveOù</span>
          </Link>

          {/* Navigation - Au centre */}
          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/"
                      className={navigationMenuTriggerStyle()}
                      data-active={location.pathname === "/"}>
                      Activités
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/profile"
                      className={navigationMenuTriggerStyle()}
                      data-active={location.pathname === "/profile"}>
                      Profil
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Bouton de connexion/déconnexion - À droite */}
          <div className="flex justify-end">
            <Button onClick={handleAuthAction} variant="outline">
              {isAuthenticated ? "Déconnexion" : "Connexion"}
            </Button>
          </div>
        </div>

        {/* Mobile - Menu hambourgeois */}
        <div className="md:hidden flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/src/assets/sopra_steria_logo.png"
              alt="Sopra Steria"
              className="h-4"
            />
            <span className="text-lg font-bold">OnSeRetrouveOù</span>
          </Link>

          {/* Bouton menu hambourgeois */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <Menu className="size-6" />
          </button>
        </div>

        {/* Sheet menu mobile */}
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
          isAuthenticated={isAuthenticated}
          onAuthAction={handleAuthAction}
        />
      </div>
    </header>
  );
}
