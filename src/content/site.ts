/*
  Every word on the site lives here. Copy rules from docs/brief.md §5:
  British spelling, no em-dashes, banned-word list, all enforced by
  scripts/copy-lint.sh against this file. Section components consume
  this, never hard-code copy.
*/

export const brand = {
  name: "The AI CEO",
  company: "Azen AI Ltd",
  hudLabel: "AICEO_V1.0",
};

export const announcement =
  "Doors open August 20 · Cohort 1 · 10 seats · £997";

/** Section ids double as anchor targets; exec labels feed the terminal HUD. */
export const sections = [
  { id: "hero", exec: "00_boot" },
  { id: "problem", exec: "01_problem" },
  { id: "office", exec: "02_office" },
  { id: "introducing", exec: "03_aiceo" },
  { id: "mechanism", exec: "04_brain" },
  { id: "systems", exec: "05_systems" },
  { id: "curriculum", exec: "06_sessions" },
  { id: "get", exec: "07_get" },
  { id: "tools", exec: "08_tools" },
  { id: "roi", exec: "09_maths" },
  { id: "fit", exec: "10_fit" },
  { id: "founders", exec: "11_founders" },
  { id: "people", exec: "12_people" },
  { id: "pricing", exec: "13_pricing" },
  { id: "faqs", exec: "14_faq" },
  { id: "footer", exec: "15_end" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const nav = {
  links: [
    { label: "WHAT YOU GET", href: "#get" },
    { label: "HOW IT WORKS", href: "#curriculum" },
    { label: "PRICING", href: "#pricing" },
    { label: "FAQS", href: "#faqs" },
    { label: "THE OFFICE", href: "#office" },
  ],
  cta: { label: "Get the free brain", href: "#pricing" },
};

/** Swapped for the real checkout link when the user supplies it. */
export const checkoutUrl = "#pricing";

export const hero = {
  badge: "FREE BRAIN OPEN · COHORT 1: 10 SEATS",
  h1: ["Run your business", "like an AI CEO."],
  sub: [
    { t: "Over 8 live sessions we build systems you " },
    { t: "own outright", h: "pill" as const },
    { t: ": a second brain, a deputy that answers for you, speed to lead, reactivation, and a " },
    { t: "7am brief", h: "dotted" as const },
    { t: ". Your business runs on it. You own every file." },
  ],
  primary: { label: "Get the free brain", href: "#pricing" },
  secondary: { label: "See the office", href: "#office" },
};

export const office = {
  kicker: "INSIDE THE OFFICE · LIVE",
  h2: "A live map of everything your business knows.",
  panelTitle: "THE OFFICE · SECOND BRAIN · LIVE",
  caption: "This is a real one, running. You get yours free, on day one.",
  posterAlt:
    "The Office: a three dimensional map of nine glowing regions of business knowledge, firing",
  openLabel: "▶ LIVE · DRAG TO ROTATE",
  openLabelTouch: "▶ TAP TO OPEN THE OFFICE",
  fullscreenLabel: "⤢ FULLSCREEN",
  closeLabel: "✕ CLOSE",
};

export const problem = {
  kicker: "THE PROBLEM",
  h2a: "You're using AI every day.",
  h2b: "So why does the business still run on you?",
  paragraphs: [
    { t: "You have thirty tabs open right now." },
    { t: "Your CRM does not talk to your inbox. Your notes talk to nobody." },
    {
      t: "Your AI workflow is ",
      hl: "copy-pasting into a chatbot",
      t2: " that forgets you by lunchtime.",
    },
    {
      t: "An enquiry lands at 9pm. By the time you see it, they have booked the company that replied at ",
      hl: "9:04",
      t2: ".",
    },
    {
      t: "Monday morning is you asking people what happened last week. Then chasing the things that did not.",
    },
  ],
  bold: "You're not running the business.",
  boldHl: "You're refreshing it.",
  turn: "None of this is a discipline problem. Your business has no memory and no deputy. Both are systems, and systems can be built.",
  cta: "See it running, live",
  diagram: {
    todayLabel: "TODAY",
    todayCount: "30 TABS",
    tabs: ["CHATGPT", "INBOX", "CRM", "SHEETS", "NOTION", "STRIPE"],
    todayCaption: "NOTHING TALKS TO ANYTHING",
    brainLabel: "WITH THE BRAIN",
    folder: "aiceo-brain/",
    rows: ["brain/", "deputy/", "leads/", "inbox/"],
    brainCaption: "ONE FOLDER · EVERYTHING CONNECTED",
  },
};

export const introducing = {
  kicker: "INTRODUCING",
  h2: "Introducing The AI CEO.",
  body: [
    "First we hand you the brain, free: a second mind that holds what your business knows and answers from it. Then, over four weeks, Cohort 1 builds the rest around it: a deputy that answers in your voice, speed to lead, reactivation, and a brief that lands at 7am.",
    "Built live, on your business, with you at the desk. When it is done, you own every file it runs on.",
  ],
  boldLine:
    "Your competitors are already quietly running AI on their businesses. The only real question is why you are not.",
  timelineTitle: "Picture 30 days from now.",
  timeline: [
    {
      label: "OVERNIGHT",
      text: "An enquiry lands at 11:42pm. The deputy answers in your voice, quotes the right price, offers Tuesday or Thursday. You are asleep.",
      accent: false,
    },
    {
      label: "7:00 AM",
      text: "The brief is on your phone. What came in, what went out, what stalled, and the one thing that needs you today. Coffee still hot.",
      accent: false,
    },
    {
      label: "TUESDAY",
      text: "A lead you wrote off in March replies to a message you never sent. Yes, still interested. Can we talk this week?",
      accent: true,
    },
    {
      label: "AFTER THAT",
      text: "The rest of the day goes to the work only you can do.",
      accent: false,
    },
  ],
  cta: { label: "Get the free brain", href: "#pricing" },
};

export const mechanism = {
  kicker: "THE MECHANISM",
  h2a: "You don't just prompt AI.",
  h2b: "You give it a second brain.",
  sub: "The brain is your whole business in one folder your AI reads before it acts. Without one, AI is a clever chatbot with no memory. Yours is built in four parts.",
  layers: [
    {
      code: "LAYER 01",
      tag: "WHAT IT KNOWS",
      name: "The brain",
      lead: "Give it your world.",
      text: "Prices, promises, clients, the way you like things done: one memory it reads before every task. You stop repeating yourself in every new chat.",
      example: "it knows your offer, your prices, the thing you told a client in March.",
    },
    {
      code: "LAYER 02",
      tag: "WHO ANSWERS",
      name: "The deputy",
      lead: "It writes like you.",
      text: "Replies, quotes and follow-ups drafted from the brain, in your voice, ready before you wake. You approve, it sends.",
      example: "an enquiry answered at 11:42pm with the right price and two slots.",
    },
    {
      code: "LAYER 03",
      tag: "WHAT RUNS",
      name: "The engines",
      lead: "Speed to lead and reactivation.",
      text: "New enquiries answered in minutes, day or night. The list you already paid for, worked properly until it pays again.",
      example: "a lead from March replies to a message you never sent.",
    },
    {
      code: "LAYER 04",
      tag: "WHAT YOU SEE",
      name: "The brief",
      lead: "Every morning, 7am.",
      text: "What came in, what went out, what stalled, and the one thing that needs you today. The whole business in one read.",
      example: "read it with the first coffee, before anyone calls.",
    },
  ],
  close: {
    bold: "Master these four and the business stops queueing for you.",
    rest: " The files are yours, and ",
    hl: "files move with you.",
    tail: " You are never behind again.",
  },
};

export const systems = {
  kicker: "WHAT IT KILLS",
  h2: "Four systems. Each one kills a specific pain.",
  cards: [
    {
      icon: "🧠",
      name: "The Brain & Deputy",
      pain: "Kills the queue of questions only you can answer.",
    },
    {
      icon: "⚡",
      name: "Speed to Lead",
      pain: "Kills the enquiry that dies overnight in your inbox.",
    },
    {
      icon: "⛏️",
      name: "Reactivation",
      pain: "Digs paid-for revenue out of the list you already own.",
    },
    {
      icon: "☀️",
      name: "The Daily Brief",
      pain: "Kills the Monday morning spent asking what happened.",
    },
  ],
};

export const curriculum = {
  kicker: "HOW IT WORKS",
  h2: "Here's exactly what we build together.",
  sub: "Eight live sessions across four weeks. Tuesday we build it on your business, Thursday it proves itself, and every session ends with something running.",
  progressLabel: "OF 8 · FOUR WEEKS",
  rows: [
    {
      code: "S01",
      week: "WK 1 · TUE",
      name: "The brain",
      outcome: "Everything your business knows, loaded into one place that answers.",
    },
    {
      code: "S02",
      week: "WK 1 · THU",
      name: "The proof",
      outcome: "The brain answers twenty real questions about your business while you watch.",
    },
    {
      code: "S03",
      week: "WK 2 · TUE",
      name: "The deputy",
      outcome: "Drafts, replies and quotes in your voice, from your brain.",
    },
    {
      code: "S04",
      week: "WK 2 · THU",
      name: "The voice check",
      outcome: "The deputy answers real enquiries while you watch and correct it.",
    },
    {
      code: "S05",
      week: "WK 3 · TUE",
      name: "Speed to lead",
      outcome: "Every new enquiry answered in minutes, day or night.",
    },
    {
      code: "S06",
      week: "WK 3 · THU",
      name: "Live fire",
      outcome: "A real enquiry handled end to end, while the clock runs.",
    },
    {
      code: "S07",
      week: "WK 4 · TUE",
      name: "Reactivation",
      outcome: "Your dormant list messaged properly. Replies start landing.",
    },
    {
      code: "S08",
      week: "WK 4 · THU",
      name: "The 7am brief",
      outcome: "The morning brief lands. Keys handed over. Every file is yours.",
    },
  ],
};

export const whatYouGet = {
  kicker: "WHAT YOU GET",
  h2: "Everything you get when you join.",
  cards: [
    {
      label: "THE BRAIN",
      icon: "folder" as const,
      title: "The second brain, installed.",
      text: "Built live at the free session, loaded with what your business knows.",
    },
    {
      label: "THE DEPUTY",
      icon: "chat" as const,
      title: "Your voice, encoded.",
      text: "Replies and quotes drafted the way you would write them.",
    },
    {
      label: "THE ENGINES",
      icon: "bolt" as const,
      title: "Speed to lead + reactivation.",
      text: "Running on your live enquiries and your dormant list.",
    },
    {
      label: "LIVE · 8 SESSIONS",
      icon: "wave" as const,
      title: "Eight live builds with us.",
      text: "Tuesday builds, Thursday proves. Questions answered until done.",
    },
    {
      label: "THE ROOM",
      icon: "network" as const,
      title: "Cohort room + recordings.",
      text: "Miss a session and the replay is waiting for you.",
    },
    {
      label: "THE KEYS",
      icon: "key" as const,
      title: "Yours outright.",
      text: "Every file on your machines. No subscription to keep paying.",
    },
  ],
  banner: {
    label: "YOURS TO OWN",
    h: ["Built once.", "Owned forever."],
    text: "Everything we build in the four weeks is yours outright. The files live on your machines. No platform that can take it away. It transfers with your business.",
  },
};

export const tools = {
  kicker: "INSIDE THE BUILD",
  h2: "Real, working systems ship inside it.",
  sub: "Not slides. The same screens that run our own business, installed on yours.",
  belt: "THE BELT IS ROLLING · SCREENS LANDING SOON",
  items: [
    { name: "the-brain/", tag: "the memory" },
    { name: "deputy/", tag: "your voice" },
    { name: "speed-to-lead/", tag: "minutes, not Monday" },
    { name: "reactivation/", tag: "the dig" },
    { name: "the-brief/", tag: "7am, every day" },
  ],
  placeholder: "SCREEN DROPS IN HERE",
};

export const roi = {
  kicker: "THE MATHS",
  h2: "One revived client covers the fee.",
  body: "The cohort is £997. Your old list holds clients who drifted, not clients who left. Reactivation messages them properly, and the ones still interested book in. Put your own number on an average job and run it.",
  slider: {
    label: "YOUR AVERAGE JOB",
    min: 100,
    max: 2000,
    step: 50,
    initial: 350,
    hint: "drag to your usual job value",
  },
  result: {
    label: "BACK IN THE BUSINESS · TEN REVIVED CLIENTS",
    formula: "your job value × ten clients your list can wake",
    note: "One proper reactivation run usually wakes more than ten. The fee is covered by the first.",
  },
  coverLabel: "clients to cover the £997 fee",
};

export const fit = {
  kicker: "FIT CHECK",
  h2: "Who this is for.",
  rows: [
    {
      n: "01",
      title: "You own the business",
      sub: "and you attend the sessions yourself, not a delegate",
    },
    {
      n: "02",
      title: "The business is live",
      sub: "real enquiries, real clients, a real list going cold",
    },
    {
      n: "03",
      title: "Everything lives in your head",
      sub: "prices, promises, the way you like things done",
    },
    {
      n: "04",
      title: "You want to own the system",
      sub: "on your machines, not another subscription to rent",
    },
  ],
  notForLabel: "NOT FOR",
  notFor: "anyone collecting AI tricks instead of building systems",
};

export const founders = {
  kicker: "THE FOUNDERS",
  h2a: "This is not a course.",
  h2b: "It is the system our business runs on.",
  body: "We built every one of these systems for our own company first. The cohort does not teach you about them, it installs them. Click a card to meet us.",
  flipHint: "CLICK TO FLIP",
  cards: [
    {
      id: "founder-1",
      photoLabel: "PHOTO_01",
      name: "FOUNDER_01",
      role: "AZEN AI LTD",
      bio: "Bio drops in here: who they are, what they run day to day, and why these systems exist. Two or three sentences, written plainly.",
    },
    {
      id: "founder-2",
      photoLabel: "PHOTO_02",
      name: "FOUNDER_02",
      role: "AZEN AI LTD",
      bio: "Bio drops in here: who they are, what they run day to day, and why these systems exist. Two or three sentences, written plainly.",
    },
  ],
};

export const people = {
  kicker: "THE PEOPLE",
  h2: "The wall.",
  sub: "Owners from around the build, in their own words. Faces landing here soon.",
  cards: [
    { name: "OWNER_01" },
    { name: "OWNER_02" },
    { name: "OWNER_03" },
    { name: "OWNER_04" },
    { name: "OWNER_05" },
    { name: "OWNER_06" },
  ],
};

export const pricing = {
  kicker: "PRICING",
  h2: "Start free. Own the rest.",
  cards: [
    {
      id: "free",
      name: "The free brain",
      price: "£0",
      meta: "ONE LIVE SESSION",
      features: [
        "Your second brain, built live with you",
        "Loaded with what your business knows",
        "Answers from your files on day one",
        "Yours to keep, whatever you do next",
      ],
      ctaLabel: "Get the free brain",
      featured: false,
    },
    {
      id: "cohort",
      name: "Cohort 1",
      price: "£997",
      meta: "10 SEATS · DOORS OPEN AUG 20",
      features: [
        "Eight live sessions over four weeks",
        "All four systems running in your business",
        "Cohort room, recordings, direct answers",
        "Every file yours outright at handover",
        "Optional retainer afterwards to keep it tuned",
      ],
      ctaLabel: "Claim a seat",
      featured: true,
    },
    {
      id: "private",
      name: "1-on-1 build",
      price: "£2,500+",
      meta: "PRIVATE · £2,500 TO £3,500",
      features: [
        "The same systems, built privately with you",
        "Scheduled around your calendar",
        "Quiet, quick, and off the record",
        "For owners who want the desk to themselves",
      ],
      ctaLabel: "Ask about 1-on-1",
      featured: false,
    },
  ],
};

export const faqs = {
  kicker: "QUESTIONS",
  h2: "Asked and answered.",
  items: [
    {
      q: "How much of my time does this take?",
      a: "Around ten hours across the four weeks. Two live sessions a week, an hour each, plus small between-session jobs that are mostly you approving things.",
    },
    {
      q: "Is my data safe?",
      a: "Your files live in your accounts, on your machines. We build inside your house rather than taking the furniture away. Nothing you load is shared with other cohort members, ever.",
    },
    {
      q: "Do I need a Mac?",
      a: "No. Windows is fine, a browser is fine. If you can open a folder and join a video call, you are fully equipped.",
    },
    {
      q: "Am I technical enough for this?",
      a: "If you can describe how your business works out loud, yes. The building happens live, together, and the typing is not your job.",
    },
    {
      q: "What happens after the four weeks?",
      a: "It keeps running, because you own it. Some owners take the optional retainer so we keep tuning it as the business changes. Plenty just run it themselves.",
    },
  ],
};

export const leadForm = {
  nameLabel: "NAME",
  namePlaceholder: "Your name",
  emailLabel: "EMAIL",
  emailPlaceholder: "you@yourbusiness.co.uk",
  submitting: "▶ RESERVING…",
  success: "▶ RESERVED · CHECK YOUR INBOX",
  successNote: "You are on the list. Details land by email before doors open.",
  invalid: "A real name and a real email, please.",
  error: "That did not go through. Try again in a minute.",
};

export const footer = {
  line: "Run your business like an AI CEO.",
  company: "Azen AI Ltd",
  year: "2026",
  note: "MADE IN THE OFFICE · EVERY FILE OWNED",
};
