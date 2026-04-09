declare module "leaflet" {
  type Map = {
    setView(coordinates: [number, number], zoom: number): Map;
    remove(): void;
  };

  type Marker = {
    addTo(map: Map): Marker;
    bindPopup(content: string): Marker;
  };

  type TileLayer = {
    addTo(map: Map): TileLayer;
  };

  type IconOptions = {
    [key: string]: unknown;
  };

  type Icon = {
    [key: string]: unknown;
  };

  type LeafletStatic = {
    map(element: HTMLElement | string): Map;
    marker(coords: [number, number], options?: Record<string, unknown>): Marker;
    tileLayer(url: string, options?: Record<string, unknown>): TileLayer;
    Icon: new (options?: IconOptions) => Icon;
  };

  const L: LeafletStatic;
  export default L;
}
