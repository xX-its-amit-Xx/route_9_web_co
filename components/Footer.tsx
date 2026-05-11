import { SITE, ABOUT } from "@/lib/content";

export function Footer() {
  const year = SITE.founded;

  return (
    <footer className="border-t border-border-subtle bg-surface py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: brand + built-in */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-accent text-accent-fg text-[10px] font-bold select-none">
                R9
              </span>
              <span className="text-sm font-semibold text-fg">{SITE.name}</span>
            </div>
            <p className="text-xs text-muted">
              © {year} {SITE.name} · Built in {SITE.location}
            </p>
          </div>

          {/* Right: links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            {SITE.personalSite !== "PLACEHOLDER_PERSONAL_SITE" && (
              <a
                href={SITE.personalSite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors duration-150"
              >
                {ABOUT.moreLinkText}
              </a>
            )}
            {SITE.github !== "PLACEHOLDER_GITHUB_REPO" && (
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg transition-colors duration-150"
              >
                Site code on GitHub →
              </a>
            )}
            <span className="text-muted-light">MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
