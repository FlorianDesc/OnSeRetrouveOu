import { Dialog, DialogContent } from "@/components/ui/dialog";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ActivityMapModalProps = {
  location: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActivityMapModal({
  location,
  isOpen,
  onOpenChange,
}: ActivityMapModalProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isOpen || !location) return;

    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(location)}&limit=1`,
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lon, lat] = data.features[0].geometry.coordinates;
          setCoordinates([lat, lon]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [isOpen, location]);

  // Initialize map when coordinates are available
  useEffect(() => {
    if (
      !coordinates ||
      !mapContainerRef.current ||
      typeof window === "undefined"
    )
      return;

    // Dynamically load leaflet
    const loadMap = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (await import("leaflet")).default as any;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }

      // Create map
      const map = L.map(mapContainerRef.current).setView(coordinates, 15);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker(coordinates, {
        title: location,
      }).addTo(map);

      // Add popup
      marker.bindPopup(`<div class="font-semibold">${location}</div>`);

      mapInstanceRef.current = map;
    };

    loadMap();

    return () => {
      // Cleanup when component unmounts
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, location]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 border-0">
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">{location}</h2>
            </div>
          </div>

          <div className="flex-1 relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-600">Chargement de la carte...</div>
              </div>
            ) : coordinates ? (
              <div
                ref={mapContainerRef}
                className="w-full h-full"
                style={{ minHeight: "400px" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-600">
                  Impossible de localiser l'adresse
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
