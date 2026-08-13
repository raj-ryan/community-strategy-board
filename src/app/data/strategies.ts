import { CHALLENGES } from "./programs";

export interface Strategy {
  id: number;
  title: string;
  /** One-sentence answer to "is this useful for me?" */
  benefit: string;
  tags: string[];
  /** Contributor first name, or null when shared anonymously. */
  author: string | null;
  year: string;
  /** Canonical program, used for filtering. */
  program: string;
  relevanceNote: string;
  courseTypes: string[];
  challenges: string[];
  likes: number;
  /** How many students saved this to My Quarter. */
  saves: number;
  tried: number;
  stillUsing: number;
  whyHelps: string;
  steps: string[];
  bestTime: string;
  /** Optional effort estimate, e.g. "30 minutes, once". */
  effort?: string;
  /** Set on strategies submitted through the contribution form this session. */
  pending?: boolean;
}

const DEADLINES = CHALLENGES[0];
const ANNOUNCE = CHALLENGES[1];
const READINGS = CHALLENGES[2];
const NOTIFS = CHALLENGES[3];
const GROUPS = CHALLENGES[4];
const COMMS = CHALLENGES[5];
const PRECLASS = CHALLENGES[6];

const ACROSS = "Useful across programs";

/** Program name without its degree parenthetical, for compact display. */
export function shortProgram(program: string): string {
  return program.replace(/\s*\([^)]*\)\s*$/, "");
}

/** "Shared by Priya · Information Management, Year 2" */
export function contributorLine(s: Strategy): string {
  const who = s.author ? `Shared by ${s.author}` : "Shared anonymously";
  return `${who} · ${shortProgram(s.program)}, ${s.year}`;
}

const RAW: Array<Omit<Strategy, "saves">> = [
  // ── Original four ───────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Check Week 0 and Week 1 tasks early",
    benefit: "Some assignments are due before the first class.",
    tags: ["First week", "Deadlines"],
    author: "Emma",
    year: "Year 2",
    program: "Human Centered Design & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [DEADLINES, ANNOUNCE, COMMS, PRECLASS],
    likes: 48,
    tried: 156,
    stillUsing: 121,
    whyHelps:
      "Students may assume coursework begins after the first class. Instructors may assign introductions, readings, surveys, or software setup before the first meeting.",
    steps: [
      "Open Canvas as soon as the course appears.",
      "Check Modules, Assignments, Announcements, and the syllabus.",
      "Look for anything labeled Week 0, Before class, Getting started, or Required setup.",
    ],
    bestTime:
      "Before the quarter begins, and again two or three days before the first class.",
  },
  {
    id: 2,
    title: "Export the Canvas Calendar",
    benefit: "See assignments beside your meetings and personal commitments.",
    tags: ["Calendar", "Deadlines"],
    author: "James",
    year: "Year 2",
    program: "Computer Science & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS, "Technical"],
    challenges: [DEADLINES, NOTIFS],
    likes: 72,
    tried: 184,
    stillUsing: 149,
    whyHelps:
      "Students may not know that Canvas deadlines can appear automatically in Apple Calendar or Google Calendar.",
    steps: [
      "Open the Calendar page in Canvas.",
      "Copy the Canvas calendar-feed link.",
      "Subscribe to the feed in Apple Calendar or Google Calendar.",
    ],
    bestTime:
      "At the beginning of every quarter, after all courses have appeared in Canvas.",
    effort: "10 minutes, once a quarter",
  },
  {
    id: 3,
    title: "Use office hours before there is a problem",
    benefit: "Clarify expectations, discuss feedback, or test an idea early.",
    tags: ["Communication", "Instructor support"],
    author: "Amina",
    year: "Year 2",
    program: "Public Health (MPH)",
    relevanceNote: "Most useful for seminars and research courses",
    courseTypes: ["Seminar"],
    challenges: [COMMS],
    likes: 39,
    tried: 92,
    stillUsing: 68,
    whyHelps:
      "In some educational cultures, contacting a professor may feel formal or appropriate only when something is wrong. At UW, office hours can also be used for clarification, feedback, or early discussion.",
    steps: [
      "Bring one specific question, draft, or idea.",
      "Briefly explain what you have already checked or attempted.",
      "Ask what a stronger next step would look like.",
    ],
    bestTime:
      "Before a major assignment, after receiving feedback, or when expectations remain unclear.",
  },
  {
    id: 4,
    title: "Protect time for important work",
    benefit: "Not everything important has a deadline or grade.",
    tags: ["Planning", "Weekly habit"],
    author: null,
    year: "Year 2",
    program: "Architecture (M.Arch)",
    relevanceNote: "Studio · Project-based",
    courseTypes: ["Studio", "Project-based"],
    challenges: [DEADLINES, READINGS],
    likes: 35,
    tried: 140,
    stillUsing: 95,
    whyHelps:
      "Readings, software setup, feedback review, office hours, project planning, and relationship-building may not appear in the Canvas To-Do list, making them easy to postpone.",
    steps: [
      "Choose one recurring planning time each week.",
      "Add one or two important but non-urgent tasks to your calendar.",
      "Give each task a specific time rather than leaving it on a general list.",
    ],
    bestTime: "Once per week, ideally at the same time each week.",
  },

  // ── Deadlines ───────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Rewrite every syllabus date into one list",
    benefit: "Six syllabi become one page you can actually scan.",
    tags: ["First week", "Deadlines"],
    author: "Priya",
    year: "Year 2",
    program: "Information Management (MSIM)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [DEADLINES, PRECLASS],
    likes: 61,
    tried: 178,
    stillUsing: 134,
    whyHelps:
      "Dates live in six separate documents, so no single view shows the week that has three things due at once.",
    steps: [
      "Open each syllabus in Week 1.",
      "Copy every graded date into one document.",
      "Mark anything due before a class meeting.",
      "Check the list each Sunday.",
    ],
    bestTime: "Week 1.",
    effort: "30 minutes, once",
  },
  {
    id: 6,
    title: "Set two reminders per assignment, not one",
    benefit: "One reminder to start, one reminder to submit.",
    tags: ["Deadlines", "Notifications"],
    author: "Daniel",
    year: "Year 1",
    program: "Mechanical Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [DEADLINES, NOTIFS],
    likes: 44,
    tried: 132,
    stillUsing: 98,
    whyHelps:
      "A single reminder on the due date tells you the work is late, not that it is time to begin.",
    steps: [
      "In your calendar, add one reminder three days out labeled “start”.",
      "Add a second reminder the morning it is due.",
      "Keep the start reminder even if the work looks small.",
    ],
    bestTime: "When you first see the deadline.",
  },
  {
    id: 7,
    title: "Check the Syllabus tab, not only Modules",
    benefit:
      "Canvas auto-lists every dated item there, even ones hidden in Modules.",
    tags: ["Deadlines", "Canvas"],
    author: "Sofia",
    year: "Year 2",
    program: "Social Work (MSW)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [DEADLINES, ANNOUNCE],
    likes: 38,
    tried: 121,
    stillUsing: 96,
    whyHelps:
      "Instructors build Modules by hand, so an item can carry a due date without ever being linked into a module.",
    steps: [
      "Open a course and click Syllabus.",
      "Scroll to the Course Summary table at the bottom.",
      "Compare it against Modules to spot anything missing.",
    ],
    bestTime: "Week 1, and again at midterms.",
  },
  {
    id: 8,
    title: "Ask how deadline changes get announced",
    benefit: "One question in Week 1 prevents a missed extension later.",
    tags: ["Deadlines", "Communication"],
    author: "Amina",
    year: "Year 2",
    program: "Public Health (MPH)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [DEADLINES, COMMS, ANNOUNCE],
    likes: 52,
    tried: 140,
    stillUsing: 118,
    whyHelps:
      "Extensions and date changes are announced wherever the instructor prefers, and that channel is rarely written down.",
    steps: [
      "Ask after the first class: “If a due date changes, where will you post it?”",
      "Write the answer next to that course in your notes.",
      "Check that channel first for the rest of the quarter.",
    ],
    bestTime: "Week 1, right after the first class meeting.",
  },

  // ── Announcements ───────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Turn on instant announcement alerts",
    benefit:
      "Canvas defaults to a daily digest, which is too slow for a date change.",
    tags: ["Announcements", "Notifications"],
    author: "Mei",
    year: "Year 2",
    program: "Computer Science & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS, "Technical"],
    challenges: [ANNOUNCE, NOTIFS, PRECLASS],
    likes: 67,
    tried: 190,
    stillUsing: 161,
    whyHelps:
      "A digest that arrives the next morning can reach you after the class it was meant to change.",
    steps: [
      "Go to Account, then Notifications.",
      "Find Announcement and set it to Notify immediately.",
      "Leave everything else on daily.",
    ],
    bestTime: "Before the quarter starts.",
    effort: "2 minutes",
  },
  {
    id: 10,
    title: "Note where each course actually posts updates",
    benefit: "Some instructors never use Announcements at all.",
    tags: ["Announcements", "First week"],
    author: "Emma",
    year: "Year 2",
    program: "Human Centered Design & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [ANNOUNCE, COMMS],
    likes: 41,
    tried: 128,
    stillUsing: 103,
    whyHelps:
      "Checking the Announcements page of a course that never uses it teaches you nothing, and hides the page that does.",
    steps: [
      "In Week 1, check each course’s Announcements, Home page, and your email.",
      "Write down which one the instructor is really using.",
      "Ignore the empty ones.",
    ],
    bestTime: "Week 1.",
  },
  {
    id: 11,
    title: "Make Announcements your course home page",
    benefit: "The updates load first instead of being one click away.",
    tags: ["Announcements", "Canvas"],
    author: "Tobias",
    year: "Year 2",
    program: "Architecture (M.Arch)",
    relevanceNote: "Studio · Project-based",
    courseTypes: ["Studio", "Project-based"],
    challenges: [ANNOUNCE],
    likes: 29,
    tried: 94,
    stillUsing: 71,
    whyHelps:
      "Anything one click away gets checked less often, especially in a week that is already full.",
    steps: [
      "If your course allows it, use the Recent Announcements view on the course home page.",
      "Otherwise bookmark the Announcements URL directly for each course.",
    ],
    bestTime: "Week 1, while you are setting up each course.",
  },
  {
    id: 12,
    title: "Search your inbox for “Canvas” once a week",
    benefit: "Announcements you missed are already sitting in your email.",
    tags: ["Announcements", "Email"],
    author: "Grace",
    year: "Year 1",
    program: "Public Health (MPH)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [ANNOUNCE, NOTIFS],
    likes: 33,
    tried: 110,
    stillUsing: 79,
    whyHelps:
      "Canvas emails every announcement, so the ones you scrolled past are recoverable without opening each course.",
    steps: [
      "Search your student inbox for the course code or “Canvas”.",
      "Sort by date.",
      "Skim anything from the past week.",
    ],
    bestTime: "Sunday evening.",
    effort: "5 minutes weekly",
  },

  // ── Readings ────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: "Download the whole quarter’s readings in Week 1",
    benefit: "Links break and files disappear more often than you would expect.",
    tags: ["Readings", "First week"],
    author: "Yuki",
    year: "Year 2",
    program: "Social Work (MSW)",
    relevanceNote: "Reading-heavy",
    courseTypes: ["Reading-heavy"],
    challenges: [READINGS, PRECLASS],
    likes: 58,
    tried: 165,
    stillUsing: 122,
    whyHelps:
      "Library links expire, files get replaced, and the reading you need is often unavailable the night before it is due.",
    steps: [
      "Open Files and Modules for each course.",
      "Download everything available.",
      "Save into one folder per course, named by week.",
    ],
    bestTime: "The weekend before classes.",
  },
  {
    id: 14,
    title: "One folder per course, named by week",
    benefit: "You stop searching for the reading and start doing it.",
    tags: ["Readings", "Organization"],
    author: "Luis",
    year: "Year 1",
    program: "Information Management (MSIM)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [READINGS],
    likes: 47,
    tried: 151,
    stillUsing: 118,
    whyHelps:
      "Downloads folders mix six courses together, so finding the file becomes its own task before any reading happens.",
    steps: [
      "Create folders W1, W2, W3 and so on inside each course folder.",
      "Move each reading in as it is posted.",
      "Keep the instructor’s original filename so you can search it later.",
    ],
    bestTime: "Week 1, then whenever a file is posted.",
  },
  {
    id: 15,
    title: "Check Files when Modules looks empty",
    benefit: "Materials are often uploaded before they are linked into a module.",
    tags: ["Readings", "Canvas"],
    author: "Nadia",
    year: "Year 2",
    program: "Human Centered Design & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [READINGS, ANNOUNCE],
    likes: 36,
    tried: 118,
    stillUsing: 89,
    whyHelps:
      "Uploading a file and linking it into a module are two separate steps, and the second one is easy to forget.",
    steps: [
      "Open the course and click Files in the left menu.",
      "Sort by date added.",
      "Look for anything not yet visible in Modules.",
    ],
    bestTime: "The day before class.",
  },
  {
    id: 16,
    title: "Ask which readings are required and which are optional",
    benefit:
      "Reading-heavy courses often list more than anyone expects you to finish.",
    tags: ["Readings", "Workload"],
    author: null,
    year: "Year 2",
    program: "Epidemiology (MPH)",
    relevanceNote: "Reading-heavy · Seminar",
    courseTypes: ["Reading-heavy", "Seminar"],
    challenges: [READINGS, COMMS],
    likes: 72,
    tried: 186,
    stillUsing: 155,
    whyHelps:
      "A long reading list is often a menu rather than a requirement, but the syllabus rarely says which is which.",
    steps: [
      "Ask in class or office hours: “Which of these should I prioritize if I am short on time?”",
      "Mark the answer on your reading list.",
      "Most instructors will tell you directly.",
    ],
    bestTime: "In the first two weeks, before the reading load peaks.",
  },

  // ── Notifications ───────────────────────────────────────────────────────────
  {
    id: 17,
    title: "Switch everything to a daily summary except grades and announcements",
    benefit: "Fewer alerts, and the important two still arrive on time.",
    tags: ["Notifications", "Setup"],
    author: "Daniel",
    year: "Year 1",
    program: "Mechanical Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [NOTIFS, PRECLASS],
    likes: 64,
    tried: 172,
    stillUsing: 141,
    whyHelps:
      "Canvas notifies at one volume for everything, so genuinely urgent messages arrive looking exactly like routine ones.",
    steps: [
      "Go to Account, then Notifications.",
      "Set Announcement and Grading to immediate.",
      "Set discussions, conversations, and files to daily summary.",
      "Turn off submission confirmations.",
    ],
    bestTime: "Before the quarter starts.",
    effort: "5 minutes, once",
  },
  {
    id: 18,
    title: "Send all Canvas email to one folder",
    benefit: "Course mail stops burying the messages you actually need to answer.",
    tags: ["Notifications", "Email"],
    author: "Mei",
    year: "Year 2",
    program: "Computer Science & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS, "Technical"],
    challenges: [NOTIFS, ANNOUNCE],
    likes: 49,
    tried: 143,
    stillUsing: 112,
    whyHelps:
      "Course notifications and messages from people share one inbox, and the automated ones always outnumber the human ones.",
    steps: [
      "Create a filter in your student email for messages from instructure.com.",
      "Label it “Courses”.",
      "Skip the inbox but keep it unread, and check it once a day.",
    ],
    bestTime: "Week 1.",
  },
  {
    id: 19,
    title: "Turn off discussion replies, keep mentions on",
    benefit: "Reading-heavy seminars can generate 40 posts a week.",
    tags: ["Notifications", "Discussion"],
    author: "Sofia",
    year: "Year 2",
    program: "Social Work (MSW)",
    relevanceNote: "Seminar · Reading-heavy",
    courseTypes: ["Seminar", "Reading-heavy"],
    challenges: [NOTIFS, READINGS],
    likes: 31,
    tried: 102,
    stillUsing: 78,
    whyHelps:
      "Required weekly posts mean every classmate generates alerts, but only replies addressed to you need an answer.",
    steps: [
      "Go to Account, then Notifications.",
      "Set Discussion to off or weekly.",
      "Keep conversation message on so direct replies still come through.",
    ],
    bestTime: "After the first discussion assignment.",
  },
  {
    id: 20,
    title: "Decide which single channel means urgent",
    benefit: "When everything notifies you, nothing does.",
    tags: ["Notifications", "Focus"],
    author: "Priya",
    year: "Year 2",
    program: "Information Management (MSIM)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [NOTIFS],
    likes: 40,
    tried: 124,
    stillUsing: 101,
    whyHelps:
      "Courses arrive through Canvas, email, Slack, and group chats at once, so no channel carries a reliable signal.",
    steps: [
      "Pick one channel, usually email, and let it be the only one that pings your phone.",
      "Mute the rest.",
      "Check the muted ones on a schedule instead.",
    ],
    bestTime: "Week 1, and again if a new group chat appears.",
  },

  // ── Group work ──────────────────────────────────────────────────────────────
  {
    id: 21,
    title: "Pick one channel in the first meeting",
    benefit: "Half of group confusion is three conversations in three apps.",
    tags: ["Group work", "First meeting"],
    author: "Tobias",
    year: "Year 2",
    program: "Architecture (M.Arch)",
    relevanceNote: "Project-based · Studio",
    courseTypes: ["Project-based", "Studio"],
    challenges: [GROUPS],
    likes: 55,
    tried: 158,
    stillUsing: 129,
    whyHelps:
      "Decisions made in a thread nobody else reads have to be made again, usually the week the work is due.",
    steps: [
      "In meeting one, agree on where you will talk and where files live.",
      "Write it in the group’s Canvas page or shared doc.",
      "Do not start a second thread elsewhere.",
    ],
    bestTime: "The first group meeting.",
  },
  {
    id: 22,
    title: "Write who does what where everyone can see it",
    benefit: "Verbal agreements do not survive week four.",
    tags: ["Group work", "Planning"],
    author: "Grace",
    year: "Year 1",
    program: "Public Health (MPH)",
    relevanceNote: "Project-based",
    courseTypes: ["Project-based"],
    challenges: [GROUPS],
    likes: 43,
    tried: 137,
    stillUsing: 104,
    whyHelps:
      "Everyone leaves a meeting remembering a slightly different version of what they agreed to.",
    steps: [
      "Make a shared doc with three columns: task, person, date.",
      "Fill it in at the end of every meeting.",
      "Review it at the start of the next one.",
    ],
    bestTime: "Every group meeting.",
    effort: "5 minutes per meeting",
  },
  {
    id: 23,
    title: "Set the group deadline two days before the real one",
    benefit:
      "Leaves room for the file that will not open, or the teammate who goes quiet.",
    tags: ["Group work", "Deadlines"],
    author: "Luis",
    year: "Year 1",
    program: "Information Management (MSIM)",
    relevanceNote: "Project-based · Technical",
    courseTypes: ["Project-based", "Technical"],
    challenges: [GROUPS, DEADLINES],
    likes: 60,
    tried: 168,
    stillUsing: 138,
    whyHelps:
      "Group work fails at the assembly stage, and assembly always takes longer than the last person expects.",
    steps: [
      "When you get the assignment, set the internal date first.",
      "Put both dates in the shared doc.",
      "Treat the internal one as the real one.",
    ],
    bestTime: "The day the assignment is released.",
  },
  {
    id: 24,
    title: "Say your time zone and working hours in the first message",
    benefit: "Saves a week of missed replies if anyone is remote or traveling.",
    tags: ["Group work", "International students"],
    author: "Yuki",
    year: "Year 2",
    program: "Social Work (MSW)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [GROUPS, COMMS],
    likes: 37,
    tried: 115,
    stillUsing: 94,
    whyHelps:
      "Silence reads as disengagement when it is often just a different time zone or a different working rhythm.",
    steps: [
      "Post your time zone, the hours you are usually free, and your response time.",
      "Ask everyone to do the same.",
      "Schedule around the overlap rather than assuming it.",
    ],
    bestTime: "The first message to the group.",
  },

  // ── Communication ───────────────────────────────────────────────────────────
  {
    id: 25,
    title: "Read the syllabus communication section before anything else",
    benefit: "It usually says exactly where feedback and changes will appear.",
    tags: ["Communication", "First week"],
    author: "Emma",
    year: "Year 2",
    program: "Human Centered Design & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [COMMS, ANNOUNCE, PRECLASS],
    likes: 50,
    tried: 149,
    stillUsing: 121,
    whyHelps:
      "The section that explains how the course will actually run is usually two paragraphs, and usually skipped.",
    steps: [
      "Find the section on contact, response time, and grading.",
      "Note the response window so you know when to follow up.",
      "Skip the rest of the syllabus until later.",
    ],
    bestTime: "Week 1, before the first assignment.",
  },
  {
    id: 26,
    title: "Check Canvas feedback every Friday",
    benefit: "Resubmission requests are often left as a comment, not an email.",
    tags: ["Communication", "Feedback"],
    author: "Ana",
    year: "Year 1",
    program: "Public Health (MPH)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS],
    challenges: [COMMS, ANNOUNCE],
    likes: 45,
    tried: 129,
    stillUsing: 108,
    whyHelps:
      "Rubric notes and submission comments do not always trigger a notification, so useful feedback sits unread.",
    steps: [
      "Open Grades and click each graded item.",
      "Look for the comment icon and any rubric notes.",
      "Act on anything asking for a resubmission that week.",
    ],
    bestTime: "Every Friday.",
    effort: "10 minutes weekly",
  },
  {
    id: 27,
    title: "Ask one small question in Week 1",
    benefit:
      "You learn the instructor’s real response time before you need it urgently.",
    tags: ["Communication", "Instructor support"],
    author: "Amina",
    year: "Year 2",
    program: "Public Health (MPH)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS, "Seminar"],
    challenges: [COMMS],
    likes: 39,
    tried: 120,
    stillUsing: 97,
    whyHelps:
      "The first message you send should not be the one you need answered before tomorrow morning.",
    steps: [
      "Send one short, specific question early in the quarter.",
      "Note how long the reply takes and which channel it comes through.",
      "Plan later questions around that.",
    ],
    bestTime: "Week 1.",
  },
  {
    id: 28,
    title: "Ask what a good submission looks like in this program",
    benefit: "Expectations differ by country, program, and instructor.",
    tags: ["Communication", "Expectations"],
    author: null,
    year: "Year 1",
    program: "Computer Science & Engineering (MS)",
    relevanceNote: ACROSS,
    courseTypes: [ACROSS, "Technical"],
    challenges: [COMMS],
    likes: 68,
    tried: 174,
    stillUsing: 149,
    whyHelps:
      "Grading conventions are learned rather than published, and students who studied elsewhere are asked to infer them.",
    steps: [
      "In office hours, ask to see a strong past example, or what distinguishes an A from a B.",
      "Take notes on the specifics, not the general advice.",
      "Apply it to the next assignment.",
    ],
    bestTime: "Before the first major assignment.",
  },

  // ── Arts & Sciences ─────────────────────────────────────────────────────────
  {
    id: 29,
    title: "Bring three written questions to every seminar",
    benefit: "Participation grades reward preparation, not confidence.",
    tags: ["Seminar", "Participation"],
    author: "Hana",
    year: "Year 1",
    program: "Communication (MA)",
    relevanceNote: "Seminar · Reading-heavy",
    courseTypes: ["Seminar", "Reading-heavy"],
    challenges: [READINGS, COMMS],
    likes: 54,
    tried: 147,
    stillUsing: 118,
    whyHelps:
      "Seminar discussion moves quickly in a second language, and prepared questions let you enter it at a moment you chose rather than one you did not.",
    steps: [
      "While reading, write one question about method, one about evidence, and one about application.",
      "Bring them on paper or on your laptop.",
      "Use one in the first twenty minutes, before the discussion narrows.",
    ],
    bestTime: "Before every seminar meeting.",
    effort: "10 minutes per reading",
  },
  {
    id: 30,
    title: "Confirm the citation style before the first paper",
    benefit: "Style expectations differ between departments and even instructors.",
    tags: ["Expectations", "Writing"],
    author: "Ibrahim",
    year: "Year 2",
    program: "International Studies (MAIS)",
    relevanceNote: "Seminar · Reading-heavy",
    courseTypes: ["Seminar", "Reading-heavy"],
    challenges: [COMMS, PRECLASS],
    likes: 33,
    tried: 104,
    stillUsing: 82,
    whyHelps:
      "Points are quietly lost to formatting rules that were never stated, especially where regional sources need transliteration or translation notes.",
    steps: [
      "Check the syllabus for a style guide, then ask if it is not stated.",
      "Ask specifically how to cite sources in another language.",
      "Set that style in your reference manager before you start writing.",
    ],
    bestTime: "Before the first written assignment.",
  },
  {
    id: 31,
    title: "Do the problem set during the TA session, not after it",
    benefit: "You get unstuck in ten minutes instead of three hours.",
    tags: ["Problem sets", "Instructor support"],
    author: "Wei",
    year: "Year 1",
    program: "Economics (MA)",
    relevanceNote: "Technical",
    courseTypes: ["Technical"],
    challenges: [DEADLINES, COMMS],
    likes: 62,
    tried: 158,
    stillUsing: 131,
    whyHelps:
      "Attempting the set beforehand and finishing it later wastes the one hour where an expert is in the room with you.",
    steps: [
      "Read the problem set the day it is posted and attempt the first question.",
      "Bring the parts you could not finish to the TA session and work them there.",
      "Ask about method rather than the answer, so the next set is easier.",
    ],
    bestTime: "Every week the set is assigned.",
  },
  {
    id: 32,
    title: "Put collection and site visit hours in the same calendar as deadlines",
    benefit: "Access hours are limited and do not move for your schedule.",
    tags: ["Calendar", "Fieldwork"],
    author: "Clara",
    year: "Year 2",
    program: "Museology (MA)",
    relevanceNote: "Project-based · Fieldwork",
    courseTypes: ["Project-based", "Clinical or fieldwork"],
    challenges: [DEADLINES, GROUPS],
    likes: 28,
    tried: 86,
    stillUsing: 68,
    whyHelps:
      "Coursework deadlines are flexible in ways that a collection appointment or an institution's opening hours are not.",
    steps: [
      "Add every visit, appointment, and access window to your main calendar.",
      "Work backward from the last possible visit date for each project.",
      "Book the appointment before you plan the writing.",
    ],
    bestTime: "As soon as a project with site access is assigned.",
  },
  {
    id: 33,
    title: "Get the production calendar before the syllabus",
    benefit: "Rehearsal and build calls will decide your quarter, not the readings.",
    tags: ["Studio", "Calendar"],
    author: "Marcus",
    year: "Year 1",
    program: "Drama (MFA)",
    relevanceNote: "Studio · Project-based",
    courseTypes: ["Studio", "Project-based"],
    challenges: [DEADLINES, PRECLASS],
    likes: 31,
    tried: 79,
    stillUsing: 64,
    whyHelps:
      "Production commitments are scheduled outside Canvas and regularly collide with coursework that was planned without them.",
    steps: [
      "Ask the production office for the full calendar before the quarter starts.",
      "Put tech weeks and opening nights in your calendar first.",
      "Tell instructors early which weeks are heaviest, so extensions are a conversation and not an emergency.",
    ],
    bestTime: "The week before classes begin.",
  },

  // ── Built Environments ──────────────────────────────────────────────────────
  {
    id: 34,
    title: "Ask what “pin-up ready” means in this studio",
    benefit: "The standard for a review is set by the instructor, not the syllabus.",
    tags: ["Studio", "Expectations"],
    author: "Ngozi",
    year: "Year 1",
    program: "Urban Design & Planning (MUP)",
    relevanceNote: "Studio · Project-based",
    courseTypes: ["Studio", "Project-based"],
    challenges: [COMMS, GROUPS],
    likes: 47,
    tried: 121,
    stillUsing: 99,
    whyHelps:
      "Students who did their first degree elsewhere often arrive at a review with the wrong drawing set, at the wrong scale, printed the wrong size.",
    steps: [
      "Before the first review, ask what should be on the wall and at what scale.",
      "Ask to see photographs of a strong review from a previous year.",
      "Write the answer down and reuse it for every review that quarter.",
    ],
    bestTime: "At least a week before the first pin-up.",
  },
  {
    id: 35,
    title: "Install and license the software in Week 0",
    benefit: "Student licences can take days to approve, and labs have queues.",
    tags: ["Setup", "First week"],
    author: "Diego",
    year: "Year 1",
    program: "Construction Management (MSCM)",
    relevanceNote: "Technical · Project-based",
    courseTypes: ["Technical", "Project-based"],
    challenges: [PRECLASS, DEADLINES],
    likes: 41,
    tried: 118,
    stillUsing: 96,
    whyHelps:
      "The first assignment often assumes working software, and licence approval is handled by a department that does not know your deadline.",
    steps: [
      "Check the syllabus and course site for required software before the quarter starts.",
      "Request licences and lab access in the same week.",
      "Open each program once and export a test file before class begins.",
    ],
    bestTime: "The week before classes begin.",
    effort: "1 hour, once",
  },

  // ── Education ───────────────────────────────────────────────────────────────
  {
    id: 36,
    title: "Confirm fieldwork hours before you plan the quarter",
    benefit: "Placement hours are fixed; your coursework schedule is not.",
    tags: ["Fieldwork", "Calendar"],
    author: "Rosa",
    year: "Year 1",
    program: "Education (MEd)",
    relevanceNote: "Fieldwork · Project-based",
    courseTypes: ["Clinical or fieldwork", "Project-based"],
    challenges: [DEADLINES, PRECLASS],
    likes: 35,
    tried: 97,
    stillUsing: 79,
    whyHelps:
      "School calendars and University calendars do not align, so placement days fall on weeks that already have coursework due.",
    steps: [
      "Get your placement schedule and the school district calendar in the same week.",
      "Block those days out completely before adding anything else.",
      "Flag collisions to instructors in the first two weeks, not the night before.",
    ],
    bestTime: "As soon as placement is confirmed.",
  },

  // ── Engineering ─────────────────────────────────────────────────────────────
  {
    id: 37,
    title: "Read the lab rubric before the lab, not after",
    benefit: "Most lost marks are for data you did not record while you were there.",
    tags: ["Labs", "Expectations"],
    author: "Sanjay",
    year: "Year 1",
    program: "Electrical & Computer Engineering (MS)",
    relevanceNote: "Technical",
    courseTypes: ["Technical"],
    challenges: [COMMS, DEADLINES],
    likes: 57,
    tried: 141,
    stillUsing: 117,
    whyHelps:
      "Lab reports are graded on measurements, uncertainty, and observations that cannot be reconstructed once you have left the bench.",
    steps: [
      "Open the report rubric before the session and list what it asks you to record.",
      "Photograph your setup and note instrument settings while you work.",
      "Write the results section the same day, while the session is still clear.",
    ],
    bestTime: "Before every lab session.",
  },
  {
    id: 38,
    title: "Ask your adviser how lab meetings and coursework interact",
    benefit: "Research hours are assumed, not scheduled, and they will fill the gaps.",
    tags: ["Research", "Expectations"],
    author: "Farah",
    year: "Year 2",
    program: "Bioengineering (MS)",
    relevanceNote: "Technical · Research",
    courseTypes: ["Technical", "Project-based"],
    challenges: [COMMS, DEADLINES],
    likes: 49,
    tried: 112,
    stillUsing: 93,
    whyHelps:
      "Nobody holds both halves of your schedule, so the coursework and the lab each assume they have your remaining time.",
    steps: [
      "In your first meeting, show your course schedule and ask what hours the lab expects.",
      "Agree which weeks are coursework-heavy before those weeks arrive.",
      "Repeat the conversation at midterms rather than waiting for a conflict.",
    ],
    bestTime: "The first adviser meeting of each quarter.",
  },

  // ── Environment ─────────────────────────────────────────────────────────────
  {
    id: 39,
    title: "Check whether field days replace or add to class meetings",
    benefit: "A field day is often announced by email, not in Canvas.",
    tags: ["Fieldwork", "Announcements"],
    author: "Kofi",
    year: "Year 1",
    program: "Marine & Environmental Affairs (MMA)",
    relevanceNote: "Fieldwork · Seminar",
    courseTypes: ["Clinical or fieldwork", "Seminar"],
    challenges: [ANNOUNCE, DEADLINES],
    likes: 26,
    tried: 74,
    stillUsing: 58,
    whyHelps:
      "Field logistics are usually arranged by a coordinator outside the course site, so the details never reach the Canvas calendar.",
    steps: [
      "Ask in Week 1 who sends field logistics and on which channel.",
      "Confirm whether the field day replaces the lecture or is added to it.",
      "Add travel time and gear pickup to your calendar as separate entries.",
    ],
    bestTime: "Week 1, and again before each field date.",
  },
  {
    id: 40,
    title: "Download protocols and maps before you lose signal",
    benefit: "The one document you need is always the one that will not load in the field.",
    tags: ["Fieldwork", "Readings"],
    author: "Elin",
    year: "Year 2",
    program: "Environmental & Forest Sciences (MS)",
    relevanceNote: "Fieldwork · Technical",
    courseTypes: ["Clinical or fieldwork", "Technical"],
    challenges: [READINGS, PRECLASS],
    likes: 30,
    tried: 81,
    stillUsing: 69,
    whyHelps:
      "Field sites have no reliable connection, and a protocol you can only open online is a protocol you do not have.",
    steps: [
      "Download protocols, datasheets, and offline maps the night before.",
      "Keep a printed copy of anything you must record by hand.",
      "Save to a folder that syncs so the data reaches your laptop that evening.",
    ],
    bestTime: "The night before every field day.",
  },

  // ── Business ────────────────────────────────────────────────────────────────
  {
    id: 41,
    title: "Book team meetings for the whole quarter in Week 1",
    benefit: "Finding a shared hour in Week 6 is harder than doing the work.",
    tags: ["Group work", "Calendar"],
    author: "Olivia",
    year: "Year 1",
    program: "Business Administration (MBA)",
    relevanceNote: "Project-based",
    courseTypes: ["Project-based"],
    challenges: [GROUPS, DEADLINES],
    likes: 66,
    tried: 163,
    stillUsing: 138,
    whyHelps:
      "Cohort schedules fill with recruiting, clubs, and other teams, so the scarce resource is not effort but overlapping availability.",
    steps: [
      "In the first team meeting, book a recurring slot for the entire quarter.",
      "Send calendar invitations immediately rather than agreeing verbally.",
      "Keep the slot even in light weeks, and cancel it only when the work is genuinely done.",
    ],
    bestTime: "The first team meeting.",
  },
  {
    id: 42,
    title: "Get database and tool access approved in Week 0",
    benefit: "Access requests are processed on someone else's timeline.",
    tags: ["Setup", "Technical"],
    author: "Ravi",
    year: "Year 1",
    program: "Business Analytics (MSBA)",
    relevanceNote: "Technical · Project-based",
    courseTypes: ["Technical", "Project-based"],
    challenges: [PRECLASS, DEADLINES],
    likes: 38,
    tried: 102,
    stillUsing: 87,
    whyHelps:
      "Courses that use licensed data assume access is instant, but approvals can take several working days and are not chased for you.",
    steps: [
      "List every tool and dataset named in the syllabus before the quarter starts.",
      "Request access for all of them on the same day.",
      "Log in once to confirm each one works before the first assignment.",
    ],
    bestTime: "The week before classes begin.",
  },

  // ── Information School ─────────────────────────────────────────────────────
  {
    id: 43,
    title: "Build the citation library while you read, not at the end",
    benefit: "Two hours across the quarter instead of one night before submission.",
    tags: ["Readings", "Writing"],
    author: "Sara",
    year: "Year 1",
    program: "Library & Information Science (MLIS)",
    relevanceNote: "Reading-heavy · Seminar",
    courseTypes: ["Reading-heavy", "Seminar"],
    challenges: [READINGS, DEADLINES],
    likes: 44,
    tried: 126,
    stillUsing: 108,
    whyHelps:
      "Rebuilding a bibliography from a folder of PDFs at the end of the quarter takes longer than capturing each item as you read it.",
    steps: [
      "Set up Zotero or your reference manager in Week 1 with a folder per course.",
      "Save each reading with one click as you open it, tags included.",
      "Write a one-line note about why the source matters while it is fresh.",
    ],
    bestTime: "Week 1, then continuously.",
    effort: "2 minutes per reading",
  },

  // ── Law ─────────────────────────────────────────────────────────────────────
  {
    id: 44,
    title: "Brief cases in one fixed template from the first week",
    benefit: "A consistent format makes exam outlining almost automatic.",
    tags: ["Readings", "Organization"],
    author: "Thomas",
    year: "Year 1",
    program: "Law (JD)",
    relevanceNote: "Reading-heavy · Seminar",
    courseTypes: ["Reading-heavy", "Seminar"],
    challenges: [READINGS, DEADLINES],
    likes: 59,
    tried: 134,
    stillUsing: 115,
    whyHelps:
      "Reading volume is high and cold calls are unpredictable, so notes need a shape you can search under pressure.",
    steps: [
      "Use the same headings for every case: facts, issue, holding, reasoning, why it was assigned.",
      "Keep briefs in one file per course so the whole quarter is searchable.",
      "Review the week's briefs before class rather than rereading the cases.",
    ],
    bestTime: "From the first assigned reading.",
  },

  // ── Medicine ────────────────────────────────────────────────────────────────
  {
    id: 45,
    title: "Ask which datasets need approval before you plan the project",
    benefit: "Data access can take longer than the analysis itself.",
    tags: ["Research", "Deadlines"],
    author: "Priyanka",
    year: "Year 2",
    program: "Biomedical & Health Informatics (MS)",
    relevanceNote: "Technical · Project-based",
    courseTypes: ["Technical", "Project-based"],
    challenges: [DEADLINES, COMMS],
    likes: 34,
    tried: 88,
    stillUsing: 76,
    whyHelps:
      "Health data usually requires training certificates, an approval, or a data use agreement, and none of those are fast.",
    steps: [
      "Ask on day one which datasets the project needs and what approval each requires.",
      "Complete required training in the first two weeks, before you need the data.",
      "Have a smaller public dataset ready as a fallback for the analysis plan.",
    ],
    bestTime: "The first week of the project course.",
  },
  {
    id: 46,
    title: "Log clinical hours the same week they happen",
    benefit: "Reconstructing a log at the deadline is guesswork you will be graded on.",
    tags: ["Clinical", "Deadlines"],
    author: "Meredith",
    year: "Year 2",
    program: "Genetic Counseling (MS)",
    relevanceNote: "Clinical · Fieldwork",
    courseTypes: ["Clinical or fieldwork"],
    challenges: [DEADLINES, NOTIFS],
    likes: 27,
    tried: 71,
    stillUsing: 61,
    whyHelps:
      "Case logs are a graded requirement with a specific format, and details blur within days of the encounter.",
    steps: [
      "Enter each case the same day, even if only in note form.",
      "Set one recurring reminder for Friday to complete anything unfinished.",
      "Check the required fields once at the start so you record them from the beginning.",
    ],
    bestTime: "The day of each clinical encounter.",
    effort: "5 minutes per case",
  },

  // ── Nursing ─────────────────────────────────────────────────────────────────
  {
    id: 47,
    title: "Find where clinical placements are posted, and it is not Canvas",
    benefit: "Placement changes arrive through a separate system with its own alerts.",
    tags: ["Clinical", "Announcements"],
    author: "Beatrice",
    year: "Year 1",
    program: "Nursing (DNP)",
    relevanceNote: "Clinical · Fieldwork",
    courseTypes: ["Clinical or fieldwork"],
    challenges: [ANNOUNCE, NOTIFS],
    likes: 32,
    tried: 84,
    stillUsing: 72,
    whyHelps:
      "Clinical scheduling is coordinated outside course sites, so a placement can change without any Canvas notification at all.",
    steps: [
      "In Week 1, ask the clinical coordinator which system carries placement changes.",
      "Turn on alerts in that system and add the coordinator to your contacts.",
      "Check it on a fixed day each week, in addition to Canvas.",
    ],
    bestTime: "Week 1, before rotations begin.",
  },

  // ── Pharmacy ────────────────────────────────────────────────────────────────
  {
    id: 48,
    title: "Sync the block schedule before the block starts",
    benefit: "Block courses compress a quarter of deadlines into a few weeks.",
    tags: ["Calendar", "Deadlines"],
    author: "Jonas",
    year: "Year 1",
    program: "Pharmacy (PharmD)",
    relevanceNote: "Clinical · Technical",
    courseTypes: ["Clinical or fieldwork", "Technical"],
    challenges: [DEADLINES, PRECLASS],
    likes: 36,
    tried: 93,
    stillUsing: 78,
    whyHelps:
      "In a block curriculum the pace changes every few weeks, and a plan built for the last block quietly fails in the next one.",
    steps: [
      "Put the whole block calendar into one view before it begins.",
      "Mark the assessment days first, then work backwards for study time.",
      "Re-plan on the first day of each new block rather than continuing the old rhythm.",
    ],
    bestTime: "The weekend before each block.",
  },

  // ── Public Health ───────────────────────────────────────────────────────────
  {
    id: 49,
    title: "Confirm which statistical software will be graded",
    benefit: "Courses in the same program do not always use the same tool.",
    tags: ["Technical", "Setup"],
    author: "Tomás",
    year: "Year 1",
    program: "Epidemiology (MPH)",
    relevanceNote: "Technical",
    courseTypes: ["Technical"],
    challenges: [PRECLASS, COMMS],
    likes: 43,
    tried: 109,
    stillUsing: 91,
    whyHelps:
      "Submitting correct analysis in the wrong software costs marks, and licences for the right one are not always immediate.",
    steps: [
      "Check the syllabus for the required software and version, and ask if it is not stated.",
      "Install it and run the sample script before the first assignment.",
      "Ask whether output must be submitted as code, a log, or a knitted document.",
    ],
    bestTime: "Before the first assignment.",
  },

  // ── Evans School ────────────────────────────────────────────────────────────
  {
    id: 50,
    title: "Ask how policy memos are graded before writing one",
    benefit: "Memo conventions are specific and are rarely taught explicitly.",
    tags: ["Writing", "Expectations"],
    author: "Aisha",
    year: "Year 1",
    program: "Public Policy & Governance (MPA)",
    relevanceNote: "Seminar · Writing-heavy",
    courseTypes: ["Seminar", "Project-based"],
    challenges: [COMMS, READINGS],
    likes: 51,
    tried: 128,
    stillUsing: 109,
    whyHelps:
      "A memo is judged on structure, brevity, and a recommendation stated up front, which is the opposite of the academic essay many students trained on.",
    steps: [
      "Ask for a strong past memo, or find the template in the course files.",
      "Confirm the expected length, and whether the recommendation goes first.",
      "Write the recommendation sentence before the analysis, then edit to fit the limit.",
    ],
    bestTime: "Before the first memo is due.",
  },

  // ── Interdisciplinary ───────────────────────────────────────────────────────
  {
    id: 51,
    title: "Set up the compute environment before the first lab",
    benefit: "The first session assumes your environment already runs.",
    tags: ["Setup", "Technical"],
    author: "Chen",
    year: "Year 1",
    program: "Data Science (MSDS)",
    relevanceNote: "Technical · Project-based",
    courseTypes: ["Technical", "Project-based"],
    challenges: [PRECLASS, DEADLINES],
    likes: 55,
    tried: 137,
    stillUsing: 116,
    whyHelps:
      "Environment problems are the most common reason a first assignment is late, and they are much easier to solve before everyone is asking at once.",
    steps: [
      "Install the required environment and packages from the course setup page.",
      "Run the provided test notebook end to end.",
      "Post any error in the course channel early, when the answer is still useful to everyone.",
    ],
    bestTime: "The week before classes begin.",
    effort: "1 hour, once",
  },
];

// Save counts are seeded rather than authored per card: a strategy people kept
// using is one more of them bookmarked it first. Derived deterministically so
// every usability-test participant sees the same numbers.
export const STRATEGIES: Strategy[] = RAW.map(s => ({
  ...s,
  saves: Math.round(s.stillUsing * 0.38) + ((s.id * 7) % 11),
}));

export const STRATEGY_BY_ID = new Map(STRATEGIES.map(s => [s.id, s]));
