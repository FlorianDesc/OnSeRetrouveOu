import { addressesQueryOptions } from "@/api/address/address.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type LocationComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function LocationCombobox({
  value,
  onChange,
  error,
}: LocationComboboxProps) {
  const [search, setSearch] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validating query: must be >= 3 chars and start with letter or number
  const isValidQuery = (query: string) => {
    const trimmed = query.trim();
    return trimmed.length >= 3 && /^[a-zA-Z0-9]/.test(trimmed);
  };

  const { data: addresses = [], isLoading } = useQuery(
    addressesQueryOptions(
      isValidQuery(debouncedSearch) ? debouncedSearch.trim() : "",
    ),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAddress = (address: string) => {
    setSearch(address);
    onChange(address);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <Label>
        Lieu<span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Chercher une adresse..."
          value={search}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full"
        />
        {isOpen && isValidQuery(search) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Spinner className="h-4 w-4" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                Aucune adresse trouvée
              </div>
            ) : (
              addresses.map((address) => (
                <Button
                  key={address.properties.label}
                  onClick={() => handleSelectAddress(address.properties.label)}
                  variant="ghost"
                  className="w-full justify-start px-4 text-left text-sm">
                  {address.properties.label}
                </Button>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
