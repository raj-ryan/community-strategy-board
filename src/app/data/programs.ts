// UW graduate programs, grouped by school or college.
//
// The University offers more than 300 graduate programs across its three
// campuses, which is far too many to list as filter chips. This is a
// representative slice of Seattle-campus programs — every program listed here
// has at least one strategy on the board, so no filter ever dead-ends.

export interface ProgramGroup {
  school: string;
  short: string;
  programs: string[];
}

export const PROGRAM_GROUPS: ProgramGroup[] = [
  {
    school: "College of Arts & Sciences",
    short: "Arts & Sciences",
    programs: [
      "Communication (MA)",
      "International Studies (MAIS)",
      "Economics (MA)",
      "Museology (MA)",
      "Drama (MFA)",
    ],
  },
  {
    school: "College of Built Environments",
    short: "Built Environments",
    programs: [
      "Architecture (M.Arch)",
      "Urban Design & Planning (MUP)",
      "Construction Management (MSCM)",
    ],
  },
  {
    school: "College of Education",
    short: "Education",
    programs: ["Education (MEd)"],
  },
  {
    school: "College of Engineering",
    short: "Engineering",
    programs: [
      "Computer Science & Engineering (MS)",
      "Human Centered Design & Engineering (MS)",
      "Electrical & Computer Engineering (MS)",
      "Mechanical Engineering (MS)",
      "Bioengineering (MS)",
    ],
  },
  {
    school: "College of the Environment",
    short: "Environment",
    programs: [
      "Marine & Environmental Affairs (MMA)",
      "Environmental & Forest Sciences (MS)",
    ],
  },
  {
    school: "Foster School of Business",
    short: "Business",
    programs: ["Business Administration (MBA)", "Business Analytics (MSBA)"],
  },
  {
    school: "Information School",
    short: "Information",
    programs: [
      "Information Management (MSIM)",
      "Library & Information Science (MLIS)",
    ],
  },
  {
    school: "School of Law",
    short: "Law",
    programs: ["Law (JD)"],
  },
  {
    school: "School of Medicine",
    short: "Medicine",
    programs: [
      "Biomedical & Health Informatics (MS)",
      "Genetic Counseling (MS)",
    ],
  },
  {
    school: "School of Nursing",
    short: "Nursing",
    programs: ["Nursing (DNP)"],
  },
  {
    school: "School of Pharmacy",
    short: "Pharmacy",
    programs: ["Pharmacy (PharmD)"],
  },
  {
    school: "School of Public Health",
    short: "Public Health",
    programs: ["Public Health (MPH)", "Epidemiology (MPH)"],
  },
  {
    school: "School of Social Work",
    short: "Social Work",
    programs: ["Social Work (MSW)"],
  },
  {
    school: "Evans School of Public Policy & Governance",
    short: "Public Policy",
    programs: ["Public Policy & Governance (MPA)"],
  },
  {
    school: "Interdisciplinary (Graduate School)",
    short: "Interdisciplinary",
    programs: ["Data Science (MSDS)"],
  },
];

export const ALL_PROGRAMS = "All programs";

export const PROGRAMS: string[] = PROGRAM_GROUPS.flatMap(g => g.programs);

export function schoolOf(program: string): string {
  return (
    PROGRAM_GROUPS.find(g => g.programs.includes(program))?.short ?? "Other"
  );
}

// ── Other filter vocabularies ─────────────────────────────────────────────────

export const CHALLENGES = [
  "I keep missing deadlines",
  "I can't find announcements",
  "Readings are everywhere",
  "Too many notifications",
  "Group projects",
  "I don't know how professors communicate",
  "I don't know what to do before classes start",
] as const;

export const COURSE_TYPES = [
  "Seminar",
  "Studio",
  "Project-based",
  "Reading-heavy",
  "Technical",
  "Clinical or fieldwork",
  "Useful across programs",
] as const;
