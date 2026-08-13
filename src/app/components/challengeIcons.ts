import {
  CalendarClock,
  Megaphone,
  BookOpen,
  BellRing,
  Users,
  MessagesSquare,
  CalendarCheck,
  Lightbulb,
} from "lucide-react";
import { CHALLENGES } from "../data";

/** One icon per difficulty, shared by the filter chips and the card. */
export const CHALLENGE_ICON: Record<string, typeof CalendarClock> = {
  [CHALLENGES[0]]: CalendarClock,
  [CHALLENGES[1]]: Megaphone,
  [CHALLENGES[2]]: BookOpen,
  [CHALLENGES[3]]: BellRing,
  [CHALLENGES[4]]: Users,
  [CHALLENGES[5]]: MessagesSquare,
  [CHALLENGES[6]]: CalendarCheck,
};

export function iconFor(challenges: string[]) {
  for (const c of challenges) {
    if (CHALLENGE_ICON[c]) return CHALLENGE_ICON[c];
  }
  return Lightbulb;
}
