import type { ReactElement } from "react";
import { animated, useTrail } from "@react-spring/web";
import { useKeyboard } from "../hooks/useKeyboard";
import { sfx } from "../audio/beep";
import {
  profile,
  skills,
  projects,
  experience,
  education,
  contact,
} from "../config/content";
import "./SectionPanel.css";

interface SectionPanelProps {
  sectionId: string;
  onClose: () => void;
}

function AboutBody() {
  return (
    <>
      <p className="section-panel__body">{profile.about}</p>
      <div className="section-panel__location">📍 {profile.location}</div>
      <div className="section-panel__education">
        <div className="section-panel__education-heading">EDUCATION</div>
        {education.map((entry) => (
          <div className="education-row" key={entry.school}>
            <div className="education-row__header">
              <span>{entry.school}</span>
              <span>{entry.year}</span>
            </div>
            <div className="education-row__detail">{entry.detail}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsBody() {
  const trail = useTrail(skills.length, {
    from: { scale: 0 },
    to: { scale: 1 },
    config: { tension: 120, friction: 20 },
  });

  return (
    <div>
      {skills.map((skill, i) => (
        <div className="skill-row" key={skill.name}>
          <div className="skill-row__label">
            <span>{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="skill-row__track">
            <animated.div
              className="skill-row__fill"
              style={{
                width: `${skill.level}%`,
                opacity: trail[i].scale,
                transform: trail[i].scale.to((s) => `scaleX(${s})`),
                transformOrigin: "left center",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceBody() {
  const trail = useTrail(experience.length, {
    from: { opacity: 0, transform: "translateY(16px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 180, friction: 20 },
  });

  return (
    <div>
      {trail.map((style, i) => {
        const job = experience[i];
        return (
          <animated.div className="experience-card" style={style} key={job.company}>
            <div className="experience-card__header">
              <span className="experience-card__role">{job.role}</span>
              <span className="experience-card__period">{job.period}</span>
            </div>
            <div className="experience-card__company">{job.company}</div>
            <ul className="experience-card__highlights">
              {job.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </animated.div>
        );
      })}
    </div>
  );
}

function ProjectsBody() {
  const trail = useTrail(projects.length, {
    from: { opacity: 0, transform: "translateY(16px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 180, friction: 20 },
  });

  return (
    <div>
      {trail.map((style, i) => {
        const project = projects[i];
        return (
          <animated.div className="project-card" style={style} key={project.title}>
            <div className="project-card__title">{project.title}</div>
            <div className="project-card__desc">{project.description}</div>
            <div className="project-card__tags">
              {project.tags.map((tag) => (
                <span className="project-card__tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <a
              className="project-card__link"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.select()}
            >
              PLAY ▶
            </a>
          </animated.div>
        );
      })}
    </div>
  );
}

function ContactBody() {
  const items = [
    { label: "EMAIL", href: `mailto:${contact.email}`, value: contact.email },
    { label: "GITHUB", href: contact.github, value: "→" },
    { label: "LINKEDIN", href: contact.linkedin, value: "→" },
    { label: "RESUME", href: contact.resume, value: "→" },
  ];

  const trail = useTrail(items.length, {
    from: { opacity: 0, transform: "translateX(-16px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { tension: 200, friction: 18 },
  });

  return (
    <div className="contact-list">
      {trail.map((style, i) => (
        <animated.a
          key={items[i].label}
          className="contact-list__item"
          style={style}
          href={items[i].href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sfx.select()}
        >
          <span>{items[i].label}</span>
          <span>{items[i].value}</span>
        </animated.a>
      ))}
    </div>
  );
}

const SECTIONS: Record<string, { title: string; Body: () => ReactElement }> = {
  about: { title: "📜 ANCIENT CHRONICLE", Body: AboutBody },
  skills: { title: "💎 TREASURY OF SKILLS", Body: SkillsBody },
  experience: { title: "🏛 HALLS OF EXPERIENCE", Body: ExperienceBody },
  projects: { title: "🗡 CHAMBER OF QUESTS", Body: ProjectsBody },
  contact: { title: "🕌 THE PALACE GATES", Body: ContactBody },
};

export function SectionPanel({ sectionId, onClose }: SectionPanelProps) {
  const section = SECTIONS[sectionId];

  useKeyboard({
    Escape: () => {
      sfx.back();
      onClose();
    },
  });

  if (!section) return null;
  const { title, Body } = section;

  return (
    <div className="section-overlay" onClick={onClose}>
      <div className="section-panel" onClick={(e) => e.stopPropagation()}>
        <div className="section-panel__title">{title}</div>
        <Body />
        <div className="section-panel__hint">ESC TO RETURN TO MAP</div>
      </div>
    </div>
  );
}
