// ─── Site-wide constants ────────────────────────────────────────────────────
// Edit this file to update copy, pricing, contact info, and portfolio items
// without touching any component code.

export const SITE = {
  name: "Route 9 Web",
  email: "hello@route9web.com",
  phone: "508 864 5532",          // e.g. "(508) 555-0123" — fill in before launch
  github: "xX-its-amit-Xx",   // e.g. "https://github.com/yourusername/route9web"
  personalSite: "https://xx-its-amit-xx.github.io/amit-sh/", // e.g. "https://yourname.dev"
  domain: "https://route9web.com",
  location: "Shrewsbury, MA",
  founded: "2026",
} as const;

// ─── Hero ────────────────────────────────────────────────────────────────────
// Headline options — pick one or write your own:
// Option A (chosen): "Your neighbors are searching. Let's make sure they find you."
// Option B: "Your shop deserves a website that earns its keep."
// Option C: "Websites for businesses on Route 9. Built locally, built right."
export const HERO = {
  label: "Shrewsbury, MA · Route 9",
  headlineA: "Small shops.",
  headlineB: "Big presence.",
  subhead:
    "Route 9 Web builds websites for the barbers, bakers, and family restaurants that make Shrewsbury worth stopping for. Fast, mobile-first, and maintained by someone who actually knows your neighborhood.",
  ctaPrimary: { text: "See pricing", href: "#pricing" },
  ctaSecondary: { text: "Get in touch", href: "#contact" },
} as const;

// ─── Who I work with ─────────────────────────────────────────────────────────
export const WHO = {
  heading: "Independent shops. Not chains.",
  subhead:
    "I work with the places that make Shrewsbury worth stopping for — the kind of business where the owner is usually behind the counter, not answering a support ticket.",
  businessTypes: [
    "Restaurants & Pizzerias",
    "Cafes & Coffee Shops",
    "Barbershops",
    "Salons & Spas",
    "Bakeries",
    "Specialty Retail",
    "Auto Repair",
    "Boutiques",
    "Nail Salons",
    "Florists",
  ],
  towns: ["Shrewsbury", "Westborough", "Northborough", "Worcester", "Framingham"],
  reasons: [
    {
      heading: "Same-day response",
      body: "No tickets, no queue, no 'we'll get back to you in 3–5 business days.' If something's wrong, I fix it today.",
    },
    {
      heading: "In-person meetings",
      body: "I can meet you at your shop. I know where you are. This is not something your current hosting company can offer.",
    },
    {
      heading: "Knows the neighborhood",
      body: "Route 9 is my backyard. I understand the local market, the foot traffic patterns, and what customers here actually search for.",
    },
  ],
} as const;

// ─── Quality pillars ─────────────────────────────────────────────────────────
export const PILLARS = [
  {
    icon: "Smartphone" as const,
    heading: "Mobile-first",
    body: "Over 70% of local business traffic comes from phones. Every site is designed for thumb-scrolling first, desktop second.",
  },
  {
    icon: "Zap" as const,
    heading: "Speed",
    body: "Pages load in under 2 seconds on LTE. Slow sites lose customers and Google rankings. Both are bad for business.",
  },
  {
    icon: "MousePointerClick" as const,
    heading: "Built to convert",
    body: "Every page has a clear next step — book, order, or get directions. Visitors should never have to wonder what to do.",
  },
  {
    icon: "MapPin" as const,
    heading: "Local SEO",
    body: "Google Business integration, schema markup, and on-page structure so your shop shows up when neighbors search nearby.",
  },
  {
    icon: "Accessibility" as const,
    heading: "Accessible",
    body: "Color contrast, semantic HTML, keyboard navigation. Works for everyone — not just people on a new MacBook.",
  },
  {
    icon: "Wrench" as const,
    heading: "Maintainable",
    body: "Menu change? Holiday hours? Done in minutes. Nothing about your site is locked into a proprietary platform.",
  },
] as const;

// ─── Pricing ─────────────────────────────────────────────────────────────────
export const PRICING = [
  {
    name: "Starter",
    setup: "$750",
    monthly: "$40/mo",
    description: "Everything a local shop needs to look good online and get found.",
    features: [
      "5-page custom website",
      "Home, About, Menu/Services, Contact, Gallery",
      "Mobile-responsive and fast",
      "Custom domain setup",
      "Google Maps embed",
      "Up to 2 content updates/month",
      "Hosting, security patches & uptime monitoring",
    ],
    ideal: "Barbershops, small salons, single-location restaurants",
    highlighted: false,
    cta: "Get started",
  },
  {
    name: "Pro",
    setup: "$1,500",
    monthly: "$75/mo",
    description: "For established businesses ready to do more with their online presence.",
    features: [
      "Everything in Starter",
      "Booking integration (Calendly, Vagaro, Booksy, etc.)",
      "Custom domain email",
      "QR code menu — update without reprinting",
      "Social media feeds embedded",
      "Up to 4 content updates/month",
    ],
    ideal: "Established restaurants, cafes, bakeries",
    highlighted: true,
    cta: "Get started",
  },
  {
    name: "Custom",
    setup: "Let's talk",
    monthly: "",
    description: "For shops with specific needs we should figure out together first.",
    features: [
      "E-commerce & online ordering",
      "Square POS integration",
      "Multi-location support",
      "Anything else — just ask",
    ],
    ideal: "Shops with specific or complex requirements",
    highlighted: false,
    cta: "Get in touch",
  },
] as const;

export const FOUNDING_OFFER = {
  headline: "Founding pricing — first three Shrewsbury shops only",
  body: "$300 one-time + $30/month for life on the Starter tier. Mention this when we talk.",
} as const;

// ─── Maintenance FAQ ──────────────────────────────────────────────────────────
export const FAQ = [
  {
    q: "How often will my site go down?",
    a: "Uptime monitoring runs 24/7 via UptimeRobot. Hosting is on Vercel, which maintains a 99.9%+ uptime track record. If something breaks, I know about it before you do.",
  },
  {
    q: "How do I reach you if something breaks?",
    a: "Text or call — directly, no ticketing system, no hold music. Response within 2 hours during the day. Or just text me: fastest way to reach me.",
  },
  {
    q: "What if I want to leave?",
    a: "30-day notice, no contracts. All files are exported to you on full payment of the initial fee. Nothing proprietary, nothing locked in.",
  },
  {
    q: "Can my menu be a QR code?",
    a: "Yes — included in the Pro tier. One URL, update the menu anytime. No reprinting laminated menus every time the prices change.",
  },
  {
    q: "Who actually owns my website?",
    a: "You do — fully — on payment of the initial setup fee. The monthly fee covers hosting and maintenance, not a license. If you stop paying, you get the files.",
  },
] as const;

// ─── Portfolio ────────────────────────────────────────────────────────────────
// Swap out placeholder items with real client work as it comes in.
export const PORTFOLIO = [
  {
    label: "Coming Soon — Pizzeria",
    description: "A fast, mobile-first website with online menu, hours, and Google Maps integration.",
    gradient: "from-amber-100 via-orange-50 to-yellow-50",
    live: null,
  },
  {
    label: "Coming Soon — Cafe",
    description: "A clean cafe site with Instagram feed, downloadable menu, and reservation link.",
    gradient: "from-emerald-100 via-teal-50 to-green-50",
    live: null,
  },
  {
    label: "Coming Soon — Salon",
    description: "A salon portfolio with booking integration, photo gallery, and service menu.",
    gradient: "from-rose-100 via-pink-50 to-fuchsia-50",
    live: null,
  },
] as const;

// ─── Process ──────────────────────────────────────────────────────────────────
export const PROCESS = [
  {
    step: 1,
    heading: "Free 20-minute meeting",
    body: "In person at your shop on Route 9, or by phone — whichever's easier. We talk about what you need, I answer questions, and neither of us wastes time if it's not a fit.",
  },
  {
    step: 2,
    heading: "I build a preview",
    body: "You see exactly what you're getting before paying anything. A real, working site preview — not a wireframe, not a PDF with rounded rectangles.",
  },
  {
    step: 3,
    heading: "You approve, I launch",
    body: "Once you're happy, I move the site to your domain and you start the monthly plan. The whole launch process usually takes less than a day.",
  },
  {
    step: 4,
    heading: "Updates whenever you need them",
    body: "Just text me. New menu item, holiday hours, updated photos — I handle it. You focus on running your shop.",
  },
] as const;

// ─── Testimonials ─────────────────────────────────────────────────────────────
// Replace placeholder copy with real client quotes when you have them.
// Set isPlaceholder: false once each quote is real — the section is always shown.
export const TESTIMONIALS = [
  {
    quote: "My old website looked like it was built in 2009 by someone who owed my nephew a favor. Now it actually looks like I know what I'm doing. Which, as it turns out, is exactly what happened.",
    author: "Tony M.",
    business: "Tony's Auto & Tire",
    town: "Shrewsbury, MA",
    initials: "TM",
    isPlaceholder: true,
  },
  {
    quote: "I asked for a website. I got a website, a QR code for my menu, and a very patient explanation of what a meta tag is. Two out of three have directly increased my sales. I'll let you guess which two.",
    author: "Maria C.",
    business: "Westborough Bakery",
    town: "Westborough, MA",
    initials: "MC",
    isPlaceholder: true,
  },
  {
    quote: "Customers actually find me on Google now. I used to think that was just for big chains with marketing departments. Turns out the internet works for everyone, including barbershops on Route 9.",
    author: "Dave K.",
    business: "Dave's Barbershop",
    town: "Northborough, MA",
    initials: "DK",
    isPlaceholder: true,
  },
  {
    quote: "He came in, looked around the shop, and actually understood what we do. I've had web designers quote me $8,000 who couldn't explain what a hair salon was. This was not that.",
    author: "Linda T.",
    business: "The Pressed Bloom",
    town: "Shrewsbury, MA",
    initials: "LT",
    isPlaceholder: true,
  },
  {
    quote: "The site was live in under a week. My previous web guy took four months and then sent me a PDF of a screenshot. I genuinely wish I was making that up.",
    author: "Ray F.",
    business: "Framingham Framing Co.",
    town: "Framingham, MA",
    initials: "RF",
    isPlaceholder: true,
  },
] as const;

// ─── Arcade ───────────────────────────────────────────────────────────────────
// Three thirty-second games. Each one is a sales argument wearing a costume.
export const ARCADE = {
  label: "The Route 9 Arcade",
  heading: "Play the games.\nLearn the trade.",
  subhead:
    "Three tiny games, thirty seconds each. Every one is secretly a lesson about why some shop websites bring in customers and some just sit there. That's the deal: you have fun, I make a point.",
  games: [
    {
      key: "speed",
      title: "The 3-Second Test",
      tagline: "How long do customers really wait?",
      lesson:
        "You were staring at the screen, waiting for it — and it still took you a moment. A real customer gives your site about 3 seconds before they hit back and call your competitor. Every site I build loads in under 2 seconds.",
      pillar: "Speed",
    },
    {
      key: "bugs",
      title: "Bug Squash",
      tagline: "Keep the site alive for 25 seconds.",
      lesson:
        "Exhausting, right? Broken links, expired certificates, plugin updates — every website collects bugs. The care plan means I'm the one holding the flyswatter: 24/7 uptime monitoring and same-day fixes, so your customers never meet a single one.",
      pillar: "Maintainable",
    },
    {
      key: "stacker",
      title: "Storefront Stacker",
      tagline: "Build a shop site in the right order.",
      lesson:
        "There is a right order, and nobody teaches it to shop owners — customers just quietly leave when it's wrong. Name first, phone number where a thumb can reach it, menu before the glamour shots. That's the hidden curriculum of web design.",
      pillar: "Built to convert",
    },
  ],
  footnote:
    "Yes — the games are a sales pitch. The good websites always are. They just make you glad you played.",
} as const;

// ─── Design Lens ──────────────────────────────────────────────────────────────
// The hidden-curriculum overlay. Meta levels:
//   1 — the site demonstrates the craft it sells
//   2 — the annotation reveals the trick while the trick is working on you
//   3 — the annotation about the annotations
export const DESIGN_LENS = {
  toggleLabel: "Design Lens",
  intro:
    "X-ray mode. Every page like this one is full of quiet decisions doing quiet work. The numbered pins show you mine — while they're working on you.",
  outro:
    "One more thing: this lens is also a trick. Showing you my tricks makes you trust me with yours — and now that I've told you that, we're three layers deep. That's the hidden curriculum: on a good website, every honest thing is also doing a job.",
  notes: [
    {
      target: "hero",
      title: "The first three seconds",
      body:
        "Six words in the headline, one glowing button, and a finished example site already cycling on the right. It rotates through three shops because you were always going to wait for the one that looks like yours. And if you typed your shop's name in — that wasn't a form. That was a fitting room.",
      meta: 2,
    },
    {
      target: "who",
      title: "Mirror, not megaphone",
      body:
        "This section is about you, not me — your shop, your town, your customers. The oldest rule in the curriculum: people don't buy from the loudest voice, they buy from the best listener.",
      meta: 1,
    },
    {
      target: "scene-gallery",
      title: "Patience, on display",
      body:
        "A hundred-plus hand-built scenes that serve no business purpose at all — except one: proving that the person who made this will sweat the details on your site too. It's a portfolio disguised as decoration.",
      meta: 2,
    },
    {
      target: "pillars",
      title: "The demo is the pitch",
      body:
        "The speed demo up there isn't explaining fast — it's making you feel the difference between fast and slow. Show, don't tell. That's the entire hidden curriculum in four words.",
      meta: 2,
    },
    {
      target: "pricing",
      title: "Anchoring, admitted",
      body:
        "Three tiers, middle one glowing. You looked at Pro first — everyone does. Restaurants do this on menus too. Second layer: telling you this and still charging it is a transparency play, and transparency converts.",
      meta: 2,
    },
    {
      target: "maintenance",
      title: "Naming the fear",
      body:
        "Every question here is one you had but weren't going to say out loud — 'what if he disappears?', 'what if I want out?'. Answering the unspoken objection beats hoping you wouldn't think of it.",
      meta: 1,
    },
    {
      target: "before-after",
      title: "Dragged out of 2009",
      body:
        "You laughed at the old site because you've seen it — maybe you own it. The slider isn't a comparison, it's a mirror with a handle: it makes your hand do the upgrading, so your gut gets there before your budget does.",
      meta: 2,
    },
    {
      target: "roi",
      title: "Your numbers, my pencil",
      body:
        "The most persuasive copy on this page wasn't written by me — you just set it with three sliders. A calculator converts because nobody argues with their own arithmetic. (The honest footnote is doing work too: hedging a claim makes the claim believable.)",
      meta: 3,
    },
    {
      target: "arcade",
      title: "You're being taught",
      body:
        "Each game is one of my sales arguments wearing a costume. Fun is the best delivery mechanism ever invented for a pitch — you're reading this pin, aren't you?",
      meta: 2,
    },
    {
      target: "neighborhood",
      title: "Faces before facts",
      body:
        "Six strangers smiling at their work, and the page suddenly feels trustworthy. Humans rate pages with faces as warmer and more credible before reading a single word — which is why every good local site leads with the person, not the product. One more: open a different tab for a second, then look at this one's title.",
      meta: 3,
    },
    {
      target: "portfolio",
      title: "The honest empty shelf",
      body:
        "'Coming soon' instead of fake client logos. A weakness stated plainly reads as strength. Besides — you're scrolling the real portfolio right now. It's this site.",
      meta: 2,
    },
    {
      target: "testimonials",
      title: "Full disclosure",
      body:
        "These quotes are placeholders until the first clients ship — it says so right in the code. Here's the lesson: social proof works so well that even sample social proof made this page feel safer. You felt it. That's why I'm telling you.",
      meta: 3,
    },
    {
      target: "process",
      title: "Shrinking the risk",
      body:
        "Four steps, the first one free, a working preview before any money moves. Every step exists to shrink the scariest question — 'what if I waste money?' — down to a 20-minute coffee.",
      meta: 1,
    },
    {
      target: "about",
      title: "The 'I'm a person' section",
      body:
        "One person, a real town, and an honest note about using AI tools. Specificity is credibility — vague bios hide things, specific ones don't have to.",
      meta: 1,
    },
    {
      target: "contact",
      title: "One field short of annoying",
      body:
        "The form asks for the bare minimum. Every extra field costs roughly a tenth of your submissions. And the button tells you what happens next — 'Submit' is a word for court filings, not for neighbors.",
      meta: 1,
    },
  ],
} as const;

// ─── About ────────────────────────────────────────────────────────────────────
export const ABOUT = {
  paragraphs: [
    "Route 9 Web is a one-person web design practice based in Shrewsbury, Massachusetts — right on the Route 9 corridor between Worcester and the Pike. Built by a developer with years of experience shipping software, now focused on the thing independent shops actually need: websites that work in 2026 instead of looking like they were made in 2014.",
    "I'm not an agency. There's no salesperson, no account manager, and no markup for fancy office space. Just real work, done locally, by someone who lives here.",
  ],
  aiNote:
    "I build with modern tools, including AI-assisted development. Every site is still custom-designed, reviewed line by line, and tested by hand. You're hiring a person, not a prompt.",
  moreLinkText: "More of my work →",
} as const;
