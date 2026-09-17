import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker, StyleSpecification } from "maplibre-gl";
import type { Practitioner } from "@/lib/practitioners";
import { env } from "@/lib/env";

/**
 * The directory map.
 *
 * MapLibre GL is imported dynamically inside an effect for two reasons: it
 * touches `window` at module scope, which would break the static build
 * outright, and it is the heaviest thing on the site — this way it only
 * loads for people who actually open the directory.
 *
 * Pins come straight from the CMS coordinates. Practitioners without any (9 of
 * the imported 136) simply have no pin; they are still in the list below, which
 * is why the map is never the only way to find someone.
 *
 * Renders the client's own MapTiler style (`VITE_PUBLIC_MAPTILER_STYLE_URL`) —
 * chosen over Leaflet + raster OSM tiles because the client's MapTiler plan
 * only serves that custom style as vector tiles, not raster PNG (raster
 * export of a personalized style needs their paid Flex tier). MapLibre GL
 * renders the vector style directly, so no plan upgrade is needed. Falls back
 * to plain OSM raster tiles, styled as a MapLibre raster source, if the env
 * var is ever unset.
 */
const FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export function PractitionerMap({ people }: { people: Practitioner[] }) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);

  const located = people.filter((p) => p.lat != null && p.lng != null);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !container.current || map.current) return;

      const instance = new maplibregl.Map({
        container: container.current,
        style: env.MAPTILER_STYLE_URL || FALLBACK_STYLE,
        center: [9.5, 50.5],
        zoom: 3,
        scrollZoom: false, // a map that eats the page scroll is hostile
        attributionControl: { compact: true },
      });
      instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");

      // Client (2026-09-16): runtime tweaks on top of their own MapTiler
      // style — overriding paint/layout here means they don't need to
      // re-edit and republish the style in MapTiler's editor for every
      // small color/visibility request. Layer names are the ones baked
      // into that style; if they ever rename a layer there, this silently
      // no-ops for it (setPaintProperty/setLayoutProperty on a missing
      // layer id throws, so each call is wrapped).
      instance.on("load", () => {
        const tweak = (fn: () => void) => {
          try {
            fn();
          } catch {
            // Layer isn't in the style (renamed/removed upstream) — skip it.
          }
        };
        tweak(() => instance.setPaintProperty("Country border", "line-color", "#5e839e"));
        tweak(() => instance.setLayoutProperty("Country labels", "visibility", "none"));
      });

      map.current = instance;
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Redraw pins whenever the filters change, and frame them.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !map.current) return;

      for (const marker of markers.current) marker.remove();
      markers.current = [];

      for (const person of located) {
        const el = document.createElement("span");
        el.className = "map-pin";

        const popupEl = document.createElement("div");
        popupEl.className = "map-popup";
        const name = document.createElement("strong");
        name.textContent = person.name;
        const place = document.createElement("span");
        place.textContent = person.location;
        popupEl.append(name, place);
        if (person.website) {
          const link = document.createElement("a");
          link.href = person.website;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = "Visit website";
          popupEl.append(link);
        }

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([person.lng!, person.lat!])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setDOMContent(popupEl))
          .addTo(map.current!);
        markers.current.push(marker);
      }

      if (located.length) {
        const lngs = located.map((p) => p.lng!);
        const lats = located.map((p) => p.lat!);
        map.current.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 40, maxZoom: 11 },
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
