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
      title: "Stay informed",
      body: {
        root: {
          type: "root",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children: [
            { type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", text: "Klinghardt® Newsletter", version: 1 }] },
            { type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", text: "Stay current with upcoming events, clinical research updates, and receive invitations to live webinar hosted each week by Dr. Klinghardt®, and guests.", version: 1 }] },
            { type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", text: "By subscribing you agree to receive email communications from the Klinghardt Institute.", version: 1 }] },
            { type: "paragraph", format: "", indent: 0, version: 1, children: [{ type: "text", text: "Your information is never shared.", version: 1 }, { type: "linebreak", version: 1 }, { type: "text", text: "No spam. Unsubscribe at any time.", version: 1 }] },
          ],
        },
      },
    },
  ],
};
