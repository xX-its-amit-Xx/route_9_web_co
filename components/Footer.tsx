import { SITE, ABOUT } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-[#081510] border-t border-[rgba(77,201,112,0.08)] py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: brand */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#4DC970] text-[#0D2118] text-[11px] font-extrabold select-none"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                R9
              </span>
              <span className="text-sm font-semibold text-[#F0E8D0]">{SITE.name}</span>
            </div>
            <p className="text-xs text-[#87A891]">
              © {SITE.founded} {SITE.name} · Built in {SITE.location}
            </p>
          </div>

          {/* Right: links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#87A891]">
            {SITE.personalSite !== "PLACEHOLDER_PERSONAL_SITE" && (
              <a
                href={SITE.personalSite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F0E8D0] transition-colors duration-150"
              >
                {ABOUT.moreLinkText}
              </a>
            )}
            {SITE.github !== "PLACEHOLDER_GITHUB_REPO" && (
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F0E8D0] transition-colors duration-150"
              >
                Site code on GitHub →
              </a>
            )}
            <span className="text-[#87A891]/50">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
