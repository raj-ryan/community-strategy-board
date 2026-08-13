// Seeded discussion for each strategy.
//
// The concept test found that students trust advice from someone in a
// comparable academic context, so every comment carries program and year. Two
// kinds are separated in the UI: questions, which can still be answered, and
// experiences, which report what happened when someone tried the strategy.

export type CommentKind = "question" | "experience";

export interface Reply {
  id: string;
  author: string | null;
  program: string;
  year: string;
  when: string;
  body: string;
  likes: number;
  /** Marks the person who contributed the strategy. */
  isContributor?: boolean;
}

export interface Comment extends Reply {
  kind: CommentKind;
  /** For experiences: did it work for this person? */
  outcome?: "worked" | "adapted" | "did-not-fit";
  replies: Reply[];
}

let seq = 0;
const uid = () => `seed-${++seq}`;

function c(
  kind: CommentKind,
  author: string | null,
  program: string,
  year: string,
  when: string,
  body: string,
  likes: number,
  extras: Partial<Comment> = {},
): Comment {
  return {
    id: uid(),
    kind,
    author,
    program,
    year,
    when,
    body,
    likes,
    replies: [],
    ...extras,
  };
}

function r(
  author: string | null,
  program: string,
  year: string,
  when: string,
  body: string,
  likes: number,
  isContributor = false,
): Reply {
  return { id: uid(), author, program, year, when, body, likes, isContributor };
}

export const SEED_COMMENTS: Record<number, Comment[]> = {
  1: [
    c(
      "question",
      "Sofia",
      "Social Work",
      "Year 1",
      "3 days ago",
      "How far before the quarter does Canvas actually open? Mine still says the course is unpublished and I don't want to keep checking every day.",
      12,
      {
        replies: [
          r(
            "Emma",
            "Human Centered Design & Engineering",
            "Year 2",
            "3 days ago",
            "Usually one to two weeks out, but it varies by instructor. I check once on the Thursday before classes and once on the Sunday. If it is still unpublished by the Sunday, that itself tells you the course probably has no Week 0 work.",
            18,
            true,
          ),
          r(
            "Ravi",
            "Business Analytics",
            "Year 1",
            "2 days ago",
            "Adding to this: the course can be published while Modules are still empty. The syllabus file is usually there first.",
            7,
          ),
        ],
      },
    ),
    c(
      "experience",
      "Chen",
      "Data Science",
      "Year 1",
      "1 week ago",
      "This caught a pre-class survey worth 2% in one course and a software setup task in another. I would not have opened either before the first lecture.",
      21,
      { outcome: "worked" },
    ),
    c(
      "experience",
      null,
      "Nursing",
      "Year 1",
      "2 weeks ago",
      "Worked, but I had to adapt it. Two of my clinical courses put nothing in Canvas at all before the quarter and sent everything by email from the coordinator instead.",
      9,
      { outcome: "adapted" },
    ),
    c(
      "question",
      "Ibrahim",
      "International Studies",
      "Year 2",
      "5 days ago",
      "Does this still help in your second year, or is it mostly a first-quarter thing?",
      4,
      {
        replies: [
          r(
            "Priya",
            "Information Management",
            "Year 2",
            "4 days ago",
            "Still useful. New instructors each quarter means new habits each quarter. It takes ten minutes now instead of an hour.",
            6,
          ),
        ],
      },
    ),
  ],

  2: [
    c(
      "question",
      "Hana",
      "Communication",
      "Year 1",
      "6 days ago",
      "Does the subscribed calendar update automatically when an instructor changes a due date, or do I need to re-import it?",
      15,
      {
        replies: [
          r(
            "James",
            "Computer Science & Engineering",
            "Year 2",
            "6 days ago",
            "It updates automatically, but not instantly. Google refreshes the feed every few hours, Apple lets you set the refresh interval to every hour in calendar settings. So treat it as reliable for next week and check Canvas directly for anything due tomorrow.",
            24,
            true,
          ),
        ],
      },
    ),
    c(
      "experience",
      "Olivia",
      "Business Administration",
      "Year 1",
      "1 week ago",
      "Best ten minutes I spent all quarter. Seeing coursework next to recruiting events was the thing that actually stopped the collisions.",
      19,
      { outcome: "worked" },
    ),
    c(
      "experience",
      "Marcus",
      "Drama",
      "Year 1",
      "4 days ago",
      "Adapted it. I import the Canvas feed into a separate calendar layer so I can toggle it off during tech week, otherwise the production calendar becomes unreadable.",
      11,
      { outcome: "adapted" },
    ),
    c(
      "question",
      null,
      "Public Health",
      "Year 1",
      "2 days ago",
      "Is there a way to only subscribe to some courses? One of mine has dozens of small ungraded items and it floods the calendar.",
      8,
      {
        replies: [
          r(
            "Mei",
            "Computer Science & Engineering",
            "Year 2",
            "2 days ago",
            "Not from the feed itself, but on the Canvas Calendar page you can untick a course in the sidebar before copying the link, and the feed follows what is ticked.",
            13,
          ),
        ],
      },
    ),
  ],

  3: [
    c(
      "experience",
      null,
      "Economics",
      "Year 1",
      "1 week ago",
      "Where I studied before, going to a professor's office without a serious problem would have been strange. I went once with one question about a problem set and it was completely normal here. That changed how I use the whole quarter.",
      34,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Kofi",
      "Marine & Environmental Affairs",
      "Year 1",
      "5 days ago",
      "What do you actually say in the first thirty seconds? I freeze at the opening.",
      16,
      {
        replies: [
          r(
            "Amina",
            "Public Health",
            "Year 2",
            "5 days ago",
            "I use one sentence: \"I am working on X, I tried Y, and I am stuck on Z.\" It gives them something concrete immediately and you never have to improvise the opening.",
            22,
            true,
          ),
          r(
            "Rosa",
            "Education",
            "Year 1",
            "4 days ago",
            "Also fine to say you are new to the program and want to check you understood the assignment correctly. Nobody has ever reacted badly to that.",
            9,
          ),
        ],
      },
    ),
    c(
      "experience",
      "Wei",
      "Economics",
      "Year 1",
      "3 days ago",
      "Did not fit my situation. My largest course has 90 students and office hours are a queue where you get four minutes. Emailing a specific question worked better for me than showing up.",
      7,
      { outcome: "did-not-fit" },
    ),
  ],

  5: [
    c(
      "question",
      "Diego",
      "Construction Management",
      "Year 1",
      "4 days ago",
      "Thirty minutes seems optimistic for six syllabi. Did you type them all out or copy and paste?",
      9,
      {
        replies: [
          r(
            "Priya",
            "Information Management",
            "Year 2",
            "4 days ago",
            "Copy and paste, and only the graded items. I do not transcribe readings, only things that produce a mark. That is what keeps it to half an hour.",
            14,
            true,
          ),
        ],
      },
    ),
    c(
      "experience",
      "Sanjay",
      "Electrical & Computer Engineering",
      "Year 1",
      "1 week ago",
      "The value was not the list. It was seeing that week 6 had three things due within 48 hours, which I would not have noticed until week 6.",
      27,
      { outcome: "worked" },
    ),
    c(
      "experience",
      "Beatrice",
      "Nursing",
      "Year 1",
      "2 weeks ago",
      "Adapted it: I added a column for where each thing gets submitted, because two of my courses do not use Canvas for submission at all.",
      13,
      { outcome: "adapted" },
    ),
  ],

  9: [
    c(
      "experience",
      "Tomás",
      "Epidemiology",
      "Year 1",
      "5 days ago",
      "Two minutes, and it caught a room change posted the morning of class. The daily digest would have arrived that evening.",
      23,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Clara",
      "Museology",
      "Year 2",
      "3 days ago",
      "Does immediate mean push notification or email? I do not want my phone buzzing during a site visit.",
      11,
      {
        replies: [
          r(
            "Mei",
            "Computer Science & Engineering",
            "Year 2",
            "3 days ago",
            "It follows whichever channels you have added to your account. If you only have email there, it is email only. You can set the push channel to daily and email to immediate separately.",
            17,
            true,
          ),
        ],
      },
    ),
    c(
      "experience",
      null,
      "Law",
      "Year 1",
      "1 week ago",
      "Worked, with one caveat: a couple of my instructors never post announcements at all, so for those courses this changes nothing. Worth combining with the strategy about noting where each course actually posts.",
      15,
      { outcome: "adapted" },
    ),
  ],

  13: [
    c(
      "experience",
      "Elin",
      "Environmental & Forest Sciences",
      "Year 2",
      "1 week ago",
      "Two links in my seminar broke by week 5 and the instructor had not noticed. Having the files already saved meant I did not have to email about it during the week the paper was due.",
      20,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Sara",
      "Library & Information Science",
      "Year 1",
      "4 days ago",
      "Any concern about downloading library-licensed PDFs in bulk? I did not want to trip anything.",
      8,
      {
        replies: [
          r(
            "Yuki",
            "Social Work",
            "Year 2",
            "4 days ago",
            "Downloading readings for your own coursework is normal use. What to avoid is automated bulk downloading tools, which publishers do flag. Saving each reading as you open it is fine.",
            16,
            true,
          ),
        ],
      },
    ),
  ],

  16: [
    c(
      "experience",
      "Hana",
      "Communication",
      "Year 1",
      "6 days ago",
      "I asked and the instructor said two of the six weekly readings were the ones we would actually discuss. That was the difference between the course being manageable and not.",
      31,
      { outcome: "worked" },
    ),
    c(
      "question",
      null,
      "Public Policy & Governance",
      "Year 1",
      "3 days ago",
      "Is there a way to ask this without sounding like you are trying to do less work? That is my worry.",
      19,
      {
        replies: [
          r(
            null,
            "Epidemiology",
            "Year 2",
            "3 days ago",
            "Frame it as prioritising, not skipping: \"If I only have time to read three of these closely this week, which three would you pick?\" Instructors answer that one happily because it is the same question they asked themselves when building the list.",
            28,
            true,
          ),
          r(
            "Aisha",
            "Public Policy & Governance",
            "Year 1",
            "2 days ago",
            "Asked it exactly like that in office hours and got a genuinely useful answer, plus a note about which reading the exam question would come from.",
            12,
          ),
        ],
      },
    ),
  ],

  21: [
    c(
      "experience",
      "Olivia",
      "Business Administration",
      "Year 1",
      "1 week ago",
      "We agreed on one channel and then someone started a side thread anyway. The fix was moving the decisions back into the shared doc, not fighting about the thread.",
      17,
      { outcome: "adapted" },
    ),
    c(
      "question",
      "Ngozi",
      "Urban Design & Planning",
      "Year 1",
      "5 days ago",
      "What do you do when the group picks a channel that is blocked or unusable where one member lives?",
      14,
      {
        replies: [
          r(
            "Tobias",
            "Architecture",
            "Year 2",
            "5 days ago",
            "Ask before deciding, not after. In my studio one member could not use the app the rest had defaulted to, and we only found out in week 3. Now the first question I ask is what everyone can actually access.",
            21,
            true,
          ),
        ],
      },
    ),
  ],

  23: [
    c(
      "experience",
      "Luis",
      "Information Management",
      "Year 1",
      "2 weeks ago",
      "The internal deadline is the only reason we submitted on time. One file would not export and it took a full day to fix.",
      18,
      { outcome: "worked", isContributor: true },
    ),
    c(
      "question",
      "Farah",
      "Bioengineering",
      "Year 2",
      "4 days ago",
      "Does the group actually respect the internal date, or does it just slide?",
      10,
      {
        replies: [
          r(
            "Grace",
            "Public Health",
            "Year 1",
            "4 days ago",
            "It slides unless something happens on that date. We book a 30-minute call on the internal deadline to assemble the document together. Having a meeting rather than a date is what makes it real.",
            19,
          ),
        ],
      },
    ),
  ],

  28: [
    c(
      "experience",
      null,
      "International Studies",
      "Year 1",
      "1 week ago",
      "I asked to see a strong past paper and the difference was structural, not about English. Mine had the argument in the conclusion; the strong one had it in the first paragraph. Nobody had ever told me that.",
      29,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Jonas",
      "Pharmacy",
      "Year 1",
      "6 days ago",
      "Do instructors actually share past submissions? I assumed that would be a privacy problem.",
      12,
      {
        replies: [
          r(
            null,
            "Computer Science & Engineering",
            "Year 1",
            "6 days ago",
            "Some share an anonymised example, some walk you through the rubric instead, and some describe what an A looks like out loud. Any of those three answers is useful, so ask the general question rather than for a specific student's work.",
            16,
            true,
          ),
        ],
      },
    ),
  ],

  34: [
    c(
      "experience",
      "Diego",
      "Construction Management",
      "Year 1",
      "1 week ago",
      "I turned up to my first review with digital slides when everyone else had pinned physical boards. One question beforehand would have avoided that.",
      22,
      { outcome: "worked" },
    ),
    c(
      "question",
      null,
      "Architecture",
      "Year 1",
      "3 days ago",
      "Is it acceptable to ask this in front of the whole studio, or should it be a private question?",
      9,
      {
        replies: [
          r(
            "Ngozi",
            "Urban Design & Planning",
            "Year 1",
            "3 days ago",
            "Ask in studio. Half the room has the same question and the instructor usually gives a fuller answer to the group than they would to one person.",
            15,
            true,
          ),
        ],
      },
    ),
  ],

  41: [
    c(
      "experience",
      "Ravi",
      "Business Analytics",
      "Year 1",
      "5 days ago",
      "We booked the recurring slot in week 1 and never renegotiated it once. The teams that did not spend most of week 5 trying to find an hour.",
      21,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Chen",
      "Data Science",
      "Year 1",
      "2 days ago",
      "How long a slot do you book? Ours were an hour and always overran.",
      7,
      {
        replies: [
          r(
            "Olivia",
            "Business Administration",
            "Year 1",
            "2 days ago",
            "Ninety minutes, with the last thirty treated as optional. Ending early feels better than overrunning, and people stop dreading the meeting.",
            11,
            true,
          ),
        ],
      },
    ),
  ],

  44: [
    c(
      "experience",
      null,
      "Law",
      "Year 1",
      "2 weeks ago",
      "The template mattered more than the notes themselves. When outlining started I could search one file instead of rereading a quarter of cases.",
      24,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Sara",
      "Library & Information Science",
      "Year 1",
      "1 week ago",
      "Does this work for non-case reading too? Most of mine are articles rather than cases.",
      6,
      {
        replies: [
          r(
            "Thomas",
            "Law",
            "Year 1",
            "1 week ago",
            "Yes, with different headings. For articles I use claim, evidence, method, limitation, and why it was assigned. The point is that every note has the same shape.",
            13,
            true,
          ),
        ],
      },
    ),
  ],

  51: [
    c(
      "experience",
      "Farah",
      "Bioengineering",
      "Year 2",
      "6 days ago",
      "Ran the test notebook two days early, hit a package conflict, and had it solved before the first lab. Half the room was still installing during the session.",
      26,
      { outcome: "worked" },
    ),
    c(
      "question",
      "Rosa",
      "Education",
      "Year 1",
      "4 days ago",
      "What if the setup page is not posted until the first day of class?",
      8,
      {
        replies: [
          r(
            "Chen",
            "Data Science",
            "Year 1",
            "4 days ago",
            "Email the instructor or TA and ask whether last year's setup instructions still apply. In my experience they say yes and send them, because it saves them the same questions later.",
            14,
            true,
          ),
        ],
      },
    ),
  ],

  // ── Shorter threads ─────────────────────────────────────────────────────────
  4: [
    c("experience", "Marcus", "Drama", "Year 1", "1 week ago", "Booking the non-urgent work into an actual slot was the only version of this that survived past week 3 for me.", 12, { outcome: "worked" }),
  ],
  6: [
    c("experience", "Clara", "Museology", "Year 2", "5 days ago", "The three-day 'start' reminder is what made the difference. The due-date one only ever told me I was already behind.", 14, { outcome: "worked" }),
  ],
  7: [
    c("question", "Elin", "Environmental & Forest Sciences", "Year 2", "3 days ago", "Does the Course Summary table show ungraded items like readings, or only assignments with dates?", 6, {
      replies: [r("Sofia", "Social Work", "Year 2", "3 days ago", "Anything with a date attached, including calendar events. Readings only appear if the instructor gave them a date.", 9, true)],
    }),
  ],
  8: [
    c("experience", "Jonas", "Pharmacy", "Year 1", "1 week ago", "Asked this in two courses. One said Canvas announcements, the other said they would say it in class only, which was exactly the course where I would have missed it.", 17, { outcome: "worked" }),
  ],
  10: [
    c("experience", "Ibrahim", "International Studies", "Year 2", "6 days ago", "Two of my four courses never used Announcements once. Knowing that in week 1 saved a lot of pointless checking.", 11, { outcome: "worked" }),
  ],
  11: [
    c("question", "Kofi", "Marine & Environmental Affairs", "Year 1", "4 days ago", "Can students change the course home page, or only instructors?", 5, {
      replies: [r("Tobias", "Architecture", "Year 2", "4 days ago", "Only instructors. That is why the fallback is bookmarking the announcements URL for each course.", 8, true)],
    }),
  ],
  12: [
    c("experience", null, "Genetic Counseling", "Year 2", "1 week ago", "Found two announcements I had never seen in Canvas sitting in my inbox from week 2.", 9, { outcome: "worked" }),
  ],
  14: [
    c("experience", "Sara", "Library & Information Science", "Year 1", "5 days ago", "Keeping the original filenames is the part people skip and then regret, because that is what makes search work later.", 13, { outcome: "worked" }),
  ],
  15: [
    c("experience", "Priyanka", "Biomedical & Health Informatics", "Year 2", "1 week ago", "Found next week's dataset in Files three days before it appeared in Modules.", 10, { outcome: "worked" }),
  ],
  17: [
    c("experience", "Beatrice", "Nursing", "Year 1", "4 days ago", "Turning off submission confirmations alone cut my Canvas email roughly in half.", 15, { outcome: "worked" }),
  ],
  18: [
    c("question", "Wei", "Economics", "Year 1", "2 days ago", "Does filtering to a folder risk missing something urgent?", 7, {
      replies: [r("Mei", "Computer Science & Engineering", "Year 2", "2 days ago", "That is why the announcement and grading notifications stay immediate. The folder is for the routine traffic only.", 12, true)],
    }),
  ],
  19: [
    c("experience", null, "Public Policy & Governance", "Year 1", "1 week ago", "Weekly discussion posts in a 40-person seminar were most of my notifications. Turning replies off and keeping mentions on fixed it without missing anything addressed to me.", 12, { outcome: "worked" }),
  ],
  20: [
    c("experience", "Thomas", "Law", "Year 1", "6 days ago", "Choosing email as the only channel that reaches my phone was uncomfortable for about a week and then obviously right.", 11, { outcome: "worked" }),
  ],
  22: [
    c("experience", "Ngozi", "Urban Design & Planning", "Year 1", "1 week ago", "Task, person, date. We added a fourth column for 'what done looks like' and that removed most of the disagreements.", 16, { outcome: "adapted" }),
  ],
  24: [
    c("experience", null, "Business Analytics", "Year 1", "5 days ago", "Posting my time zone first made it normal for everyone else to do it. Before that, people assumed I was slow to reply rather than asleep.", 20, { outcome: "worked" }),
  ],
  25: [
    c("experience", "Aisha", "Public Policy & Governance", "Year 1", "1 week ago", "The communication section told me the response window was 48 hours, which stopped me from panicking on day one and sending a second email.", 13, { outcome: "worked" }),
  ],
  26: [
    c("experience", "Rosa", "Education", "Year 1", "4 days ago", "Found a resubmission request in a rubric comment that had produced no notification at all.", 18, { outcome: "worked" }),
  ],
  27: [
    c("experience", "Tomás", "Epidemiology", "Year 1", "1 week ago", "Asked something small in week 1 and learned that this instructor replies within a day on Canvas but never by email. Useful before I needed it.", 12, { outcome: "worked" }),
  ],
  29: [
    c("experience", null, "Communication", "Year 1", "6 days ago", "Having questions written down is the only reason I speak in seminar at all. I stopped waiting for the perfect moment.", 19, { outcome: "worked" }),
  ],
  30: [
    c("question", "Clara", "Museology", "Year 2", "3 days ago", "Which manager handles non-Latin scripts best? Mine keeps mangling the transliteration.", 6, {
      replies: [r("Ibrahim", "International Studies", "Year 2", "3 days ago", "Zotero handles it once you set the language field per item. Worth fixing on entry rather than at the end.", 9, true)],
    }),
  ],
  31: [
    c("experience", "Sanjay", "Electrical & Computer Engineering", "Year 1", "5 days ago", "Doing the set in the session rather than after it cut my time on problem sets by about half.", 14, { outcome: "worked" }),
  ],
  32: [
    c("experience", null, "Museology", "Year 1", "1 week ago", "The access window closed a week before my deadline and I had planned as if it were open. Now the appointment goes in first.", 10, { outcome: "worked" }),
  ],
  33: [
    c("experience", "Hana", "Communication", "Year 1", "1 week ago", "Not my program, but the same idea worked for me with a conference week. Get the fixed calendar first, plan coursework around it.", 8, { outcome: "adapted" }),
  ],
  35: [
    c("experience", "Chen", "Data Science", "Year 1", "6 days ago", "License approval took four working days for me. Starting in week 0 was the only reason the first assignment was on time.", 15, { outcome: "worked" }),
  ],
  36: [
    c("experience", null, "Education", "Year 1", "1 week ago", "The district calendar and the University calendar disagreed on two weeks. Finding that in week 1 rather than week 6 was the whole value.", 12, { outcome: "worked" }),
  ],
  37: [
    c("experience", "Farah", "Bioengineering", "Year 2", "5 days ago", "Photographing the setup and instrument settings saved a whole report when my written notes turned out to be incomplete.", 16, { outcome: "worked" }),
  ],
  38: [
    c("question", "Priyanka", "Biomedical & Health Informatics", "Year 2", "4 days ago", "How do you raise this without sounding like you are asking to do less research?", 11, {
      replies: [r("Farah", "Bioengineering", "Year 2", "4 days ago", "Bring the course schedule and ask which weeks they would prefer you protect. It reads as planning rather than negotiating, and most advisers appreciate knowing in advance.", 17, true)],
    }),
  ],
  39: [
    c("experience", "Elin", "Environmental & Forest Sciences", "Year 2", "1 week ago", "A field day was announced only by email from a coordinator who was not on the Canvas site. Asking in week 1 is exactly right.", 9, { outcome: "worked" }),
  ],
  40: [
    c("experience", "Kofi", "Marine & Environmental Affairs", "Year 1", "5 days ago", "No signal at the site and the protocol was a link. Printed copies since then.", 11, { outcome: "worked" }),
  ],
  42: [
    c("experience", "Ravi", "Business Analytics", "Year 1", "1 week ago", "Requested everything on the same day and two of the four took over a week. Worth knowing which ones are slow.", 10, { outcome: "worked", isContributor: true }),
  ],
  43: [
    c("experience", "Sara", "Library & Information Science", "Year 1", "6 days ago", "The one-line note about why the source matters is the part that saves time later, more than the citation itself.", 14, { outcome: "worked", isContributor: true }),
  ],
  45: [
    c("experience", null, "Biomedical & Health Informatics", "Year 1", "1 week ago", "Training certificates took two weeks to come through. The fallback dataset kept the project moving.", 12, { outcome: "worked" }),
  ],
  46: [
    c("experience", "Beatrice", "Nursing", "Year 1", "5 days ago", "Same problem in clinical placements. Logging the same day is the only version that survives a busy week.", 9, { outcome: "worked" }),
  ],
  47: [
    c("experience", "Meredith", "Genetic Counseling", "Year 2", "1 week ago", "Placement changes never appear in Canvas. Finding the right system in week 1 is essential.", 13, { outcome: "worked" }),
  ],
  48: [
    c("experience", "Jonas", "Pharmacy", "Year 1", "4 days ago", "Re-planning at the start of each block rather than carrying the old rhythm forward was the part that actually helped.", 10, { outcome: "worked", isContributor: true }),
  ],
  49: [
    c("question", "Tomás", "Epidemiology", "Year 1", "3 days ago", "If a course accepts either R or Stata, does it matter which you pick?", 7, {
      replies: [r("Priyanka", "Biomedical & Health Informatics", "Year 2", "3 days ago", "Pick the one the TA uses. Support during the quarter matters more than the tool.", 15)],
    }),
  ],
  50: [
    c("experience", "Aisha", "Public Policy & Governance", "Year 1", "1 week ago", "Putting the recommendation in the first paragraph felt wrong coming from an essay tradition, and it was exactly what the rubric wanted.", 21, { outcome: "worked", isContributor: true }),
  ],
};

export function seedCommentsFor(id: number): Comment[] {
  return SEED_COMMENTS[id] ?? [];
}

export function countThread(comments: Comment[]): number {
  return comments.reduce((n, c) => n + 1 + c.replies.length, 0);
}
