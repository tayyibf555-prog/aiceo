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
  company: "The AI CEO",
  /* one place to change the contact address everywhere */
  contactEmail: "hello@theaiceo.io",
  hudLabel: "AICEO_V1.0",
};

/* seatsFilled is the only place this number lives: keep it true, or
   wire it to the live order count when the checkout webhook is on. */
export const seatsFilled = 12;
export const seatsTotal = 30;
export const announcement = `Cohort 1 starts 18 September · ${seatsFilled}/${seatsTotal} seats filled · $997`;

/** Section ids double as anchor targets; exec labels feed the terminal HUD. */
export const sections = [
  { id: "hero", exec: "00_boot" },
  { id: "problem", exec: "01_problem" },
  { id: "office", exec: "02_office" },
  { id: "introducing", exec: "03_aiceo" },
  { id: "days", exec: "04_30days" },
  { id: "mechanism", exec: "05_systems" },
  { id: "curriculum", exec: "06_sessions" },
  { id: "get", exec: "07_get" },
  { id: "roi", exec: "08_maths" },
  { id: "fit", exec: "09_fit" },
  { id: "founders", exec: "10_people" },
  { id: "pricing", exec: "11_pricing" },
  { id: "faqs", exec: "12_faq" },
  { id: "close", exec: "13_close" },
  { id: "footer", exec: "14_end" },
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
  cta: { label: "Claim your seat", href: "#pricing" },
};

/** The live Commas checkout for the cohort seat. */
export const checkoutUrl = "https://commas.com/checkout/q8g1pMuWskUnus";

export const hero = {
  badge: "COHORT 1 STARTS 18 SEPTEMBER · 30 SEATS",
  h1: ["Run your business", "like an AI CEO."],
  sub: [
    { t: "Over 8 live sessions we build systems you " },
    { t: "own outright", h: "pill" as const },
    { t: ": a second brain, a speed to lead agent, a reactivation agent, and the AI CEO OS that " },
    { t: "runs them all", h: "dotted" as const },
    { t: ". Your business runs on it. You own every file." },
  ],
  primary: { label: "Claim your seat", href: "#pricing" },
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
  cta: "Claim your seat",
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
  status: {
    title: "AICEO_OS · RUNNING",
    rows: [
      "brain ................ loaded",
      "speed_to_lead ......... armed",
      "reactivation .......... ready",
      "orchestrator ......... online",
    ],
    foot: "EVERY FILE OWNED BY YOU",
  },
};

/* One day, 30 days from now, one beat per system. Pinned stop-scroll:
   the accent line draws down the rail and each beat reveals as the
   line reaches its dot. */
export const days = {
  h2: "Picture 30 days from now.",
  entries: [
    {
      time: "11:42 PM",
      tag: "SPEED TO LEAD",
      text: "An enquiry lands. The agent answers in your voice, quotes the right price, offers Tuesday or Thursday. You are asleep.",
    },
    {
      time: "2:00 AM",
      tag: "REACTIVATION",
      text: "The reactivation agent works the old list: the right message, to the right forty people, without you lifting a finger.",
    },
    {
      time: "7:00 AM",
      tag: "THE AI CEO OS",
      text: "You open the office. The OS has set the day: what came in overnight, which leads to chase, the one thing that needs you.",
    },
    {
      time: "9:15 AM",
      tag: "THE BRAIN",
      text: "A client asks about the quote from March. The answer is one question away, not twenty minutes of digging.",
    },
    {
      time: "AFTER THAT",
      tag: "YOU",
      text: "The rest of the day goes to the work only you can do.",
    },
  ],
  tail: "OF 5 · ONE ORDINARY DAY",
  staticTail: "5 BEATS · ONE ORDINARY DAY",
  cta: { label: "Claim your seat", href: "#pricing" },
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
      name: "The list wakes up",
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
    text: "Everything we build in the four weeks is yours outright. The files live on your machines. No platform that can take it away. It transfers with your business. And the value keeps landing: one sharp AI tip in your inbox every day, through the cohort and for ten days after handover.",
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
  body: "The cohort is $997. Your old list holds clients who drifted, not clients who left. The reactivation agent messages them properly, and the ones still interested book in. Put your own number on an average job and run it.",
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
  coverLabel: "revived clients cover the $997 fee. Everything after is margin.",
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
  flipHint: "FLIP ME",
  cards: [
    {
      id: "founder-1",
      photo: "/founders/tayyib.webp",
      photoLabel: "",
      name: "Tayyib Arbab",
      role: "CO-FOUNDER · THE AI CEO",
      bio: "Tayyib is the owner of Azen AI, the studio behind the systems in this cohort. He studied cyber security, and the technical grounding shows: years spent inside real businesses building second brains, lead engines and client CRMs, engineered to work and locked down to stay safe. Everything in the programme ran on his own company first.",
      links: [
        { kind: "web", href: "https://www.azen.io/", label: "Azen AI" },
        { kind: "youtube", href: "https://www.youtube.com/@TayyibArbab", label: "YouTube" },
        { kind: "instagram", href: "https://www.instagram.com/tayyib_ai/", label: "Instagram" },
      ],
    },
    {
      id: "founder-2",
      photo: "/founders/ritesh.webp",
      photoLabel: "",
      name: "Ritesh Verma",
      role: "CO-FOUNDER · THE AI CEO",
      bio: "Ritesh is the founder of Slyte, an AI development studio with fifty plus client builds and over $2M generated for the businesses behind them. A computer science graduate and former fintech engineer, he left the day job in 2025 with a seven figure AI business already running and 200,000 people following the work. Through Agent Rise, he has mentored 200+ people into AI businesses of their own.",
      links: [
        { kind: "web", href: "https://www.slyte.app/", label: "Slyte" },
        { kind: "youtube", href: "https://www.youtube.com/@rkumarv", label: "YouTube" },
        { kind: "instagram", href: "https://www.instagram.com/riteshkv_/", label: "Instagram" },
        { kind: "agentrise", href: "https://www.becomeabotdeveloper.com/", label: "Agent Rise", img: "/founders/agentrise-icon.png" },
      ],
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
      badge: "COHORT 1 · STARTS 18 SEPTEMBER",
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
      price: "$997",
      seatChip: "30 SEATS ONLY",
      priceSub: "Cohort 2 pricing will be higher. The list hears first.",
      cta: "Claim your seat",
      ctaNote: "Cohort 1 starts 18 September.",
      form: false,
    },
    {
      id: "private",
      badge: "THE AI CEO · 1-ON-1",
      title: "Work with us 1-on-1",
      intro:
        "Consulting for owners who want AI mapped to their business before anything gets built. Just you and us, on your side of the desk.",
      whatYouGet: [
        "Everything inside the cohort",
        "Two education calls a week, until AI systems make sense",
        "A custom roadmap for bringing AI into your business",
        "The exact systems to build, and the stack to build them on",
        "Your first system, built for you, free",
        "A dedicated AI architect inside your business if we build together",
        "Team education for your staff, priced separately",
      ],
      worth:
        "You leave with a plan you actually understand, not a subscription you rent: the systems named, the stack chosen, and the first one already running.",
      worthBold: "",
      priceLabel: "HOW YOU START",
      price: "",
      seatChip: "",
      priceSub:
        "No listed price. Every build is scoped to your business on a short call, and we come back within a day.",
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
  h2: "Cohort 1 starts 18 September.",
  line: "COHORT 1 · 30 SEATS · $997",
  body: "Thirty owners build the AI CEO OS live, on their own businesses. The list hears first when seats move.",
  cta: "Claim your seat",
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
  company: "The AI CEO",
  year: "2026",
  note: "MADE IN THE OFFICE · EVERY FILE OWNED",
};

/* /thank-you: what a buyer sees the second after paying. Linked from
   the payment redirect only; not in the nav, not indexed. */
export const thankYou = {
  kicker: "PAYMENT CONFIRMED · COHORT 1",
  h1: "You're in.",
  sub: "Your seat is locked for 18 September. Three things before day one. They take five minutes and you arrive ready.",
  steps: [
    {
      code: "STEP 01",
      title: "Watch the two welcome videos.",
      body: "Fifteen minutes total. The first shows how the four weeks run. The second shows how to get your files ready for the second brain, so day one builds on your real business.",
      videos: [
        { tag: "VIDEO 01", title: "How the cohort runs", length: "07:42" },
        { tag: "VIDEO 02", title: "Get your files ready", length: "06:58" },
      ],
    },
    {
      code: "STEP 02",
      title: "Accept the calendar invites.",
      body: "Eight session invites are on their way to the email you paid with, each with its Google Meet link. Say yes to all of them and the four weeks guard their own place in your diary.",
      caption: "They look like this. Hit yes on every one.",
    },
    {
      code: "STEP 03",
      title: "Join the cohort HQ.",
      body: "One link, one space, for the whole four weeks. The timeline ticked off as we build, every call recording the morning after, announcements, and answers between sessions.",
      caption: "The welcome email lands within ten minutes of payment. Check promotions if it hides.",
      cta: "Open the cohort HQ",
      /* the hosted cohort HQ; moves to the custom domain when chosen */
      href: "https://aiceo-hq.vercel.app",
    },
  ],
  closing: {
    line: "That is everything. See you on day one.",
    note: "Bring a real business problem. We build on it.",
  },
  backLink: "BACK TO THE SITE",
};
