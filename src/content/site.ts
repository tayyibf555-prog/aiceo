/*
  Every word on the site lives here. Copy rules from docs/brief.md §5
  as amended 17 Aug: the OWNER becomes an AI-powered CEO; the software
  they build is THE AI CEO OS (second brain + speed to lead agent +
  reactivation agent + orchestrator). "agents", "AI-powered" and the
  OS name are allowed vocabulary. British spelling, no em-dashes,
  banned-word list enforced by scripts/copy-lint.sh against this file.
*/

export const brand = {
  name: "The AI CEO",
  company: "Azen AI Ltd",
  hudLabel: "AICEO_V1.0",
};

export const announcement =
  "Doors open 20 August · Cohort 1 · 30 seats · $1,299";

/** Section ids double as anchor targets; exec labels feed the terminal HUD. */
export const sections = [
  { id: "hero", exec: "00_boot" },
  { id: "problem", exec: "01_problem" },
  { id: "office", exec: "02_office" },
  { id: "introducing", exec: "03_aiceo" },
  { id: "mechanism", exec: "04_systems" },
  { id: "curriculum", exec: "05_sessions" },
  { id: "get", exec: "06_get" },
  { id: "roi", exec: "07_maths" },
  { id: "fit", exec: "08_fit" },
  { id: "founders", exec: "09_people" },
  { id: "pricing", exec: "10_pricing" },
  { id: "faqs", exec: "11_faq" },
  { id: "close", exec: "12_close" },
  { id: "footer", exec: "13_end" },
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
  cta: { label: "Work with us 1-on-1", href: "#pricing" },
};

/** Swapped for the real checkout link when the user supplies it. */
export const checkoutUrl = "#pricing";

export const hero = {
  badge: "DOORS OPEN 20 AUGUST · 30 SEATS",
  h1: ["Run your business", "like an AI CEO."],
  sub: [
    { t: "Over 8 live sessions we build systems you " },
    { t: "own outright", h: "pill" as const },
    { t: ": a second brain, a speed to lead agent, a reactivation agent, and the AI CEO OS that " },
    { t: "runs them all", h: "dotted" as const },
    { t: ". Your business runs on it. You own every file." },
  ],
  primary: { label: "Work with us 1-on-1", href: "#pricing" },
  secondary: { label: "See the office", href: "#office" },
  bootLog: [
    "boot aiceo_os.v1 ............ ok",
    "brain.load(your_business) ... ok",
    "agent.speed_to_lead ...... armed",
    "agent.reactivation ....... ready",
    "os.orchestrator ......... online",
  ],
};

export const office = {
  kicker: "INSIDE THE OFFICE · LIVE",
  h2: "A live map of everything your business knows.",
  panelTitle: "THE OFFICE · SECOND BRAIN · LIVE",
  caption: "This is a real one, running. You get yours free, on day one.",
  legend:
    "BRAND & VOICE · OUTREACH OPS · LEAD ENGINE · SALES PLAYBOOK · ICP LIBRARY · OFFER STACK · CONTENT MACHINE · ONBOARDING SOPS · AGENT WORKFLOWS",
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
  turn: "None of this is a discipline problem. Your business has no memory and nobody on the desk overnight. Both are systems, and systems can be built.",
  cta: "See it running, live",
  diagram: {
    todayLabel: "TODAY",
    todayCount: "30 TABS",
    tabs: ["CHATGPT", "INBOX", "CRM", "SHEETS", "NOTION", "STRIPE"],
    todayCaption: "NOTHING TALKS TO ANYTHING",
    brainLabel: "WITH THE OS",
    folder: "aiceo-os/",
    rows: ["brain/", "speed-to-lead/", "reactivation/", "orchestrator/"],
    brainCaption: "ONE FOLDER · EVERYTHING CONNECTED",
  },
};

export const introducing = {
  kicker: "COHORT 1",
  h2: "Introducing The AI CEO.",
  body: [
    "First we hand you the brain, free: a second mind that holds what your business knows and answers from it. Then, over four weeks, Cohort 1 builds the rest around it: a speed to lead agent answering in your voice, a reactivation agent working your old list, and the AI CEO OS that runs the lot.",
    "Built live, on your business, with you at the desk. By handover you are an AI-powered CEO, and every file it runs on is yours.",
  ],
  boldLine:
    "Your competitors are already quietly running AI on their businesses. The only real question is why you are not.",
  timelineTitle: "Picture 30 days from now.",
  timeline: [
    {
      label: "OVERNIGHT",
      text: "An enquiry lands at 11:42pm. The speed to lead agent answers in your voice, quotes the right price, offers Tuesday or Thursday. You are asleep.",
      accent: false,
    },
    {
      label: "7:00 AM",
      text: "You open the office. The OS has already set the day: what came in overnight, which leads to chase, the one thing that needs you.",
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
  cta: { label: "Work with us 1-on-1", href: "#pricing" },
};

/* Merged mechanism + systems: four layers, each with the pain it kills,
   revealed one at a time along the connector in a pinned sequence. */
export const mechanism = {
  kicker: "THE MECHANISM",
  h2a: "You don't just prompt AI.",
  h2b: "You give it a second brain.",
  sub: "The AI CEO OS is your whole business in one folder your AI reads before it acts. Without one, AI is a clever chatbot with no memory. Yours is built in four parts, and the last part is the OS itself.",
  progressTail: "OF 4 · ONE BUILD",
  staticTail: "4 SYSTEMS · ONE BUILD",
  layers: [
    {
      code: "LAYER 01",
      tag: "WHAT IT KNOWS",
      icon: "brain" as const,
      name: "The second brain",
      pain: "Kills the queue of questions only you can answer.",
      text: "Prices, promises, clients, the way you like things done: one memory every agent reads before it acts.",
      example: "it knows your offer, your prices, the thing you told a client in March.",
    },
    {
      code: "LAYER 02",
      tag: "WHO ANSWERS FIRST",
      icon: "bolt" as const,
      name: "The speed to lead agent",
      pain: "Kills the enquiry that dies overnight in your inbox.",
      text: "Every new enquiry answered in minutes, in your voice, with the right price and two slots offered.",
      example: "an enquiry answered at 11:42pm while you were asleep.",
    },
    {
      code: "LAYER 03",
      tag: "WHO DIGS",
      icon: "pick" as const,
      name: "The reactivation agent",
      pain: "Digs paid-for revenue out of the list you already own.",
      text: "The clients who drifted, messaged properly and consistently until the old list pays again.",
      example: "a lead from March replies to a message you never sent.",
    },
    {
      code: "LAYER 04",
      tag: "WHO RUNS IT",
      icon: "orbit" as const,
      name: "The AI CEO OS",
      pain: "Kills the chaos of running every system yourself.",
      text: "The orchestrator watches every agent, decides what runs when, and hands you the one decision that needs a CEO.",
      example: "you open the office at 7am and the day is already set.",
    },
  ],
  close: {
    bold: "Master these four and you are an AI-powered CEO of a business that runs itself.",
    rest: " The files are yours, and ",
    hl: "files move with you.",
    tail: " You are never behind again.",
  },
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
      name: "The second brain",
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
      name: "Speed to lead agent",
      outcome: "Every new enquiry answered in minutes, in your voice.",
    },
    {
      code: "S04",
      week: "WK 2 · THU",
      name: "Live fire",
      outcome: "A real enquiry handled end to end, while the clock runs.",
    },
    {
      code: "S05",
      week: "WK 3 · TUE",
      name: "Reactivation agent",
      outcome: "Your dormant list messaged properly. Replies start landing.",
    },
    {
      code: "S06",
      week: "WK 3 · THU",
      name: "The dig pays",
      outcome: "Real replies from the old list, booked in while you watch.",
    },
    {
      code: "S07",
      week: "WK 4 · TUE",
      name: "The AI CEO OS",
      outcome: "The OS takes the desk: every agent running on schedule.",
    },
    {
      code: "S08",
      week: "WK 4 · THU",
      name: "Handover",
      outcome: "Keys handed over. The office runs itself. Every file is yours.",
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
      label: "SPEED TO LEAD",
      icon: "bolt" as const,
      title: "The agent that answers first.",
      text: "Every enquiry answered in minutes, in your voice.",
    },
    {
      label: "REACTIVATION",
      icon: "chat" as const,
      title: "The agent that digs.",
      text: "Your dormant list worked until it pays again.",
    },
    {
      label: "THE AI CEO OS",
      icon: "network" as const,
      title: "The OS on the desk.",
      text: "Every agent scheduled, watched, and reporting to you.",
    },
    {
      label: "LIVE · 8 SESSIONS",
      icon: "wave" as const,
      title: "Eight live builds with us.",
      text: "Tuesday builds, Thursday proves, plus the cohort room and every recording.",
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

/* Unrendered until real screenshots land; restore <Tools /> in page.tsx. */
export const tools = {
  kicker: "INSIDE THE BUILD",
  h2: "Real, working systems ship inside it.",
  sub: "Not slides. The same screens that run our own business, installed on yours.",
  belt: "THE BELT IS ROLLING · SCREENS LANDING SOON",
  items: [
    { name: "the-brain/", tag: "the memory" },
    { name: "speed-to-lead/", tag: "minutes, not Monday" },
    { name: "reactivation/", tag: "the dig" },
    { name: "aiceo-os/", tag: "one desk, every agent" },
  ],
  placeholder: "SCREEN DROPS IN HERE",
};

export const roi = {
  kicker: "THE MATHS",
  h2: "One revived client covers the fee.",
  body: "The cohort is $1,299. Your old list holds clients who drifted, not clients who left. The reactivation agent messages them properly, and the ones still interested book in. Put your own number on an average job and run it.",
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
    note: "One proper reactivation run usually wakes more than ten.",
  },
  coverLabel: "revived clients cover the $1,299 fee. Everything after is margin.",
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
  kicker: "THE PEOPLE",
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
  wallSub: "Owners from around the build, in their own words. Faces landing here soon.",
  wall: [
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
  h2: "Two ways to build it.",
  cards: [
    {
      id: "cohort",
      badge: "COHORT 1 · DOORS OPEN 20 AUG",
      title: "The AI CEO Cohort",
      intro:
        "Thirty owners, four weeks, all four systems built live on your own business. The free second brain is day one.",
      whatYouGet: [
        "Eight live sessions: Tuesday builds, Thursday proves",
        "The free second brain, built and loaded on day one",
        "The speed to lead agent, answering in your voice",
        "The reactivation agent working your dormant list",
        "The AI CEO OS running the lot",
        "Every session recorded + the cohort room",
        "Yours to own: the files, no subscription, transfers with your business",
      ],
      worth:
        "You build it once, in the room, and it is yours. Not rented, not a seat on someone else's platform: files you own outright that keep working long after the four weeks end.",
      worthBold:
        "Run it in your own business. One revived client covers the fee. Nothing to renew.",
      priceLabel: "COHORT 1 PRICE",
      price: "$1,299",
      seatChip: "30 SEATS ONLY",
      priceSub: "Cohort 2 pricing will be higher. The list hears first.",
      cta: "Claim a seat",
      ctaNote: "Doors open 20 August.",
      form: false,
    },
    {
      id: "private",
      badge: "AZEN AI · 1-ON-1",
      title: "Work with us 1-on-1",
      intro:
        "A separate build, not a pricier cohort seat. Just you and us, on your stack and your business.",
      whatYouGet: [
        "The whole system, built privately with you",
        "A full audit of how you run today",
        "Brain, agents and the OS stood up live",
        "Scheduled around your calendar",
        "A direct line to us while we build",
        "Every file yours outright at handover",
      ],
      worth:
        "Built with you rather than around you: how you run today audited, the brain stood up live, and everything shaped to the way your business actually works.",
      worthBold: "",
      priceLabel: "1-ON-1 PRICE",
      price: "£2,500+",
      seatChip: "£2,500 TO £3,500",
      priceSub: "Scoped properly on a short call once you ask.",
      cta: "Work with us 1-on-1",
      ctaNote: "Limited build slots each month.",
      form: true,
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

export const closer = {
  h2: "Doors open 20 August.",
  line: "COHORT 1 · 30 SEATS · $1,299",
  body: "Thirty owners build the AI CEO OS live, on their own businesses. The list hears first when seats move.",
  cta: "Claim a seat",
  href: "#pricing",
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
