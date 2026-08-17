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
  { id: "systems", exec: "04_systems" },
  { id: "curriculum", exec: "05_sessions" },
  { id: "exam", exec: "06_exam" },
  { id: "roi", exec: "07_roi" },
  { id: "fit", exec: "08_fit" },
  { id: "pricing", exec: "09_pricing" },
  { id: "faqs", exec: "10_faq" },
  { id: "footer", exec: "11_end" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const nav = {
  links: [
    { label: "WHAT YOU GET", href: "#systems" },
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
  /* Subhead runs; "h" marks a highlight style. */
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
  h2: "Introducing The AI CEO.",
  body: "First we hand you the brain, free: a second mind that holds what your business knows and answers from it. Then, over four weeks, Cohort 1 builds the rest around it: a deputy that answers in your voice, speed to lead, reactivation, and a brief that lands at 7am. Built live, on your business, with you at the desk. When it is done, you own every file it runs on.",
  vignettes: [
    {
      label: "OVERNIGHT",
      text: "11:42pm. An enquiry lands. The deputy answers in your voice, quotes the right price, offers Tuesday or Thursday. You are asleep.",
    },
    {
      label: "7:00 AM",
      text: "The brief is on your phone. What came in, what went out, what stalled, and the one thing that needs you today. Coffee still hot.",
    },
    {
      label: "TUESDAY",
      text: "A lead you wrote off in March replies to a message you never sent. Yes, still interested. Can we talk this week?",
    },
  ],
};

export const systems = {
  kicker: "WHAT YOU GET",
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
  h2: "Eight sessions. Four weeks. Tuesday builds, Thursday proves.",
  strapline: "Every session ends with something running in your business.",
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
      name: "The exam",
      outcome: "Twenty questions about your own business. It sits the test, you mark it.",
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

export const exam = {
  kicker: "THE GUARANTEE",
  h2: "Week one ends with an exam. You are the marker.",
  score: "16/20",
  body: "You ask the brain twenty questions about your own business. Prices, jobs, promises, the thing you told a client in March. You mark the answers yourself.",
  guarantee:
    "16 out of 20 or we keep working with you, free, until it passes.",
  close: "Most businesses never test their systems. Yours starts by passing an exam.",
};

export const roi = {
  kicker: "THE MATHS",
  h2: "One revived client covers the fee.",
  body: "The cohort is £997. Your old list holds clients who drifted, not clients who left. Reactivation messages them properly, and the ones still interested book in. One booked job at your usual price and the fee is paid for. Everything after that is margin.",
  counter: { prefix: "£", target: 997, suffix: "", label: "covered by the first revived client" },
  stats: [
    { value: "£997", label: "the fee, once" },
    { value: "1", label: "revived client to cover it" },
    { value: "∞", label: "shelf life of what you keep" },
  ],
};

export const fit = {
  kicker: "FIT CHECK",
  h2: "Built for owners at the desk, not delegates.",
  forYou: {
    title: "THIS IS FOR YOU IF",
    items: [
      "You own the business and you attend the sessions yourself.",
      "The business is live: real enquiries, real clients, a real list.",
      "You want systems you own, not another subscription you rent.",
      "You can give it around ten hours across the four weeks.",
    ],
  },
  notYou: {
    title: "THIS IS NOT FOR YOU IF",
    items: [
      "You plan to send someone in your place.",
      "There is no business yet, only an idea.",
      "You collect AI tricks for fun and build nothing with them.",
      "You want it done to you rather than with you.",
    ],
  },
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
        "The exam: 16/20 or we work free until it passes",
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
      q: "What if the brain scores under 16 in the exam?",
      a: "Then we keep working with you, free, until it passes. That is the whole point of putting an exam at the end of week one: you find out early, and the risk sits with us.",
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
