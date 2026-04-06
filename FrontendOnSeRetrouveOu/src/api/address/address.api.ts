type AddressFeature = {
  properties: {
    label: string;
    postcode: string;
    city: string;
  };
};

type AddressSearchResponse = {
  features: AddressFeature[];
};

export const searchAddressesApi = async (
  query: string,
): Promise<AddressFeature[]> => {
  if (!query || query.length < 2) return [];

  const response = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
  );

  if (!response.ok) throw new Error("Erreur lors de la recherche d'adresses");

  const data: AddressSearchResponse = await response.json();
  return data.features || [];
};
