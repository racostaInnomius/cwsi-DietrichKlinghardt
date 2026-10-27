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
    page: "Akademie · A.R.T.",
    where: "Portada, primer botón",
    label: "Training paths",
  },
  "art-find-practitioner": {
    page: "Akademie · A.R.T.",
    where: "Portada, segundo botón",
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
    page: "Sophia, Sophia · Equipo, ficha de cada integrante",
    where: "Llamado final “Become a new patient”",
    label: "Become a new patient",
  },
  "sophia-team-learn-more": {
    page: "Sophia · Equipo",
    where: "Botón de cada tarjeta del equipo",
    label: "Learn more",
  },
  "sophia-member-meet-team": {
    page: "Ficha de cada integrante",
    where: "Botón de regreso, arriba",
    label: "Meet our team",
  },
  "sophia-member-contact": {
    page: "Ficha de cada integrante",
    where: "Botón junto al nombre",
    label: "Contact us",
  },
  "new-patients-become": {
    page: "Sophia · Pacientes nuevos",
    where: "Botón “Become a Patient” (portada y cierre)",
    label: "Become a Patient",
  },
  "contact-health-institute": {
    page: "Contacto",
    where: "Nota del Health Institute",
    label: "Contact for Dietrich Klinghardt Health Institute™",
  },
  "contact-send": {
    page: "Contacto y formularios de contacto",
    where: "Botón de enviar el formulario",
    label: "Send message",
  },

  "foundation-support": {
    page: "Fundación",
    where: "Botón “Support the Foundation” (dos secciones)",
    label: "Support the Foundation",
  },
  "donate-get-in-touch": {
    page: "Fundación · Donar",
    where: "Panel de donación",
    label: "Get in touch",
  },

  "talks-join-now": {
    page: "Weekly Talks",
    where: "Portada, botón que lleva a los planes",
    label: "Join now",
  },
  "newsletter-join": {
    page: "Todo el sitio (boletín)",
    where: "Botón de suscribirse",
    label: "Join now",
  },

  "courses-all-courses": {
    page: "Cursos · ruta y fechas",
    where: "Botón de regreso “All courses”",
    label: "All courses",
  },
  "path-course-dates": {
    page: "Cursos · ruta de formación",
    where: "Panel lateral",
    label: "Course dates",
  },
  "path-about-course": {
    page: "Cursos · ruta de formación",
    where: "Botón principal del cuerpo",
    label: "About the course",
  },
  "path-online-dates": {
    page: "Cursos · ruta de formación",
    where: "Botón “To the online course dates”",
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
    page: "Akademie · Practitioners",
    where: "Botón del buscador",
    label: "Search",
  },
  "load-more": {
    page: "Listados (practitioners, fechas de curso)",
    where: "Botón de cargar más resultados",
    label: "Load more",
  },

  "store-back-home": {
    page: "Tienda (cuando está apagada)",
    where: "Botón de regreso al inicio",
    label: "Back to home",
  },
};
