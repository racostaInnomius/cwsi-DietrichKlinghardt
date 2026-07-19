export type ContentDoc = Record<string, unknown> & { id?: string | number };

export const demoContent: Record<string, ContentDoc[]> = {
  "page-contents": [
    {
      id: "home-fallback",
      slug: "home",
      title: "Healing Beyond Symptoms",
      bodyText: "For over forty years, Dr. Dietrich Klinghardt has asked the question most medicine skips: not what disease you have, but why you became ill. Answers for patients who have already tried everything.",
    },
    {
      id: "newsletter-fallback",
      slug: "newsletter",
      title: "Klinghardt Newsletter",
      bodyText: "Stay current with upcoming events, clinical research updates, and receive invitations to live webinar hosted each week by Dr. Klinghardt™, and guests.",
    },
  ],
};
