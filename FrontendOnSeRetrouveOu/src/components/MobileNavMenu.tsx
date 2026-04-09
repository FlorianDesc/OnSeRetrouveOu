import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

type MobileNavMenuProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  onAuthAction: () => void;
};

export default function MobileNavMenu({
  isOpen,
  onOpenChange,
  isAuthenticated,
  onAuthAction,
}: MobileNavMenuProps) {
  const handleMenuClose = () => onOpenChange(false);

  const handleAuthClick = () => {
    onAuthAction();
    handleMenuClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-64 p-0">
        <SheetHeader className="mb-6 px-6 pt-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="px-3">
          <nav className="flex flex-col">
            <Link
              to="/"
              className="block text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={handleMenuClose}>
              Activités
            </Link>
            <Link
              to="/profile"
              className="block text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={handleMenuClose}>
              Profil
            </Link>
          </nav>
          <div className="my-6 border-t border-gray-200" />
          <Button
            onClick={handleAuthClick}
            variant="outline"
            className="w-full h-10 text-sm px-3">
            {isAuthenticated ? "Déconnexion" : "Connexion"}
          </Button>
          <div className="pb-6" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
