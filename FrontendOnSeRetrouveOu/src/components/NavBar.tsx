import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, getToken } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        <div className="grid grid-cols-3 items-center gap-4">
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
                  <Link to="/">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={location.pathname === "/"}>
                      Activités
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/profile">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={location.pathname === "/profile"}>
                      Profil
                    </NavigationMenuLink>
                  </Link>
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
      </div>
    </header>
  );
}
