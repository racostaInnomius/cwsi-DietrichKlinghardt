/**
 * The five training paths, transcribed from the Figma frames `DK__Online
 * Courses` (0:2063) and `DK__Online Courses internal` (0:2732).
 *
 * This is not placeholder copy: it is the real launch content the designer put
 * in the file, so the Courses pages are complete and reviewable before the
 * `training-paths` collection exists in the CMS. When the collection lands,
 * each row overrides its counterpart here field by field (see
 * `src/lib/trainingPaths.ts`).
 *
 * Only A.R.T. has the full internal page in the design — the note on the frame
 * says to replicate it for MFT/PK/SRT/ANK — so the other four carry what the
 * grid shows and their pages render the sections they actually have.
 */

export interface CurriculumStep {
  label: string;
  note?: string;
}

export interface TrainingPath {
  slug: string;
  /** Card and page title, e.g. "A.R.T Klinghardt™ – Autonomous Response Test". */
  title: string;
  /** Short mark used in the sidebar, e.g. "A.R.T.®". */
  abbreviation: string;
  /** Expanded name under the mark, e.g. "AUTONOMIC RESPONSE TESTING®". */
  subtitle: string;
  shortDescription: string;
  /** Level chips on the grid card: "ART I", "ART II", … */
  levels: string[];
  targetGroup: string[];
  languages: string[];
  diploma: string;
  /** "About the course" paragraphs. */
  about: string[];
  /** "During training" paragraphs. */
  duringTraining: string[];
  /** Numbered course of training. */
  curriculum: CurriculumStep[];
  /** The step that closes the path, drawn apart from the numbered list. */
  finalStep?: string;
  /** Asterisked notes under the curriculum. */
  footnotes: string[];
  examRequirements: string[];
  recommendedNote?: string;
  recommendedSeminars: string[];
  /** Seminar titles for the "course content & seminar dates" list. */
  seminars: string[];
  order: number;
}

export const trainingPaths: TrainingPath[] = [
  {
    slug: "art",
    title: "A.R.T Klinghardt™ – Autonomous Response Test",
    abbreviation: "A.R.T.®",
    subtitle: "AUTONOMIC RESPONSE TESTING®",
    shortDescription:
      "The A.R.T Klinghardt™, AUTONOMIC RESPONSE TESTING® developed by Dr. Dietrich Klinghardt™ is a holistic approach that uses physical reactions as indicators of internal processes, promoting general well-being by addressing personal issues and inner blockages.",
    levels: ["ART I", "ART II", "ART III", "ART Actual (IV)"],
    targetGroup: [
      "Doctors, dentists",
      "Alternative practitioners, psychotherapists",
      "Psychologists",
      "People in training for therapeutic professions",
    ],
    languages: ["German", "English"],
    diploma: "Training to become a certified A.R.T.® therapist",
    about: [
      "A.R.T Klinghardt™ AUTONOMIC RESPONSE TESTING®, developed by Dr. Dietrich Klinghardt™, is a holistic approach that can provide stimulation on an energetic level. Its goal is to promote general well-being.",
      "Initially, kinesiological muscle testing can be used to observe how the body reacts to certain stimuli. This can reveal clues to energetic imbalances or stressful issues. This method serves as a complementary holistic approach.",
      "This particular test requires great care to learn. This type of testing allows us to use the body's individual responses as indicators.",
      "Mastering the Autonomous Response Test is a very important component for your success in working with Dr. Klinghardt's method.",
    ],
    duringTraining: [
      "This training is also a time for self-awareness, meaning that course participants undergo A.R.T.® and PK treatments themselves. During the practice sessions in seminars and continuing education courses, participants document their work.",
      "This documentation is a prerequisite for admission to the examination at the end of the training.",
    ],
    curriculum: [
      { label: "Autonomous Response Test I (A.R.T.® I) or MFT I*" },
      { label: "Psycho-Kinesiology I (PK I)" },
      { label: "MFT I in presence (if not started)" },
      { label: "A.R.T.® II" },
      { label: "PK II" },
      { label: "A.R.T.® III" },
      { label: "A.R.T.® Actual (ART IV)" },
      { label: "PK III" },
      {
        label: "PK IV**",
        note: "The PK IV course provides the opportunity for intensive self-experience of the major themes of our lives.",
      },
    ],
    finalStep: "Examination with certificate (A.R.T.® therapist)",
    footnotes: [
      "*The MFT I course can also be attended after A.R.T.® II, but is a prerequisite for PK II. The MFT I online course is only valid until PK II, after which the on-site course is required.",
      "**Before PK IV, participation in three family constellations and at least one personal constellation is recommended.",
    ],
    examRequirements: [
      "ART I–IV",
      "PK I–IV",
      "MFT I in presence",
      "Recommended: MFT II and III",
    ],
    recommendedNote:
      "All courses can be booked individually. They can be repeated within three years at a reduced price, even with a different teacher.",
    recommendedSeminars: ["Neural therapy", "Systematic Family Therapy (SRT)"],
    seminars: [
      "Seminar A.R.T.® I – Autonomous Response Test I",
      "Seminar A.R.T.® II – Autonomous Response Test II",
      "Seminar A.R.T.® III – Autonomous Response Test III",
      "Seminar A.R.T.® Actual (ART IV)",
      "Seminar Blockseminar A.R.T.® I + PK I",
      "Seminar Blockseminar A.R.T.® II + PK II",
    ],
    order: 1,
  },
  {
    slug: "mft",
    title: "MFT – Mental Field Techniques",
    abbreviation: "MFT",
    subtitle: "MENTAL FIELD TECHNIQUES",
    shortDescription:
      "MFT is a non-invasive approach developed by Dr. Dietrich Klinghardt™ that aims to mindfully accompany personal processes, manage acute and chronic pain, emotional stress, and promote one's own well-being.",
    levels: ["MFT I", "MFT II", "MFT III"],
    targetGroup: [
      "Doctors, dentists",
      "Alternative practitioners, psychotherapists",
      "Psychologists",
      "People in training for therapeutic professions",
    ],
    languages: ["German", "English"],
    diploma: "Certificate of attendance per seminar level",
    about: [],
    duringTraining: [],
    curriculum: [],
    footnotes: [],
    examRequirements: [],
    recommendedSeminars: [],
    seminars: [],
    order: 2,
  },
  {
    slug: "pk",
    title: "PK – Psycho-Kinesiology",
    abbreviation: "PK",
    subtitle: "PSYCHO-KINESIOLOGY",
    shortDescription:
      "Psycho-Kinesiology according to Dr. Klinghardt is used to make individual reaction patterns tangible and to accompany processes of self-reflection using dialogue with the subconscious via muscle testing.",
    levels: ["PK I", "PK II", "PK III", "PK IV"],
    targetGroup: [
      "Doctors, dentists",
      "Alternative practitioners, psychotherapists",
      "Psychologists",
      "People in training for therapeutic professions",
    ],
    languages: ["German", "English"],
    diploma: "Certificate of attendance per seminar level",
    about: [],
    duringTraining: [],
    curriculum: [],
    footnotes: [],
    examRequirements: [],
    recommendedSeminars: [],
    seminars: [],
    order: 3,
  },
  {
    slug: "srt",
    title: "SRT – Systemic Regulatory Techniques",
    abbreviation: "SRT",
    subtitle: "SYSTEMIC REGULATORY TECHNIQUES",
    shortDescription:
      "SRT provides practical fundamentals of constellation work, self-awareness and systemic tools, connecting genogram work, regulatory diagnostics and systemic family therapy.",
    levels: ["SRT I", "SRT II"],
    targetGroup: [
      "Doctors, dentists",
      "Alternative practitioners, psychotherapists",
      "Psychologists",
      "People in training for therapeutic professions",
    ],
    languages: ["German", "English"],
    diploma: "Certificate of attendance per seminar level",
    about: [],
    duringTraining: [],
    curriculum: [],
    footnotes: [],
    examRequirements: [],
    recommendedSeminars: [],
    seminars: [],
    order: 4,
  },
  {
    slug: "ank",
    title: "ANK – Master of ANK",
    abbreviation: "ANK",
    subtitle: "MASTER OF ANK",
    shortDescription:
      "The Master of ANK programme represents the highest level of training within the Klinghardt Method, integrating all disciplines into a comprehensive certification for advanced practitioners.",
    levels: ["ANK I", "ANK II", "ANK III"],
    targetGroup: [
      "Practitioners who have completed the A.R.T.® certification",
    ],
    languages: ["German", "English"],
    diploma: "Master of ANK",
    about: [],
    duringTraining: [],
    curriculum: [],
    footnotes: [],
    examRequirements: [],
    recommendedSeminars: [],
    seminars: [],
    order: 5,
  },
];
