import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  const handleLogout = () => {
    // Logique de déconnexion à implémenter
    console.log("Déconnexion");
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
                      Accueil
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/activities">
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      active={location.pathname === "/activities"}>
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

          {/* Bouton de déconnexion - À droite */}
          <div className="flex justify-end">
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
