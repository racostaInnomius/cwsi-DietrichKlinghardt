import { useEffect, useState } from "react";
import type { ContentDoc } from "@/data/demo";
import { useCollection } from "./content";
import { nextWeeklyTalk, overrunCandidate } from "./format";
import { useLiveTalkSession } from "./useLiveTalkSession";

/** Re-evaluate the schedule this often, so a talk's window opens and closes without a reload. */
const CLOCK_TICK_MS = 60_000;

/**
 * nextWeeklyTalk, kept current: re-checked every minute, and past a talk's
 * scheduled end it asks Mux whether that talk is still on air — a talk that
 * runs over keeps the banner (and its "Live Now" badge) until the stream
 * actually ends, instead of jumping to next week's at the scheduled time.
 * One state-only poll per visitor, and only in that overrun window: it stops
 * as soon as the answer is anything but live/reconnecting.
 */
export function useNextWeeklyTalk(): ContentDoc | undefined {
  const events = useCollection("events");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const overrun = overrunCandidate(events, now);
  const overrunId = overrun ? String(overrun.id) : "";
  const [settledId, setSettledId] = useState("");
  const { session, error } = useLiveTalkSession(
    overrunId,
    undefined,
    Boolean(overrunId) && settledId !== overrunId,
    true,
  );
  const mode = session?.mode ?? error?.mode;
  // Until the first answer arrives, assume it's still on: otherwise the
  // banner would flash next week's date for a moment on every page load.
  const pending = settledId !== overrunId && !session && !error;
  const stillLive =
    Boolean(overrunId) && (pending || mode === "live" || mode === "interrupted");

  useEffect(() => {
    if (overrunId && mode && mode !== "live" && mode !== "interrupted") setSettledId(overrunId);
  }, [overrunId, mode]);

  return nextWeeklyTalk(events, now, stillLive ? overrunId : undefined);
}
