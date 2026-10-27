/**
 * Every button on the site whose wording the tenant owns, by its key — the
 * text the CMS (Site Buttons) was seeded with and what the button shows until
 * its row is changed (client, 2026-10-26: "permitir que Ana modifique el texto
 * de los botones").
 *
 * useButtonLabel(key) reads these automatically; a CMS row with a label wins.
 * `page` and `where` are documentation: they are what the CMS shows the editor
 * so she can tell two "Learn more" buttons apart, and what the seed writes.
 *
 * A key is shared by buttons that must always read the same — the four
 * "Become a new patient" calls to action across the Sophia pages are one key,
 * so changing the wording once changes all of them.
 *
 * Arrows (→ ↗) are design, not copy: they stay in the markup and are never
 * part of the label.
 */
export interface ButtonDefault {
  /** Where it shows, for the editor. */
  page: string;
  /** Which button on that page, for the editor. */
  where: string;
  /** What it says until the CMS says otherwise. */
  label: string;
}

export const BUTTONS: Record<string, ButtonDefault> = {
  "header-contact": {
    page: "Todo el sitio",
    where: "Barra de arriba, botón de la derecha",
    label: "Contact us",
  },

  "home-about-learn-more": {
    page: "Inicio",
    where: "Sección de Dr. Klinghardt, botón claro",
    label: "Learn more",
  },
  "home-about-events": {
    page: "Inicio",
    where: "Sección de Dr. Klinghardt, segundo botón",
    label: "Upcoming events",
  },
  "home-academy-learn-more": {
    page: "Inicio",
    where: "Sección de la Akademie",
    label: "Learn more",
  },
  "home-art-course": {
    page: "Inicio",
    where: "Sección de A.R.T., primer botón",
    label: "About the course",
  },
  "home-art-practitioners": {
    page: "Inicio",
    where: "Sección de A.R.T., botón principal",
    label: "Find a practitioner",
  },
  "home-sophia-learn-more": {
    page: "Inicio",
    where: "Sección de Sophia, primer botón",
    label: "Learn more",
  },
  "home-sophia-new-patients": {
    page: "Inicio",
    where: "Sección de Sophia, botón principal",
    label: "New patients",
  },
  "home-talks-join": {
    page: "Inicio",
    where: "Sección de Weekly Talks",
    label: "Join my talks",
  },
  "home-store-visit": {
    page: "Inicio",
    where: "Sección de la tienda",
    label: "Visit the store",
  },

  "art-training-paths": {
    page: "Akademie",
    where: "A.R.T.: portada, primer botón",
    label: "Training paths",
  },
  "art-find-practitioner": {
    page: "Akademie",
    where: "A.R.T.: portada, segundo botón",
    label: "Find a practitioner",
  },

  "sophia-hero-new-patient": {
    page: "Sophia",
    where: "Portada, primer botón",
    label: "Become a new patient",
  },
  "sophia-hero-travel": {
    page: "Sophia",
    where: "Portada, segundo botón",
    label: "Travel & accommodation",
  },
  "sophia-new-patients": {
    page: "Sophia",
    where: "Botón “New patients” de las secciones intermedias",
    label: "New patients",
  },
  "sophia-become-a-new-patient": {
    page: "Sophia",
    where: "Llamado final de Sophia, Equipo y fichas de integrante",
    label: "Become a new patient",
  },
  "sophia-team-learn-more": {
    page: "Sophia",
    where: "Equipo: botón de cada tarjeta",
    label: "Learn more",
  },
  "sophia-member-meet-team": {
    page: "Sophia",
    where: "Ficha de integrante: botón de regreso, arriba",
    label: "Meet our team",
  },
  "sophia-member-contact": {
    page: "Sophia",
    where: "Ficha de integrante: botón junto al nombre",
    label: "Contact us",
  },
  "new-patients-become": {
    page: "Sophia",
    where: "Pacientes nuevos: botón “Become a Patient” (portada y cierre)",
    label: "Become a Patient",
  },
  "contact-health-institute": {
    page: "Contacto",
    where: "Nota del Health Institute",
    label: "Contact for Dietrich Klinghardt Health Institute™",
  },
  "contact-send": {
    page: "Contacto",
    where: "Botón de enviar, en todos los formularios del sitio",
    label: "Send message",
  },

  "foundation-support": {
    page: "Fundación",
    where: "Botón “Support the Foundation” (dos secciones)",
    label: "Support the Foundation",
  },
  "donate-get-in-touch": {
    page: "Fundación",
    where: "Donar: panel de donación",
    label: "Get in touch",
  },

  "talks-join-now": {
    page: "Weekly Talks",
    where: "Portada, botón que lleva a los planes",
    label: "Join now",
  },
  "newsletter-join": {
    page: "Todo el sitio",
    where: "Boletín: botón de suscribirse",
    label: "Join now",
  },

  "courses-all-courses": {
    page: "Cursos",
    where: "Botón de regreso “All courses” (ruta y fechas)",
    label: "All courses",
  },
  "path-course-dates": {
    page: "Cursos",
    where: "Ruta de formación: panel lateral",
    label: "Course dates",
  },
  "path-about-course": {
    page: "Cursos",
    where: "Ruta de formación: botón principal del cuerpo",
    label: "About the course",
  },
  "path-online-dates": {
    page: "Cursos",
    where: "Ruta de formación: botón “To the online course dates”",
    label: "To the online course dates",
  },

  "events-all-events": {
    page: "Evento",
    where: "Botón de regreso “All events”",
    label: "All events",
  },
  "event-book-now": {
    page: "Evento",
    where: "Botón de compra de un evento de pago",
    label: "Book now",
  },
  "event-book-full-course": {
    page: "Evento",
    where: "Botón de compra cuando el curso también se vende por día",
    label: "Book the full course",
  },
  "event-register": {
    page: "Evento",
    where: "Botón de un evento que no se cobra aquí",
    label: "Register / learn more",
  },

  "directory-search": {
    page: "Akademie",
    where: "Practitioners: botón del buscador",
    label: "Search",
  },
  "load-more": {
    page: "Listados",
    where: "Botón de cargar más (practitioners, fechas de curso)",
    label: "Load more",
  },

  "store-back-home": {
    page: "Tienda",
    where: "Cuando está apagada: botón de regreso al inicio",
    label: "Back to home",
  },
};
