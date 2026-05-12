import { SITE, ABOUT } from "@/lib/content";

export function Footer() {
  return (
    <footer
      className="border-t border-[rgba(212,104,42,0.1)] py-10"
      style={{ background: "#0B0705" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: brand */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#D4682A] text-[#FEFBF5] text-[11px] font-extrabold select-none"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                R9
              </span>
              <span className="text-sm font-semibold text-[#F3E9D5]">{SITE.name}</span>
            </div>
            <p className="text-xs text-[#9B8C7D]">
              © {SITE.founded} {SITE.name} · Built in {SITE.location}
            </p>
          </div>

          {/* Right: links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#9B8C7D]">
            {SITE.personalSite !== "PLACEHOLDER_PERSONAL_SITE" && (
              <a
                href={SITE.personalSite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3E9D5] transition-colors duration-150"
              >
                {ABOUT.moreLinkText}
              </a>
            )}
            {SITE.github !== "PLACEHOLDER_GITHUB_REPO" && (
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3E9D5] transition-colors duration-150"
              >
                Site code on GitHub →
              </a>
            )}
            <span className="text-[#9B8C7D]/50">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
