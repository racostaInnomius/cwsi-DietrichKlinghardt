import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import type { Practitioner } from "@/lib/practitioners";

/**
 * The directory map.
 *
 * Leaflet is imported dynamically inside an effect for two reasons: it touches
 * `window` at module scope, which would break the static build outright, and it
 * is the heaviest thing on the site — this way the ~40KB only loads for people
 * who actually open the directory.
 *
 * Pins come straight from the CMS coordinates. Practitioners without any (9 of
 * the imported 136) simply have no pin; they are still in the list below, which
 * is why the map is never the only way to find someone.
 */
/**
 * Tile provider — the one thing here that needs a decision before launch.
 *
 * OpenStreetMap's own tiles are the only ones that render with no API key at
 * all (Carto's now watermark "API KEY REQUIRED" across every tile). They work
 * and they are correctly attributed, but the OSMF tile usage policy asks
 * production sites not to lean on them: before go-live this should move to a
 * keyed provider — MapTiler and Stadia both have free tiers — which is a change
 * to these two lines and an environment variable, nothing more.
 */
const TILES = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export function PractitionerMap({ people }: { people: Practitioner[] }) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);

  const located = people.filter((p) => p.lat != null && p.lng != null);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !container.current || map.current) return;

      const instance = L.map(container.current, {
        scrollWheelZoom: false, // a map that eats the page scroll is hostile
        attributionControl: true,
      }).setView([50.5, 9.5], 4);

      L.tileLayer(TILES.url, { attribution: TILES.attribution, maxZoom: 19 }).addTo(
        instance,
      );

      map.current = instance;
      markers.current = L.layerGroup().addTo(instance);
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markers.current = null;
    };
  }, []);

  // Redraw pins whenever the filters change, and frame them.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !map.current || !markers.current) return;

      markers.current.clearLayers();

      const icon = L.divIcon({
        className: "map-pin",
        html: '<span aria-hidden="true"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      for (const person of located) {
        L.marker([person.lat!, person.lng!], { icon, title: person.name })
          .bindPopup(
            // Text nodes only — practitioner data is CMS content, and building
            // popup HTML from it by hand would be an injection hole.
            (() => {
              const wrap = document.createElement("div");
              wrap.className = "map-popup";
              const name = document.createElement("strong");
              name.textContent = person.name;
              const place = document.createElement("span");
              place.textContent = person.location;
              wrap.append(name, place);
              if (person.website) {
                const link = document.createElement("a");
                link.href = person.website;
                link.target = "_blank";
                link.rel = "noreferrer";
                link.textContent = "Visit website";
                wrap.append(link);
              }
              return wrap;
            })(),
          )
          .addTo(markers.current!);
      }

      if (located.length) {
        map.current.fitBounds(
          L.latLngBounds(located.map((p) => [p.lat!, p.lng!] as [number, number])),
          { padding: [40, 40], maxZoom: 11 },
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [located]);

  return (
    <div className="directory-map">
      <div ref={container} className="directory-map__canvas" role="application" aria-label="Map of practitioners" />
      {located.length < people.length ? (
        <p className="directory-map__note">
          {people.length - located.length} of {people.length} practitioners have
          no coordinates yet and are listed below only.
        </p>
      ) : null}
    </div>
  );
}
