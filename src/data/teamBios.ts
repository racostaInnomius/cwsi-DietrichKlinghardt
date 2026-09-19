/**
 * Full "About" bios for the Sophia team, one Learn More page each — the
 * fallback `TeamMemberPage.tsx` renders until the matching `board-members`
 * row's own `bio` field is filled in in the CMS.
 *
 * Source: https://www.sophiahi.com/team and each practitioner's own bio
 * page there (client, 2026-09-18: "de ahí toma su info"). `board-members`
 * didn't have a `bio` field at all when this was first written; one was
 * added (2026-09-19, for Sistworld's own board bios — board-members is a
 * CMS collection shared across tenants) and TeamMemberPage.tsx now reads
 * that field first, falling back to this file until a row's bio is
 * actually filled in. `slugifyName(row.name)` is what ties a bio here to
 * the matching `board-members` person.
 */

/** "Dr. Jadie Ko" -> "jadie-ko"; "Andreanna (Andi) Rainville" -> "andreanna-rainville". */
export function slugifyName(name: string): string {
  return name
    .replace(/^Dr\.\s+/i, "")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TeamBio {
  paragraphs: string[];
}

export const teamBios: Record<string, TeamBio> = {
  "dietrich-klinghardt": {
    paragraphs: [
      "Dr. Dietrich Klinghardt is a globally recognized pioneer and thought leader in the field of biological and integrative medicine, with over four decades of clinical experience treating chronic illness, neurological conditions, chronic pain, autism spectrum disorder, Lyme disease, mold illness, heavy metal toxicity, and environmentally acquired illness.",
      "He developed the Five Levels of Healing™ model, integrating conventional medicine with functional diagnostics and ancient healing wisdom — combining orthopedic techniques with applied neurobiology, immunology, endocrinology, toxicology, and neural therapy.",
      "He founded the Sophia Health Institute in Woodinville, Washington in 2012 and chairs the Institute of Neurobiology (INK) in Germany. He teaches Autonomic Response Testing (A.R.T™), Psychokinesiology (PK), Systemic Family Constellation (SRT), and Mental Field Therapy (MFT) internationally to thousands of practitioners across Europe, the U.S., South America, and Asia.",
    ],
  },
  "jadie-ko": {
    paragraphs: [
      "Dr. Jadie Ko is a highly skilled and compassionate naturopathic doctor with extensive clinical experience in integrative and functional medicine. She is a licensed naturopathic physician in Washington state, supporting patients with complex chronic conditions including Lyme disease, co-infections, and immune dysfunction.",
      "Her background spans botanical medicine, nutritional therapeutics, autonomic regulation testing, and chronic illness management. She collaborates on protocol implementation, patient follow-ups, and treatment strategies emphasizing detoxification, immune support, and nervous system regulation.",
      "Dr. Ko brings strong diagnostic skills and individualized treatment planning to every case, with a genuine dedication to improving the quality of life for those living with chronic health conditions — bridging conventional and naturopathic approaches while maintaining an ongoing commitment to professional development and patient education.",
    ],
  },
  "summer-beattie": {
    paragraphs: [
      "Dr. Summer Beattie is a Naturopathic Doctor with a unique specialty in Procedural and Regenerative Medicine. Born and raised in rural Alaska, she carries that grounded, nature-connected spirit into every aspect of her healing work. She earned her Doctorate in Naturopathic Medicine from Bastyr University in Seattle in 2004.",
      "After nearly a decade in family practice, Dr. Beattie served two terms on the Board of Directors for the Washington Association of Naturopathic Physicians. She then returned to Alaska to work at a specialty surgery center before settling back in Washington in 2015 to deepen her work in regenerative and integrative medicine.",
      "Her clinical focus includes injection-based therapies, IV treatments, ozone and photodynamic therapies, and hormone optimization, alongside advanced training in the treatment of chronic illness — including vector-borne infections, mold and environmental toxicity, autoimmune disease, and neurodegenerative conditions.",
      "At Sophia Health Institute, Dr. Beattie works alongside Dr. Dietrich Klinghardt to support patients with chronic and complex illness, blending advanced diagnostics with compassionate, whole-person care. A hallmark of her approach is bioregulatory medicine — personalized protocols addressing root causes with both modern diagnostics and energetic modalities, including sound, light, and frequency-based therapies, with particular focus on brain health and complementary oncology.",
    ],
  },
  "kim-dines": {
    paragraphs: [
      "Kim Dines is an integrative manual therapist whose work bridges advanced physical rehabilitation with mind–body therapeutics, cranial and visceral approaches, and autonomic nervous system regulation.",
      "Her clinical training encompasses myofascial release, craniosacral therapy, craniofacial mobilization, neuromanipulation, visceral manipulation, manual lymphatic drainage, scar release, trigger point therapy, acupressure, and functional nutritional therapy — addressing chronic illness, mobility issues, pain, neurological conditions, and complex presentations across musculoskeletal, fascial, visceral, cranial, lymphatic, and energetic layers.",
      "At Sophia Health Institute, Kim collaborates with Dr. Dietrich Klinghardt and is especially recommended for patients with developmental or neurological needs, including autism-spectrum conditions, with the goal of restoring function, comfort, nervous system balance, and embodied well-being.",
    ],
  },
  "nava-wiegert": {
    paragraphs: [
      "Nava Wiegert brings exquisitely refined therapeutic touch to Sophia Health Institute, collaborating closely with Dr. Klinghardt as a core member of his healing team. A childhood spent horseback riding taught her nuanced communication through movement, and degrees from the University of Michigan in science and art & design deepened her understanding of structure and balance.",
      "She specializes in the Trager® Approach, a modality using rhythmic, wave-like movement to invite the body into relaxation and dissolve long-held tension patterns — restoring natural freedom restricted by conditioning, trauma, injury, or illness.",
      "Sessions typically address chronic tension relief, improved mobility, expanded breathing capacity, emotional processing, and nervous system recalibration. The work is cumulative, often including movement education to help clients replace restrictive habits with relaxation techniques and foster a more peaceful way of being.",
    ],
  },
  "terry-enriques": {
    paragraphs: [
      "Terry Enriques relocated to Washington from Hawaiʻi with over 25 years of experience as a Registered Medical Assistant, with a clinical background spanning pediatrics, internal medicine, orthopedics, ophthalmology, LASIK surgery, and allergy-immunology.",
      "Her own experience with seizures and gastrointestinal challenges shaped her interest in integrative healing approaches. Since 2021, she has served at Sophia Health Institute in a range of clinical support roles, including Autonomic Response Testing (A.R.T™), Photon Wave treatments, and preparing Low Dose Immunotherapy (LDI) and homeopathic tinctures.",
      "Outside clinical work, she enjoys cooking, gardening, studying nutrition, and spending time with family while appreciating Washington's seasonal rhythms.",
    ],
  },
  "dominique-hilliard": {
    paragraphs: [
      "Dominique Hilliard is an administrative professional with over ten years of experience supporting executive leadership and developing organizational systems, with a background spanning healthcare and the philanthropic sector.",
      "Throughout her career she has strengthened organizational effectiveness by managing grant operations, directing staff onboarding and training, and establishing communication workflows — balancing strategic planning with the operational details that keep an organization stable.",
      "A Pacific Northwest resident, Dominique brings a grounded presence to her work and personal life, with interests including cooking for friends and family, music curation, and outdoor time with her dog, Ruka. Her commitment to equity and holistic wellness shapes her daily contributions at Sophia Health Institute, where thoughtful systems and human connection go hand in hand.",
    ],
  },
  "andreanna-rainville": {
    paragraphs: [
      "Andreanna (Andi) Rainville is a registered nurse and nutritional counselor with over 20 years of experience in integrative and functional medicine, specializing in injection therapies, genetic and methylation optimization, detoxification, and complex chronic illness management.",
      "She worked extensively with Dr. Dietrich Klinghardt, serving as his lead clinical nurse and senior instructor at the Klinghardt Academy for more than two decades. Her clinical work incorporates regenerative medicine, ozone, light, and laser therapies alongside nature-based healing approaches influenced by her upbringing in Kauai.",
      "At Sophia Health Institute, she supports patients across all life stages with a dynamic, forward-thinking approach to integrative care, emphasizing education, empowerment, and comprehensive healing.",
    ],
  },
};
