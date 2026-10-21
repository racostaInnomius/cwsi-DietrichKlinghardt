import type { Card } from "@/lib/sections";

/**
 * Every block of copy the site shows, by its Page Contents slug — the text the
 * CMS was seeded with (client, 2026-10-21: "todo el contenido sembrado", slugs
 * named after the page and the heading so a block is easy to find) and what
 * each block shows until its row has that field filled in.
 *
 * useSection(slug) reads these automatically; the CMS wins field by field.
 * The seed (a one-off Payload script, 2026-10-21) created the missing rows
 * from this file and only filled EMPTY fields of existing ones, so nothing an
 * editor had already changed was overwritten.
 *
 * In paragraphs, **bold** and *italic* mark emphasis for the blocks that render
 * it (the quotes); the seed turns them into the CMS editor's own bold/italic.
 */
export interface BlockDefault {
  /** Where it shows (documentation for editors and the seed). */
  page: string;
  /** Page Contents → "Página del sitio": the list's filter-by-page buttons. */
  sitePage: string;
  kind: "page" | "section" | "component";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  paragraphs?: string[];
  cards?: Card[];
}

export const BLOCKS: Record<string, BlockDefault> = {
  "home-hero": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    eyebrow: "Dr. Dietrich Klinghardt™",
    title: "Healing Beyond",
    cards: [
      { "icon": "", "title": "Symptoms", "body": "" },
      { "icon": "", "title": "Diagnosis", "body": "" },
      { "icon": "", "title": "Labels", "body": "" },
    ],
  },
  "home-intro": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    title: "Dr. Klinghardt Akademie™",
    paragraphs: [
      "Training programmes and certifications for practitioners who want to bring Autonomic Response Testing and the 5 Levels of Healing into their own practice — taught by Dr. Klinghardt and the team he has trained worldwide.",
    ],
  },
  "home-events": {
    page: "/ and /events",
    sitePage: "Home",
    kind: "section",
    eyebrow: "Events & webinars",
    title: "Learn Directly from Dr. Klinghardt",
    paragraphs: [
      "Workshops, seminars and live webinars — in person and online.",
    ],
  },
  "home-art": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    eyebrow: "Diagnostic method",
    title: "A.R.T. Klinghardt™",
    subtitle: "Autonomic Response Testing®",
    paragraphs: [
      "A.R.T. is a diagnostic method that reads the body's own regulation to find what is driving illness — infections, toxicity, unresolved trauma — and in which order it must be addressed.",
    ],
  },
  "home-sophia": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    eyebrow: "Our clinic",
    title: "Sophia Health Institute by Dr. Dietrich Klinghardt™",
    paragraphs: [
      "A world-renowned healing centre offering a truly individualised, root-cause approach to complex chronic illness — one that looks beyond symptoms to the deeper origins of disease, supporting each person's journey toward optimal physical, emotional, mental and spiritual well-being.",
    ],
  },
  "home-talks": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    eyebrow: "Exclusive material",
    title: "Join My Weekly Talks",
    subtitle: "Join Now For Full Access",
    paragraphs: [
      "Every week, a live session with Dr. Klinghardt: a short teaching, then open questions from the community.",
    ],
  },
  "home-shop": {
    page: "/",
    sitePage: "Home",
    kind: "section",
    title: "Explore the Shop",
    paragraphs: [
      "Books, work materials, testing kits and professional resources, curated by Dr. Klinghardt.",
    ],
  },
  "newsletter": {
    page: "most pages",
    sitePage: "Newsletter",
    kind: "page",
    eyebrow: "Stay connected",
    title: "Join Our Newsletter",
    paragraphs: [
      "Receive insights, upcoming event announcements, and healing wisdom from Dr. Dietrich Klinghardt™ directly to your inbox.",
    ],
  },
  "about": {
    page: "/about",
    sitePage: "About",
    kind: "page",
    eyebrow: "About",
    title: "Dr. Dietrich Klinghardt™",
    paragraphs: [
      "Dietrich Klinghardt MD PhD™ is a physician, educator, author and internationally recognised voice in biological and integrative medicine. For more than four decades his clinical work has focused on understanding the complex relationships among the nervous system, immune system, environmental influences, chronic infections, unresolved trauma and human health.",
    ],
  },
  "about-chapters": {
    page: "/about",
    sitePage: "About",
    kind: "section",
    title: "About — Chapters",
    cards: [
      { "icon": "", "title": "Background", "body": "Dr. Dietrich Klinghardt™ studied medicine and psychology in Freiburg, Germany, where his doctoral research explored the relationship between the autonomic nervous system and the body's regulatory systems. After moving to the United States he worked in emergency medicine and later became Medical Director of the Santa Fe Pain Centre." },
      { "icon": "", "title": "Frameworks", "body": "Over the course of his career, Dr. Klinghardt developed several influential clinical and educational frameworks, including Autonomic Response Testing® and The 5 Levels of Healing™. His work brings together conventional medical knowledge, neurobiology, environmental medicine, psychology and selected traditions of biological medicine." },
      { "icon": "", "title": "Teaching", "body": "Dr. Klinghardt has trained practitioners and presented lectures, seminars and workshops internationally. His teaching emphasises careful observation, individualised care, professional curiosity, and the importance of considering the physical, energetic, emotional, mental and spiritual dimensions of human experience." },
      { "icon": "", "title": "Mission", "body": "Through his clinical work, publications, lectures and educational programmes, Dr. Klinghardt continues to encourage practitioners and patients to ask deeper questions, explore overlooked influences on health, and approach healing with both scientific curiosity and compassion." },
    ],
  },
  "about-timeline": {
    page: "/about",
    sitePage: "About",
    kind: "section",
    eyebrow: "Timeline",
    title: "A Life Dedicated to Healing",
    cards: [
      { "icon": "", "title": "Medical & Psychological Studies", "body": "Dr. Klinghardt studied medicine and psychology in Freiburg, Germany, where his doctoral research explored the relationship between the autonomic nervous system and the body's regulatory systems.", "label": "Early Years", "subtitle": "Freiburg, Germany" },
      { "icon": "", "title": "Emergency Medicine & Santa Fe Pain Centre", "body": "After moving to the United States he worked in emergency medicine and later became Medical Director of the Santa Fe Pain Centre. These early experiences shaped his commitment to looking beyond isolated symptoms and understanding the whole person.", "label": "1980s", "subtitle": "United States" },
      { "icon": "", "title": "Autonomic Response Testing® (A.R.T.®)", "body": "Dr. Klinghardt developed Autonomic Response Testing® — a clinically refined bioenergetic assessment system that uncovers hidden root causes of illness through the body's own regulatory responses.", "label": "1990s", "subtitle": "Clinical Development" },
      { "icon": "", "title": "The 5 Levels of Healing™", "body": "He formalised his signature framework addressing the physical, energetic, emotional, mental and spiritual dimensions of health, and began training practitioners and presenting lectures, seminars and workshops internationally.", "label": "2000s", "subtitle": "Framework & Teaching" },
      { "icon": "", "title": "Founding of Sophia Health Institute by Dr. Klinghardt™", "body": "He co-founded Sophia Health Institute by Dr. Klinghardt™ in Woodinville, WA — a world-renowned centre bringing together conventional medical knowledge, neurobiology, environmental medicine, psychology and selected traditions of biological medicine.", "label": "2010s", "subtitle": "Sophia Health Institute" },
      { "icon": "", "title": "Continued Research & Education", "body": "Through clinical work, publications, lectures and educational programmes, Dr. Klinghardt continues to encourage practitioners and patients to ask deeper questions, explore overlooked influences on health, and approach healing with both scientific curiosity and compassion.", "label": "Today", "subtitle": "Global Impact" },
    ],
  },
  "academy": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "page",
    title: "Dr. Klinghardt Akademie™",
    paragraphs: [
      "Training programmes and certifications for practitioners who want to bring Autonomic Response Testing and the 5 Levels of Healing into their own practice — taught by Dr. Klinghardt and the team he has trained worldwide.",
    ],
  },
  "academy-find-art-therapists": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Global network",
    title: "Find A.R.T.® Therapists",
    subtitle: "Browse our directory to find practitioners near you.",
    paragraphs: [
      "Looking for a certified A.R.T.® therapist or consultant near you? Our therapist directory helps you find qualified practitioners and clinics in your area, ready to support you on your journey toward health and wellbeing. Each listing links to the therapist's own website, where you can read about their approach, specialities and the services they offer.",
    ],
  },
  "academy-art-klinghardt": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Signature method",
    title: "A.R.T Klinghardt™",
    paragraphs: [
      "A.R.T Klinghardt™ (AUTONOMIC RESPONSE TESTING®) is a holistic method that works on an energetic level to support personal well-being. Using a kinesiological muscle test, it observes how the body responds to different stimuli to reveal possible energetic imbalances. It offers a complementary holistic assessment and is not a substitute for medical or psychotherapeutic care.",
    ],
  },
  "academy-5-levels-of-healing": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Five levels",
    title: "The 5 Levels of Healing™",
    subtitle: "Autonomic Response Testing®",
    paragraphs: [
      "According to Dr. Dietrich Klinghardt™, humans exist in several dimensions at once: the physical body lives within a sphere of invisible bodies that surround and permeate it. Each higher level organises the ones below it, while the lower levels supply energy — so a problem can begin on any level and travel downward until it becomes visible.",
    ],
  },
  "academy-publications": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Research & books",
    title: "Publications and Educational Resources",
    paragraphs: [
      "Throughout his career, Dr. Dietrich Klinghardt™ has written and contributed to books, articles, clinical papers, protocols, teaching manuals, interviews and educational presentations exploring biological and integrative medicine. This collection brings together selected works reflecting the evolution of his clinical thinking — from his early work in neural therapy and psycho-kinesiology to his later writing on neurobiology, environmental influences, chronic illness and The 5 Levels of Healing™.",
    ],
  },
  "academy-klinghardt-akademie": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Learning center",
    title: "Klinghardt Akademie",
    subtitle: "Dr. Klinghardt's academy in Europe",
    paragraphs: [
      "Based in Europe, the Klinghardt Akademie is Dr. Klinghardt's European training centre. It carries his diagnostic and therapeutic methods forward as a living system, continuously shaped by his clinical practice, research and decades of experience. Here, therapists and health-minded individuals can train directly in his core methods — A.R.T Klinghardt™ and Psycho-Kinesiology — grounded in The 5 Levels of Healing™. Seminars and materials are offered primarily in Europe.",
    ],
  },
  "academy-klinghardt-foundation": {
    page: "/academy",
    sitePage: "Akademie",
    kind: "section",
    eyebrow: "Research & impact",
    title: "Dr. Klinghardt Foundation™",
    paragraphs: [
      "The Dietrich Klinghardt Foundation™ is dedicated to helping people understand the deeper forces that shape human health and the capacity for healing. Continuing Dr. Klinghardt's life's work, the Foundation supports a more conscious approach to medicine — one that honours the whole person and helps people live with greater health and purpose.",
    ],
  },
  "art": {
    page: "/academy/art",
    sitePage: "Akademie · A.R.T. Klinghardt",
    kind: "page",
    eyebrow: "Signature method",
    title: "Autonomic Response Testing",
    paragraphs: [
      "A.R.T. is a diagnostic method that reads the autonomic nervous system directly: the body signals which stressors it is reacting to, and which of them it is ready to deal with first.",
      "It is a way of asking the body questions rather than asking a lab. A practitioner tests the response to specific substances, sites and stressors, and builds the treatment order from what comes back — then re-tests as the picture changes.",
      "It does not replace laboratory work; it decides what is worth testing, in which order to treat what is found, and when something has actually resolved.",
    ],
  },
  "art-quote": {
    page: "/academy/art",
    sitePage: "Akademie · A.R.T. Klinghardt",
    kind: "section",
    title: "A.R.T. — Quote",
    subtitle: "— Dr. Dietrich Klinghardt™",
    paragraphs: [
      "The body already knows.",
      "The method is only",
      "a way of listening.",
    ],
  },
  "art-next-steps": {
    page: "/academy/art",
    sitePage: "Akademie · A.R.T. Klinghardt",
    kind: "section",
    eyebrow: "Next steps",
    title: "Learn it, or find someone who has",
    paragraphs: [
      "Practitioners train through the certification path; patients can look for someone already working with the method nearby.",
    ],
  },
  "five-levels": {
    page: "/academy/five-levels",
    sitePage: "Akademie · The 5 Levels of Healing",
    kind: "page",
    eyebrow: "A framework for wholeness",
    title: "The 5 Levels of Healing™",
    paragraphs: [
      "According to Dr. Dietrich Klinghardt™, humans exist in several dimensions at once: the physical body lives within a sphere of invisible bodies that surround and permeate it.",
      "Each higher level organises the ones below it, while the lower levels supply energy — so a problem can begin on any level and travel downward until it becomes visible.",
    ],
  },
  "five-levels-quote": {
    page: "/academy/five-levels",
    sitePage: "Akademie · The 5 Levels of Healing",
    kind: "section",
    title: "The 5 Levels — Quote",
    subtitle: "— Dr. Dietrich Klinghardt™",
    paragraphs: [
      "“I have tried to establish some guidelines for therapists who aspire to a higher level in their work. *When improvements occur, both patient and physician should show gratitude and humility.*”",
    ],
  },
  "therapists": {
    page: "/academy/therapists",
    sitePage: "Akademie · Find A.R.T. Therapists",
    kind: "page",
    eyebrow: "Global practitioner directory",
    title: "Are You Looking For an A.R.T.® Klinghardt® Therapist?",
    paragraphs: [
      "Browse our directory to find practitioners near you. Visit their personal websites to learn more about the services and approach each of them offers.",
    ],
  },
  "courses": {
    page: "/courses",
    sitePage: "Online Courses",
    kind: "page",
    eyebrow: "Online courses",
    title: "Learn the Klinghardt Method",
    paragraphs: [
      "Five training paths, taught by Dr. Klinghardt and the practitioners he has certified. Each one can be taken level by level, and each level is bookable on its own.",
    ],
  },
  "foundation": {
    page: "/foundation",
    sitePage: "Foundation",
    kind: "page",
    title: "Preserving Knowledge. Advancing Education. Supporting the Future of Healing.",
    paragraphs: [
      "The Dr. Klinghardt Foundation™ is being established to preserve and advance the life's work of Dietrich Klinghardt MD PhD™, while supporting education, thoughtful inquiry, and greater access to knowledge in biological and integrative medicine.",
    ],
  },
  "foundation-purpose": {
    page: "/foundation",
    sitePage: "Foundation",
    kind: "section",
    eyebrow: "Our purpose",
    title: "Preserving Knowledge for Future Generations",
    paragraphs: [
      "The Foundation's purpose is to ensure that decades of clinical observations, lectures, publications, protocols and educational materials are responsibly preserved and made accessible to future generations of practitioners, researchers, students and members of the public.",
    ],
  },
  "foundation-commitments": {
    page: "/foundation",
    sitePage: "Foundation",
    kind: "section",
    eyebrow: "Four central commitments",
    title: "Its Work Will Be Organized Around Four Central Commitments:",
    cards: [
      { "icon": "archive", "title": "Preserving a Legacy", "body": "Creating a carefully maintained archive of Dr. Klinghardt's publications, lectures, interviews, protocols, correspondence and historical educational materials." },
      { "icon": "graduation-cap", "title": "Advancing Education", "body": "Supporting responsible educational programs, scholarships, lectures and professional training inspired by Dr. Klinghardt's interdisciplinary approach to health and healing." },
      { "icon": "flask", "title": "Encouraging Research", "body": "Promoting thoughtful scientific inquiry into questions arising from Dr. Klinghardt's clinical work and encouraging meaningful collaboration among practitioners, researchers and institutions." },
      { "icon": "globe", "title": "Expanding Access", "body": "Helping make educational resources available to communities and practitioners who might otherwise be unable to access advanced training and information." },
    ],
  },
  "foundation-quote": {
    page: "/foundation",
    sitePage: "Foundation",
    kind: "section",
    title: "Foundation — Quote",
    subtitle: "— Dr. Dietrich Klinghardt™",
    paragraphs: [
      "“The Foundation is intended to serve as a living bridge between **Dr. Klinghardt's lifetime of work and the future of integrative healthcare**—honoring what has been learned while encouraging new questions, responsible investigation, and compassionate service.”",
    ],
  },
  "donate": {
    page: "/foundation/donate",
    sitePage: "Foundation · Donate",
    kind: "page",
    eyebrow: "Klinghardt Foundation™",
    title: "Support the Foundation",
    paragraphs: [
      "Every contribution goes to preserving the archive, funding scholarships, and keeping this body of work available to the practitioners who come next.",
    ],
  },
  "donate-where-a-contribution-goes": {
    page: "/foundation/donate",
    sitePage: "Foundation · Donate",
    kind: "section",
    title: "Where a contribution goes",
    paragraphs: [
      "The Foundation preserves decades of clinical observation, lectures, protocols and educational material, and makes them available to practitioners, researchers and students who would otherwise have no route to them.",
      "Contributions fund the archive itself, scholarships for practitioners in training, and research into questions raised by the clinical work.",
      "Donations are processed by Stripe. Card details never reach this site or the Foundation.",
    ],
  },
  "donate-donations-open-soon": {
    page: "/foundation/donate",
    sitePage: "Foundation · Donate",
    kind: "section",
    eyebrow: "Not open yet",
    title: "Donations open soon",
    paragraphs: [
      "The Foundation is still being established and cannot accept contributions yet. If you would like to support it, write to us and we will come back to you as soon as it can.",
    ],
  },
  "contact": {
    page: "/contact",
    sitePage: "Contact",
    kind: "page",
    eyebrow: "Get in touch",
    title: "Contact Us",
    paragraphs: [
      "Four ways in, depending on what you need. We answer every message, though seminar weeks can slow us down.",
    ],
  },
  "contact-cards": {
    page: "/contact",
    sitePage: "Contact",
    kind: "section",
    title: "Contact — Cards",
    cards: [
      { "icon": "mail", "title": "General Inquiries", "body": "Questions about Dr. Klinghardt's work, website, publications, or educational resources.", "email": "hello@dietrich-klinghardt.com" },
      { "icon": "briefcase", "title": "Media & Press", "body": "Interviews, press inquiries, podcasts, documentaries, and media opportunities.", "email": "media@dietrich-klinghardt.com" },
      { "icon": "microphone", "title": "Speaking & Events", "body": "Conference invitations, lectures, professional seminars, and educational appearances.", "email": "speaking@dietrich-klinghardt.com" },
      { "icon": "heart", "title": "Dr. Klinghardt Foundation", "body": "Educational initiatives, archival projects, partnerships, and future programs.", "email": "foundation@dietrich-klinghardt.com" },
    ],
  },
  "contact-please-note": {
    page: "/contact",
    sitePage: "Contact",
    kind: "section",
    title: "Contact — Please note",
    paragraphs: [
      "**Please note:** do not send private medical records, test results or urgent healthcare requests through these email addresses. This website does not provide individualised medical advice, and messages are not monitored for medical emergencies.",
    ],
  },
  "store-intro": {
    page: "/store",
    sitePage: "Store",
    kind: "section",
    eyebrow: "Shop",
    title: "Explore the Klinghardt® Store",
    paragraphs: [
      "Discover books, work materials, testing kits, scripts and other professional resources used in neurobiological practice.",
    ],
  },
  "music": {
    page: "/music",
    sitePage: "Music",
    kind: "page",
    eyebrow: "Sound and healing",
    title: "Music as Medicine",
    paragraphs: [
      "Sound reaches levels of the nervous system that words do not. These recordings are made to be listened to slowly.",
    ],
  },
  "music-discography": {
    page: "/music",
    sitePage: "Music",
    kind: "section",
    eyebrow: "Recordings",
    title: "Discography",
    subtitle: "All recordings are available as high-quality digital downloads. Proceeds support the ongoing research work of the Klinghardt Foundation.",
  },
  "weekly-talks": {
    page: "/weekly-talks",
    sitePage: "Weekly Talks",
    kind: "page",
    eyebrow: "Exclusive membership",
    title: "Join My Weekly Talks",
    subtitle: "Live Answers, Every Week, Directly From Dr. Klinghardt.",
    paragraphs: [
      "Every week, a live session with Dr. Klinghardt: a short teaching on what he is working through clinically, then open questions from the community.",
      "Members get the live session, the replay, and the archive of everything that came before.",
    ],
  },
  "weekly-talks-benefits": {
    page: "/weekly-talks",
    sitePage: "Weekly Talks",
    kind: "section",
    title: "Weekly Talks — Benefits",
    cards: [
      { "icon": "", "title": "Live weekly talks every Wednesday", "body": "" },
      { "icon": "", "title": "Full recordings archive (all past sessions)", "body": "" },
      { "icon": "", "title": "Live Q&A with Dr. Dietrich Klinghardt™", "body": "" },
      { "icon": "", "title": "Priority access to special guest sessions", "body": "" },
    ],
  },
  "weekly-talks-pricing": {
    page: "/weekly-talks",
    sitePage: "Weekly Talks",
    kind: "section",
    eyebrow: "Pricing",
    title: "Learn, Connect, Grow Together",
  },
  "weekly-talks-faq": {
    page: "/weekly-talks",
    sitePage: "Weekly Talks",
    kind: "section",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
  },
  "archives-home": {
    page: "/archives",
    sitePage: "Archives",
    kind: "section",
    eyebrow: "A living archive",
    title: "The Klinghardt Living Archive",
    subtitle: "A Lifetime of Discovery, Rediscovered",
    paragraphs: [
      "For over four decades, Dr. Dietrich Klinghardt has accumulated an extraordinary body of knowledge — in written notes, recorded lectures, hand-drawn diagrams, private correspondence, and rare seminar footage. Most of it has never been seen by the public. The Klinghardt Living Archive is being carefully assembled — one piece at a time — to bring this lifetime of discovery into the world. Each week, a new item unlocks. Some have never left the clinic walls. All of them matter.",
    ],
  },
  "archives-six-collections": {
    page: "/archives",
    sitePage: "Archives",
    kind: "section",
    eyebrow: "What’s inside",
    title: "Six Collections, One Archive",
    subtitle: "Newly restored materials, unveiled every week",
    paragraphs: [
      "Six collections are being prepared for release. Each week, one new piece is added to the Archive — the rest remain sealed until it's their turn.",
    ],
  },
  "archives-how-it-works": {
    page: "/archives",
    sitePage: "Archives",
    kind: "section",
    eyebrow: "How it works",
    title: "One New Piece, Every Week",
    cards: [
      { "icon": "", "title": "Restore", "body": "Each piece is carefully digitized, curated, and authenticated from the original source materials." },
      { "icon": "", "title": "Reveal", "body": "One new item unlocks every week — surfacing knowledge that has never been publicly accessible." },
      { "icon": "", "title": "Explore", "body": "Navigate by topic, date, or medium. Search the full archive as it grows over time." },
    ],
  },
  "sophia-home": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "page",
    eyebrow: "Sophia Health Institute by Dr. Klinghardt™",
    title: "Founded by Dr. Dietrich Klinghardt™ Built for True Healing",
    paragraphs: [
      "Sophia Health Institute by Dr. Klinghardt™ is a world-renowned healing centre dedicated to restoring health on every level — physical, emotional, mental and spiritual. We provide a truly individualised, root-cause approach to complex chronic illness.",
    ],
  },
  "sophia-figures": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    title: "Sophia — Figures",
    cards: [
      { "icon": "", "title": "Years of experience", "body": "", "label": "25+" },
      { "icon": "", "title": "Patients treated worldwide", "body": "", "label": "10K" },
      { "icon": "", "title": "Levels of healing addressed", "body": "", "label": "5" },
      { "icon": "", "title": "Root-cause focused care", "body": "", "label": "100%" },
    ],
  },
  "sophia-our-approach": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    eyebrow: "Who we are",
    title: "Our Approach",
    paragraphs: [
      "At Sophia Health Institute by Dr. Klinghardt™, we use Autonomic Response Testing (A.R.T.®) Dr. Dietrich Klinghardt™ clinically refined diagnostic system to uncover the hidden causes of illness with remarkable precision. This tool allows us to tailor treatments to each individual’s unique needs, ensuring that no layer of dysfunction is overlooked.",
      "Beyond the science, it’s our compassionate approach that makes the difference. Our team is committed to creating a space where every patient feels safe, heard, and genuinely supported. This combination of cutting edge diagnostics and heartfelt care is what drives the exceptional outcomes we’re known for.",
      "If you're dealing with chronic illness, you might be skeptical of new treatment methods. Dr. Dietrich Klinghardt™ explains the pillars of treating chronic illness.",
    ],
  },
  "sophia-six-pillars": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    eyebrow: "What makes Sophia unique",
    title: "Six Pillars of A Different Approach",
    cards: [
      { "icon": "shield", "title": "World-Class Leadership", "body": "Care led by Dr. Dietrich Klinghardt, a globally recognised pioneer in the treatment of chronic illness, chronic infections, environmental toxicity and unresolved trauma." },
      { "icon": "target", "title": "Precision Diagnostics — A.R.T Klinghardt™", "body": "Autonomic Response Testing uncovers the hidden causes of illness. Every practitioner on our team is certified in A.R.T Klinghardt™." },
      { "icon": "layers", "title": "The 5 Levels of Healing™", "body": "Dr. Klinghardt's signature framework addresses the physical, energetic, emotional, mental and spiritual dimensions of health, treating the whole person." },
      { "icon": "sprout", "title": "Root-Cause Resolution", "body": "We look at your entire system to understand why you haven't made progress before — not just managing Lyme, mould, heavy metals or trauma in isolation." },
      { "icon": "bolt", "title": "A Hub of Research & Innovation", "body": "Practitioners travel from around the world to learn from Dr. Klinghardt, and techniques created here have revolutionised how chronic illness is treated globally." },
      { "icon": "heart", "title": "Warm, Personalised Care", "body": "Every case of chronic illness is unique. You'll receive dedicated attention from a team that listens, empathises and understands how you feel." },
    ],
  },
  "sophia-cutting-edge-science": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    eyebrow: "Our approach",
    title: "Cutting-edge Science Meets Heartfelt Care",
    paragraphs: [
      "At Sophia Health Institute by Dr. Klinghardt™, we don't just look at your symptoms. We look at your entire health history and current health profile — chronic infections, environmental toxicity, dental history, epigenetics, diet, lifestyle, your family system and more — to find and treat the root causes of why you are ill.",
      "Beyond the science, it is our compassionate approach that makes the difference: a space where every patient feels safe, heard and genuinely supported.",
    ],
    cards: [
      { "icon": "", "title": "Intake & History Review", "body": "Deep-dive into your complete health history, environment and prior treatments." },
      { "icon": "", "title": "A.R.T Klinghardt™ Assessment", "body": "Bioenergetic testing to identify hidden root causes and organ-level dysfunction." },
      { "icon": "", "title": "Individualized Protocol", "body": "A unique treatment plan addressing all relevant levels of illness." },
      { "icon": "", "title": "Ongoing Support", "body": "Regular follow-up, protocol adjustments and access to the SHI team." },
    ],
  },
  "sophia-naturopathic-care": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    eyebrow: "Naturopathic care",
    title: "Healing the Whole Person, Mind, Body, and Spirit",
    cards: [
      { "icon": "pulse", "title": "Treating Chronic Illness", "body": "If you're dealing with chronic illness, you might be skeptical of new treatment methods. It's natural to wonder what makes Sophia Health Institute by Dr.Klinghardt better than other clinics and treatment methods you've tried." },
      { "icon": "sparkles", "title": "Treatments Unavailable Elsewhere", "body": "You get access to different treatment methods that other clinics don’t offer. Depending on your treatment plan, you’ll get an opportunity to try different healing methods from our extensive list of treatment options." },
      { "icon": "flask", "title": "Research and Innovation", "body": "Practitioners from around the world have traveled far and wide to learn directly from Dr. Klinghardt, for his research and innovation in finding new, effective methods for treating the root causes of chronic illness. Techniques and methods created by Dr. Klinghardt have revolutionized the way chronic illness is treated around the world." },
      { "icon": "star", "title": "Experts On Treating Chronic Illness", "body": "You’ll receive treatment from one of the world’s leading experts on treating chronic illness. Sophia Health Institute is the home of Dr. Klinghardt, one of the world’s leading specialists in treating chronic illness. Dr. Klinghardt is the founder and medical director of the clinic and he has dedicated his life to research and innovation in the field of chronic illness." },
      { "icon": "clipboard", "title": "Comprehensive Assessment", "body": "You’ll get an in depth treatment plan that targets the root cause of your illness, not just your symptoms. Oftentimes, you don’t just have Lyme disease, mold illness, heavy metals, a root canal, or unhealed trauma. We look at your illness in the context of the whole system so we can uncover as much as possible to understand why you haven’t made progress in the past with other treatment methods. We will do this before prescribing a new treatment plan to you." },
      { "icon": "user-check", "title": "Personalized Care", "body": "You’ll get personalized care, attention, and support from a team of specialists who understand how you feel and have experience treating your symptoms. Our team is specially trained in helping you in all aspects of your healing. All of our doctors are very closely connected with Dr. Klinghardt. Dr.Klinghardt personally trains each doctor in administering best assessment protocols so they can find the missing links in your treatment to give you the support you’ve been searching for." },
      { "icon": "leaf", "title": "Traditional Therapies", "body": "Our approach brings together a range of therapies, including homeopathy, neural therapy, liver flushes, castor oil packs, hot and cold baths, sauna, PhotonWave, pulsed electromagnetic field therapy, and microcurrent." },
      { "icon": "droplet", "title": "IV Therapies", "body": "At SHI by Dr.Klinghardt, personalized care starts with understanding what you need, we’ll help you explore the right options. For those seeking ongoing care, we can guide tailored recommendations, track your response to treatment, and inform adjustments as your needs evolve." },
    ],
  },
  "sophia-what-we-treat": {
    page: "/sophia",
    sitePage: "Sophia",
    kind: "section",
    eyebrow: "What we treat",
    title: "Complex Conditions. Real Answers",
    cards: [
      { "icon": "", "title": "Lyme disease", "body": "" },
      { "icon": "", "title": "Chronic fatigue", "body": "" },
      { "icon": "", "title": "Sleep & digestive disorders", "body": "" },
      { "icon": "", "title": "Chronic pain", "body": "" },
      { "icon": "", "title": "Mold illness", "body": "" },
      { "icon": "", "title": "Heavy metal toxicity", "body": "" },
      { "icon": "", "title": "Hormone imbalances", "body": "" },
      { "icon": "", "title": "Premature aging", "body": "" },
    ],
  },
  "sophia-cta-stop-wondering": {
    page: "/sophia, /sophia/team",
    sitePage: "Sophia",
    kind: "component",
    eyebrow: "Ready to begin",
    title: "Stop Wondering.",
    subtitle: "Start Finding Answers",
    paragraphs: [
      "The Sophia Health Institute by Dr. Klinghardt™ team is ready to help you. Before you become a patient, it is natural to have questions — our patient coordinator would be happy to answer them.",
    ],
  },
  "sophia-team": {
    page: "/sophia/team",
    sitePage: "Sophia · Our Team",
    kind: "page",
    eyebrow: "Sophia Health Institute™",
    title: "Meet Our Team",
    paragraphs: [
      "We are proud to offer a dedicated multidisciplinary team committed to guiding patients toward true healing. Led by Dr. Dietrich Klinghardt™, our team includes medical and naturopathic doctors, chiropractors, certified physician assistants, and registered nurses trained in Autonomic Response Testing™ (A.R.T™). We also have a dedicated clinical support staff who play an essential role in ensuring every step of the patient's care is seamless, compassionate, and effective from start to finish.",
    ],
  },
  "new-patients": {
    page: "/sophia/new-patients",
    sitePage: "Sophia · New Patients",
    kind: "page",
    title: "New Patient Information",
    paragraphs: [
      "Thank you for your interest in becoming a patient. We are honoured you are exploring the option of having our team become your provider of treatment and healing.",
    ],
  },
  "sophia-new-patients-welcome": {
    page: "/sophia/new-patients",
    sitePage: "Sophia · New Patients",
    kind: "section",
    eyebrow: "Welcome",
    title: "We Know You Have Been Through a Lot",
    paragraphs: [
      "All of your questions are important, and it is our goal to answer them and give you as much information as possible toward making a decision that is right for you.",
      "We are honoured you are exploring the option of having the team at Sophia Health Institute by Dr. Klinghardt™ become your provider of treatment and healing.",
      "We understand that living with your illness has made your daily life a struggle. It is our goal to provide you with a caring, individualised approach — one that honours the complexity of your experience and the depth of your determination to heal.",
    ],
  },
  "sophia-new-patients-you-may-be-wondering": {
    page: "/sophia/new-patients",
    sitePage: "Sophia · New Patients",
    kind: "section",
    eyebrow: "Frequently asked",
    title: "You May Be Wondering…",
    paragraphs: [
      "As you consider becoming a patient, you might have a lot of questions. Here are the ones we hear most often.",
    ],
    cards: [
      { "icon": "", "title": "Will this work?", "body": "" },
      { "icon": "", "title": "I've seen many specialists. How will you be any different?", "body": "" },
      { "icon": "", "title": "Can I afford this treatment?", "body": "" },
      { "icon": "", "title": "What can I expect as a patient?", "body": "" },
      { "icon": "", "title": "What kind of results do you get for your patients?", "body": "" },
    ],
  },
  "sophia-new-patients-what-makes-this-different": {
    page: "/sophia/new-patients",
    sitePage: "Sophia · New Patients",
    kind: "section",
    eyebrow: "Our approach",
    title: "What Makes This Different",
    paragraphs: [
      "Four things shape every care plan we build.",
    ],
    cards: [
      { "icon": "", "title": "Root-Cause Medicine", "body": "We go beyond symptom management to identify and address the underlying drivers of chronic illness — including infections, toxins, structural imbalances, emotional trauma and environmental exposures." },
      { "icon": "", "title": "Individualized Care", "body": "No two patients are the same. Every care plan is designed specifically for you, based on your history, your biology and your goals. We do not apply one-size-fits-all protocols." },
      { "icon": "", "title": "Autonomic Response Testing®", "body": "Dr. Dietrich Klinghardt's A.R.T.® method gives our practitioners a sophisticated clinical tool to assess the body's own regulatory responses and identify hidden contributors to illness." },
      { "icon": "", "title": "The 5 Levels of Healing™", "body": "Our model of care addresses the physical body, the energy field, the mental-emotional dimension, the intuitive body and the spiritual dimension — recognising that lasting healing often requires attention on more than one level." },
    ],
  },
  "sophia-new-patients-what-to-expect": {
    page: "/sophia/new-patients",
    sitePage: "Sophia · New Patients",
    kind: "section",
    eyebrow: "Your first steps",
    title: "What to Expect as a Patient",
    cards: [
      { "icon": "", "title": "Reach Out", "body": "Contact our team to introduce yourself, ask questions, and learn whether Sophia Health Institute® is the right fit for where you are in your health journey." },
      { "icon": "", "title": "Comprehensive Intake", "body": "New patients complete an in-depth review of health history, prior testing and current concerns — so that your first appointment can begin with real depth and context." },
      { "icon": "", "title": "Individualized Care Plan", "body": "Your practitioners design a care plan specifically for you — not a template, not a protocol applied to everyone. Your biology, your history, your goals." },
    ],
  },
  "sophia-cta-ready-to-take-the-next-step": {
    page: "/sophia/new-patients, /sophia/accommodations",
    sitePage: "Sophia",
    kind: "component",
    eyebrow: "Ready to begin",
    title: "Ready to",
    subtitle: "Take The Next Step",
    paragraphs: [
      "Our friendly team is here to help. Fill out the form and we will review your message and respond as soon as possible during our regular business hours.",
    ],
  },
  "accommodations": {
    page: "/sophia/accommodations",
    sitePage: "Sophia · Travel & Accommodations",
    kind: "page",
    eyebrow: "Get started",
    title: "How to Find Us",
    paragraphs: [
      "Sophia Health Institute by Dr. Klinghardt™ sits in Woodinville, about 30 miles north-east of downtown Seattle — a town known for its scenic river valley, small-town charm, and lively mix of breweries, wineries and distilleries.",
      "We chose it for the calm it offers away from the city, plus easy access to the outdoors for hiking, walking and biking.",
    ],
  },
  "sophia-accommodations-hotels": {
    page: "/sophia/accommodations",
    sitePage: "Sophia · Travel & Accommodations",
    kind: "section",
    eyebrow: "Accommodations",
    title: "Hotels in The Local Area",
    paragraphs: [
      "Many of the accommodations listed below have offered a discounted rate to Sophia Health Institute by Dr. Klinghardt™ patients, depending on occupancy. Please enquire about a discounted rate when booking your reservation.",
    ],
    cards: [
      { "icon": "", "title": "Heathman Hotel", "body": "Use promo code SINVA for a discounted rate, or call the hotel directly.", "subtitle": "220 Kirkland Avenue, Kirkland, WA 98033", "phone": "(425) 284-5800" },
      { "icon": "", "title": "Hampton Inn & Suites", "body": "Get the best discounted rate when you mention you are a patient of Sophia HI.", "subtitle": "19211 Woodinville Snohomish Rd, Woodinville, WA 98072" },
      { "icon": "", "title": "Residence Inn", "body": "", "subtitle": "1920 Northeast 195th Street, Bothell, WA 98011", "phone": "(425) 485-3030" },
      { "icon": "", "title": "Comfort Inn & Suites", "body": "", "subtitle": "1414 228th Street Southeast, Bothell, WA 98021", "phone": "(425) 402-0900", "link": "comfortinn.com" },
      { "icon": "", "title": "Country Inn & Suites", "body": "", "subtitle": "19333 North Creek Parkway, Bothell, WA 98011", "phone": "(425) 485-5557", "link": "countryinns.com" },
    ],
  },
};
