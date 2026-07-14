// ---------------------------------------------------------------------------
// EDIT THIS FILE to personalize the game with your real info.
// Nothing else in src/ needs to change to update your content.
// ---------------------------------------------------------------------------

export interface Skill {
  name: string;
  level: number; // 0-100, drawn as a retro power meter
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface EducationEntry {
  school: string;
  year: string;
  detail: string;
}

export interface NavNode {
  id: string;
  label: string;
  icon: string; // emoji used as a pixel-ish glyph on the map
}

export const profile = {
  name: "ASHISH KUMAR SINGH",
  role: "SOFTWARE ENGINEER | LLMS & GENAI APPLICATIONS",
  tagline: "PRESS START TO BEGIN THE ADVENTURE",
  bootText: "LOADING CAREER.SAV ...",
  about:
    "A versatile full-stack engineer skilled in JavaScript, Node.js, React, Ruby on Rails, Java, and MongoDB. " +
    "Shipped multi-tenant architectures, integrated the Google Maps API, and led standout builds like an " +
    "interactive periodic table and a Women's Day puzzle experience at BYJU's. Currently deep in legacy systems " +
    "and Burning Glass integrations at Cadient Talent — always chasing the next complex problem worth solving.",
  location: "BHAGALPUR, INDIA",
};

export const skills: Skill[] = [
  { name: "JavaScript", level: 92 },
  { name: "Java", level: 85 },
  { name: "React", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Express.js", level: 80 },
  { name: "MongoDB", level: 78 },
  { name: "Ruby on Rails", level: 72 },
  { name: "REST APIs", level: 85 },
  { name: "AWS", level: 65 },
  { name: "MySQL", level: 68 },
];

export const projects: Project[] = [
  {
    title: "ECOMMERCE PLATFORM",
    description:
      "Architected a microservices eCommerce platform; cut API response times from ~500ms to ~50ms with Redis caching and sped up product discovery 40% with Elasticsearch.",
    tags: ["Node.js", "Redis", "Elasticsearch"],
    link: "https://github.com/Ashish567/Ecommerce",
  },
  {
    title: "ENTERPRISE ATS & BURNING GLASS INTEGRATION",
    description:
      "Enhanced a multi-tenant ATS platform with Burning Glass resume-job matching, REST/HornetQ messaging, and Java/JSP UI upgrades for enterprise clients.",
    tags: ["Java", "JSP", "REST", "HornetQ"],
    link: "https://github.com/Ashish567",
  },
  {
    title: "SCALABLE LINKEDIN OUTREACH AUTOMATION",
    description:
      "Built a Dockerized, multi-instance outreach system with Puppeteer scraping and a VNC-based dashboard to monitor parallel automation agents in real time.",
    tags: ["Docker", "Puppeteer", "Automation"],
    link: "https://github.com/Ashish567",
  },
  {
    title: "IMPLEMENTING DRM SYSTEMS",
    description:
      "Integrated DRM playback with Shaka Player for secure MPD/DASH streaming, improving playback performance by 20%.",
    tags: ["Shaka Player", "DRM", "JavaScript"],
    link: "https://github.com/Ashish567",
  },
  {
    title: "INTERACTIVE PERIODIC TABLE",
    description:
      "Engineered an interactive periodic table at BYJU's that boosted user engagement 30% through richer element info and streamlined UX.",
    tags: ["React", "UX"],
    link: "https://github.com/Ashish567",
  },
  {
    title: "WOMEN'S DAY PUZZLE MODULE",
    description:
      "Led front-end development of a Women's Day puzzle experience, lifting engagement 30% and satisfaction 40% across 500+ users.",
    tags: ["React", "UX"],
    link: "https://github.com/Ashish567",
  },
  {
    title: "EMAIL OUTREACH AUTOMATION",
    description:
      "Automated bulk email campaigns with Google Apps Script — dynamic templating, lead-sheet parsing, and scheduled sends.",
    tags: ["Google Apps Script", "Automation"],
    link: "https://github.com/Ashish567",
  },
];

export const experience: Experience[] = [
  {
    role: "SOFTWARE ENGINEER",
    company: "Cadient Talent LLP",
    period: "Mar 2025 - Present",
    highlights: [
      "Modernized the UI layer (JSP/JavaScript/CSS) and Java plugin layer of a legacy multi-tenant ATS platform.",
      "Built Burning Glass integrations: job posting indexing, resume-job matching, top-candidate retrieval.",
      "Designed sync (REST) and async (HornetQ) communication between ATS and Burning Glass servers.",
    ],
  },
  {
    role: "SOFTWARE ENGINEER",
    company: "ScalarHub Technologies Pvt. Ltd.",
    period: "Jul 2024 - Jan 2025",
    highlights: [
      "Built frontend with React and backend APIs with Ruby on Rails.",
      "Architected component-level UI for a multi-tenant product.",
    ],
  },
  {
    role: "FULLSTACK ENGINEER",
    company: "Think & Learn Pvt. Ltd. (BYJU's)",
    period: "Jan 2022 - Feb 2023",
    highlights: [
      "Enhanced Node and MongoDB API modules with new functionality.",
      "Built optimized React + TypeScript components with modern hooks, improving render performance.",
      "Integrated OpenLayers, Shaka Player, and Google Analytics for data viz and tracking.",
      "Led the interactive periodic table and DRM player projects end-to-end.",
    ],
  },
  {
    role: "JAVASCRIPT DEVELOPER",
    company: "Zillion Analytics",
    period: "Aug 2019 - Jan 2022",
    highlights: [
      "Built and maintained high-performance web apps with JavaScript, HTML, and CSS.",
      "Spearheaded a G Suite ERP for SME business owners, lifting operational efficiency 40%.",
      "Maintained 99.9% uptime while integrating third-party libraries and APIs.",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    school: "Scaler",
    year: "2024",
    detail: "Specialized in Software Development & Problem Solving",
  },
  {
    school: "Maulana Abul Kalam Azad University of Technology",
    year: "2015",
    detail: "BE / B.Tech / BS — 7.54 CGPA",
  },
];

export const contact = {
  email: "djdaydreamer.singh4@gmail.com",
  github: "https://github.com/Ashish567",
  linkedin: "#",
  resume: "#",
};

// Order matters: this is the left-to-right / node-to-node sequence on the
// overworld map, and also the path the avatar walks along.
export const navNodes: NavNode[] = [
  { id: "about", label: "ABOUT", icon: "📜" },
  { id: "skills", label: "SKILLS", icon: "💎" },
  { id: "experience", label: "EXPERIENCE", icon: "🏛" },
  { id: "projects", label: "PROJECTS", icon: "🗡" },
  { id: "contact", label: "CONTACT", icon: "🕌" },
];
