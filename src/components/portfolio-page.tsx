"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Code2, Command } from "lucide-react";
import { PortfolioChat } from "@/components/portfolio-chat";
import { FillMeter, RevealItem, ScrollReveal, StaggerReveal } from "@/components/motion-primitives";
import { RouteLoader } from "@/components/route-loader";
import type {
  GalleryFilter,
  GalleryMode,
  HeroVariant,
  PortfolioApp,
  SortMode,
} from "@/data/apps";
import { galleryFilters, heroCopies } from "@/data/apps";

type PortfolioPageProps = {
  apps: PortfolioApp[];
};

type Route =
  | { name: "index" }
  | { name: "detail"; no: string }
  | { name: "about" }
  | { name: "process" }
  | { name: "now" }
  | { name: "contact" };

const navItems: Array<{ id: Route["name"]; label: string; path: string }> = [
  { id: "index", label: "Index", path: "#/" },
  { id: "about", label: "About", path: "#/about" },
  { id: "process", label: "Process", path: "#/process" },
  { id: "now", label: "Now", path: "#/now" },
  { id: "contact", label: "Contact", path: "#/contact" },
];

const galleryModes: GalleryMode[] = ["ledger", "cards", "wall"];
const heroOrder: HeroVariant[] = ["default", "ai", "ship"];
const sortModes: SortMode[] = ["recent", "alpha", "impact"];

const tone = {
  paper: "#f7f6f2",
  paperAlt: "#efede6",
  ink: "#14201c",
  graphite: "#46534f",
  mute: "#7a857f",
  hair: "#e2dfd6",
};

function scrollToGallery() {
  const gallerySection = document.getElementById("gallery");
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  gallerySection?.scrollIntoView({ block: "start", behavior });
}

export function PortfolioPage({ apps: appList }: PortfolioPageProps) {
  const [route, setRoute] = useState<Route>({ name: "index" });
  const [hero, setHero] = useState<HeroVariant>("default");
  const [gallery, setGallery] = useState<GalleryMode>("ledger");
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [loading, setLoading] = useState(true);
  const loadTimerRef = useRef<number | null>(null);

  const startLoader = useCallback((duration = 620) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoading(false);
      return;
    }

    if (loadTimerRef.current) window.clearTimeout(loadTimerRef.current);
    setLoading(true);
    loadTimerRef.current = window.setTimeout(() => setLoading(false), duration);
  }, []);

  useEffect(() => {
    const syncHash = (withLoader = true) => {
      const rawHash = window.location.hash;

      if (rawHash === "#apps") {
        window.history.replaceState(null, "", "#gallery");
      }

      const nextRoute = parseHash(window.location.hash);
      setRoute(nextRoute);

      if (rawHash === "#apps" || window.location.hash === "#gallery") {
        window.requestAnimationFrame(() => scrollToGallery());
      } else if (window.location.hash.startsWith("#/")) {
        if (withLoader) startLoader(nextRoute.name === "detail" ? 760 : 560);
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
      }
    };

    syncHash(false);
    loadTimerRef.current = window.setTimeout(
      () => setLoading(false),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 760,
    );
    const onHashChange = () => syncHash(true);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (loadTimerRef.current) window.clearTimeout(loadTimerRef.current);
    };
  }, [startLoader]);

  const navigate = useCallback((path: string) => {
    const normalized = path.replace(/^#/, "");

    if (normalized === "gallery" || normalized === "apps") {
      window.location.hash = "gallery";
      window.requestAnimationFrame(() => scrollToGallery());
      return;
    }

    startLoader(normalized.startsWith("/work/") ? 760 : 560);
    window.location.hash = normalized;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [startLoader]);

  const cycleHero = useCallback(() => {
    setHero((current) => heroOrder[(heroOrder.indexOf(current) + 1) % heroOrder.length]);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (/^[1-6]$/.test(event.key)) {
        const app = appList[Number(event.key) - 1];
        if (app) navigate(`#/work/${app.no}`);
      }

      if (event.key.toLowerCase() === "g") {
        setGallery((current) => galleryModes[(galleryModes.indexOf(current) + 1) % galleryModes.length]);
        if (route.name !== "index") navigate("#/");
      }

      if (event.key.toLowerCase() === "h") cycleHero();
      if (event.key === "Escape" && route.name !== "index") navigate("#/");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appList, cycleHero, navigate, route.name]);

  return (
    <div className="paper-texture min-h-screen text-[var(--ink)]">
      <TopNav route={route} hero={hero} onCycleHero={cycleHero} onNavigate={navigate} />
      <div className="mx-auto max-w-[1280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name === "detail" ? `${route.name}-${route.no}` : route.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {route.name === "detail" ? (
              <DetailPage appList={appList} no={route.no} onNavigate={navigate} />
            ) : route.name === "about" ? (
              <AboutPage />
            ) : route.name === "process" ? (
              <ProcessPage />
            ) : route.name === "now" ? (
              <NowPage />
            ) : route.name === "contact" ? (
              <ContactPage />
            ) : (
              <IndexPage appList={appList} gallery={gallery} hero={hero} setGallery={setGallery} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <FooterStrip />
      <Shortcuts visible={showShortcuts} onToggle={() => setShowShortcuts((current) => !current)} />
      <PortfolioChat />
      <AnimatePresence>
        <RouteLoader active={loading} />
      </AnimatePresence>
    </div>
  );
}

function parseHash(hash: string): Route {
  const value = hash.replace(/^#/, "") || "/";
  const detail = value.match(/^\/work\/([\w-]+)/);

  if (detail) return { name: "detail", no: detail[1] };
  if (value === "/about") return { name: "about" };
  if (value === "/process") return { name: "process" };
  if (value === "/now") return { name: "now" };
  if (value === "/contact") return { name: "contact" };
  return { name: "index" };
}

function TopNav({
  route,
  hero,
  onCycleHero,
  onNavigate,
}: {
  route: Route;
  hero: HeroVariant;
  onCycleHero: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#f7f6f2]/95 backdrop-blur-md">
      <nav
        aria-label="주요 내비게이션"
        className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-5 py-3 md:px-9 lg:grid-cols-[260px_1fr_auto]"
      >
        <a
          href="#/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("#/");
          }}
          className="flex items-baseline gap-2 text-[var(--ink)] no-underline"
        >
          <span className="font-display text-[22px] font-medium">이창한</span>
          <span className="hidden font-code text-[10px] text-[var(--muted)] sm:inline">
            / LEE CHANG-HAN
          </span>
        </a>

        <div className="hidden justify-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = (item.id === "index" && route.name === "index") || item.id === route.name;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.path);
                }}
                className={`border-b px-3 py-2 font-code text-[11px] uppercase no-underline transition ${
                  isActive
                    ? "border-[var(--ink)] text-[var(--ink)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCycleHero}
            className="hidden h-8 items-center gap-2 border border-[var(--line)] bg-white px-3 font-code text-[10px] uppercase text-[var(--graphite)] transition hover:border-[var(--ink)] lg:inline-flex"
          >
            <Code2 aria-hidden="true" className="size-3" />
            Hero / {hero}
          </button>
          <a
            href="#/contact"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("#/contact");
            }}
            className="inline-flex h-8 items-center gap-2 bg-[var(--ink)] px-3 font-code text-[10px] uppercase text-[var(--paper)] no-underline"
          >
            <span className="size-1.5 rounded-full bg-[#5dd39e]" />
            Contact
          </a>
        </div>

        <div className="col-span-2 flex items-center gap-1 border-t border-[var(--line)] pt-3 lg:hidden">
          {[
            ["Work", "#gallery"],
            ["Process", "#/process"],
            ["Contact", "#/contact"],
          ].map(([label, path]) => (
            <a
              key={path}
              href={path}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(path);
              }}
              className="flex-1 border border-[var(--line)] bg-white px-3 py-2 text-center font-code text-[10px] uppercase text-[var(--ink)] no-underline"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function IndexPage({
  appList,
  gallery,
  hero,
  setGallery,
}: {
  appList: PortfolioApp[];
  gallery: GalleryMode;
  hero: HeroVariant;
  setGallery: (mode: GalleryMode) => void;
}) {
  const [filter, setFilter] = useState<GalleryFilter>("ALL");
  const [sort, setSort] = useState<SortMode>("recent");
  const [expanded, setExpanded] = useState<string | null>("006");

  const visibleApps = useMemo(() => {
    const result = filter === "ALL" ? appList.slice() : appList.filter((app) => app.category === filter);
    if (sort === "alpha") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "impact") result.sort((a, b) => b.primaryMetric.length - a.primaryMetric.length);
    return result;
  }, [appList, filter, sort]);

  return (
    <main>
      <Hero hero={hero} />
      <AiLayer appList={appList} />
      <section id="gallery" className="px-5 py-8 md:px-9">
        <ScrollReveal>
          <div className="mb-3 flex flex-col gap-3 border-t border-[var(--line)] pt-5 md:flex-row md:items-end md:justify-between">
            <Eyebrow index="02 / WORKS">만든 것들을 한곳에 정리했습니다.</Eyebrow>
            <span className="font-code text-[10px] uppercase text-[var(--muted)]">
              총 {appList.length}개 중 {visibleApps.length}개 표시
            </span>
          </div>
          <GalleryToolbar
            filter={filter}
            gallery={gallery}
            setFilter={setFilter}
            setGallery={setGallery}
            setSort={setSort}
            sort={sort}
          />
        </ScrollReveal>

        {gallery === "ledger" && (
          <GalleryLedger apps={visibleApps} expanded={expanded} setExpanded={setExpanded} />
        )}
        {gallery === "cards" && <GalleryCards apps={visibleApps} />}
        {gallery === "wall" && <GalleryWall apps={visibleApps} />}
      </section>
    </main>
  );
}

function Hero({ hero }: { hero: HeroVariant }) {
  const copy = heroCopies[hero];

  return (
    <section className="px-5 pb-10 pt-14 md:px-9 md:pb-14 md:pt-20">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
        <ScrollReveal className="lg:sticky lg:top-24 lg:self-start" y={8}>
          <Eyebrow index="00 / CONTEXT">작업 환경</Eyebrow>
          <div className="mt-5 border-y border-[var(--line)] py-4">
            <div className="grid gap-3 border-b border-dashed border-[var(--line-strong)] pb-4">
              <span className="font-code text-[10px] uppercase text-[var(--muted)]">거주지</span>
              <span className="font-display text-[26px] leading-none text-[var(--ink)]">Seoul, Korea</span>
            </div>
            <div className="grid gap-3 border-b border-dashed border-[var(--line-strong)] py-4">
              <span className="font-code text-[10px] uppercase text-[var(--muted)]">주요 기술</span>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js", "TypeScript", "React", "AI 활용"].map((item) => (
                  <span
                    key={item}
                    className="border border-[var(--line)] bg-white px-2 py-1 font-code text-[10px] uppercase text-[var(--graphite)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2 pt-4 font-code text-[10px] uppercase leading-6 text-[var(--graphite)]">
              <span>작업 / 제품과 개발 도구</span>
              <span>협업 / 필요한 범위를 정해 진행</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="font-code text-[11px] uppercase text-[var(--muted)]">{copy.eyebrow}</p>
          <h1 className="font-display korean-copy balanced-copy mt-4 max-w-[760px] text-[clamp(42px,10vw,64px)] font-medium leading-[1.05] text-[var(--ink)] sm:text-[clamp(62px,8vw,82px)] sm:leading-[1] lg:max-w-4xl lg:text-[clamp(74px,7vw,96px)] lg:leading-[0.98]">
            {copy.title[0]}
            <br />
            <span className="italic text-[var(--graphite)]">{copy.title[1]}</span>
          </h1>
          <p className="font-display korean-copy mt-6 max-w-2xl text-[19px] leading-8 text-[var(--ink-2)]">
            {copy.body}
          </p>
          <StatLine
            items={[
              ["BUILDS", "06"],
              ["PRODUCTS", "04"],
              ["SYSTEMS", "02"],
            ]}
          />
          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href="#gallery"
              onClick={(event) => {
                event.preventDefault();
                scrollToGallery();
              }}
              className="inline-flex items-center gap-2 bg-[var(--ink)] px-4 py-3 font-code text-[11px] uppercase text-[var(--paper)] no-underline"
            >
              Works / 06
              <ArrowRight aria-hidden="true" className="size-3" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function StatLine({ items }: { items: Array<[string, string]> }) {
  return (
    <StaggerReveal className="mt-7 grid grid-cols-2 border-y border-[var(--line)] md:grid-cols-3">
      {items.map(([label, value], index) => (
        <RevealItem key={label}>
          <div
            className={`p-4 ${
              index % 2 === 0 && index !== items.length - 1 ? "border-r" : ""
            } border-[var(--line)] md:border-r md:last:border-r-0`}
          >
            <div className="font-code text-[10px] uppercase text-[var(--muted)]">{label}</div>
            <div className="font-display mt-1 text-[28px] text-[var(--ink)]">{value}</div>
          </div>
        </RevealItem>
      ))}
    </StaggerReveal>
  );
}

function AiLayer({ appList }: { appList: PortfolioApp[] }) {
  return (
    <section className="px-5 py-7 md:px-9">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">
        <ScrollReveal>
          <Eyebrow index="01 / AI">AI 활용 방식</Eyebrow>
          <h2 className="font-display korean-copy balanced-copy mt-3 max-w-[360px] text-[30px] font-medium leading-[1.12] text-[var(--ink)] md:text-[34px] lg:text-[32px]">
            AI는 반복 작업을 줄이고 더 빨리 비교하기 위한 도구로 사용했습니다.
          </h2>
          <p className="font-display korean-copy mt-3 max-w-[420px] text-[15px] leading-7 text-[var(--graphite)]">
            초안 작성, 비교, 요약처럼 속도를 높일 수 있는 부분에 AI를 활용했습니다. 다만 제품 방향, 민감한 판단, 최종 구현은 직접 확인했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="border border-[var(--line)] bg-white">
            <div className="hidden grid-cols-[64px_1.3fr_0.8fr_1.5fr] border-b border-[var(--line)] px-4 py-3 font-code text-[10px] uppercase text-[var(--muted)] md:grid">
              <span>No.</span>
              <span>App</span>
              <span>Use</span>
              <span>Where</span>
            </div>
            {appList.map((app, index) => (
              <AiRow key={app.no} app={app} isLast={index === appList.length - 1} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function AiRow({ app, isLast }: { app: PortfolioApp; isLast: boolean }) {
  const tier = {
    deep: { label: "DEEP", width: "100%", color: "#0f766e" },
    medium: { label: "MEDIUM", width: "62%", color: "#b45309" },
    light: { label: "LIGHT", width: "34%", color: "#15803d" },
  }[app.aiTier];

  return (
    <div
      className={`grid gap-3 px-4 py-4 md:grid-cols-[64px_1.3fr_0.8fr_1.5fr] md:items-center ${
        isLast ? "" : "border-b border-[var(--line)]"
      }`}
    >
      <span className="font-code text-[12px] text-[var(--muted)]">{app.no}</span>
      <span className="flex items-center gap-3">
        <Dot color={app.categoryColor} />
        <span className="font-display text-[17px] text-[var(--ink)]">{app.name}</span>
      </span>
      <span className="grid grid-cols-[56px_auto] items-center gap-2">
        <FillMeter color={tier.color} width={tier.width} />
        <span className="font-code text-[10px] uppercase" style={{ color: tier.color }}>
          {tier.label}
        </span>
      </span>
      <span className="font-display korean-copy text-[15px] italic leading-6 text-[var(--graphite)]">
        {app.aiUse[0]}
      </span>
    </div>
  );
}

function GalleryToolbar({
  filter,
  gallery,
  setFilter,
  setGallery,
  setSort,
  sort,
}: {
  filter: GalleryFilter;
  gallery: GalleryMode;
  setFilter: (value: GalleryFilter) => void;
  setGallery: (value: GalleryMode) => void;
  setSort: (value: SortMode) => void;
  sort: SortMode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-[var(--line)] py-3">
      <ToolbarLabel>Filter</ToolbarLabel>
      {galleryFilters.map((item) => (
        <ToggleButton key={item} active={filter === item} onClick={() => setFilter(item)}>
          {item}
        </ToggleButton>
      ))}
      <Divider />
      <ToolbarLabel>Sort</ToolbarLabel>
      {sortModes.map((item) => (
        <ToggleButton key={item} active={sort === item} onClick={() => setSort(item)}>
          {item}
        </ToggleButton>
      ))}
      <span className="hidden flex-1 md:block" />
      <ToolbarLabel>View</ToolbarLabel>
      {galleryModes.map((item) => (
        <ToggleButton key={item} active={gallery === item} onClick={() => setGallery(item)}>
          {item}
        </ToggleButton>
      ))}
    </div>
  );
}

function GalleryLedger({
  apps,
  expanded,
  setExpanded,
}: {
  apps: PortfolioApp[];
  expanded: string | null;
  setExpanded: (value: string | null) => void;
}) {
  return (
    <StaggerReveal className="mt-3 border-t border-[var(--ink)]">
      {apps.map((app) => (
        <RevealItem key={app.no}>
          <LedgerRow
            app={app}
            expanded={expanded === app.no}
            onToggle={() => setExpanded(expanded === app.no ? null : app.no)}
          />
        </RevealItem>
      ))}
    </StaggerReveal>
  );
}

function LedgerRow({
  app,
  expanded,
  onToggle,
}: {
  app: PortfolioApp;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`border-b border-[var(--line)] ${expanded ? "bg-[var(--paper-alt)]" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full gap-3 px-4 py-4 text-left lg:grid-cols-[76px_76px_1fr_110px_130px_104px_24px] lg:items-center"
      >
        <span className="font-code text-[12px] text-[var(--muted)]">{app.no}</span>
        <span className="font-code text-[11px] text-[var(--graphite)]">{app.year}</span>
        <span>
          <span className="flex items-baseline gap-3">
            <Dot color={app.categoryColor} />
            <span className="font-display text-[26px] font-medium text-[var(--ink)]">{app.name}</span>
          </span>
          <span className="font-display korean-copy mt-1 block text-[15px] italic leading-6 text-[var(--graphite)]">
            {app.summary}
          </span>
        </span>
        <span className="font-code text-[11px] uppercase text-[var(--graphite)]">{app.category}</span>
        <span className="font-code text-[11px] text-[var(--graphite)]">{app.primaryMetric}</span>
        <Status app={app} />
        <span className="font-code text-lg text-[var(--muted)]">{expanded ? "-" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 border-t border-dashed border-[var(--line-strong)] px-4 pb-5 pt-4 lg:ml-[152px] lg:max-w-3xl lg:grid-cols-[1.4fr_1fr]">
              <p className="font-display korean-copy m-0 text-[16px] leading-7 text-[var(--ink-2)]">
                {app.longSummary}
              </p>
              <div className="font-code text-[10px] uppercase leading-6 text-[var(--graphite)]">
                Role / {app.role}
                <br />
                Stack / {app.stack.join(" / ")}
                <br />
                <a className="text-[var(--ink)] underline" href={`#/work/${app.no}`}>
                  Read case
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function GalleryCards({ apps }: { apps: PortfolioApp[] }) {
  return (
    <StaggerReveal className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {apps.map((app) => (
        <RevealItem key={app.no}>
          <a
            href={`#/work/${app.no}`}
            className="block overflow-hidden border border-[var(--line)] bg-white text-[var(--ink)] no-underline transition hover:-translate-y-1 hover:border-[var(--ink)]"
          >
            <ProductShot app={app} height={176} />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <span className="font-code text-[10px] text-[var(--muted)]">
                  {app.no} / {app.year}
                </span>
                <Dot color={app.categoryColor} size={6} />
                <span className="font-code text-[10px] uppercase text-[var(--graphite)]">
                  {app.category}
                </span>
              </div>
              <h3 className="font-display mt-3 text-[25px] font-medium">{app.name}</h3>
              <p className="font-display korean-copy mt-2 text-[15px] leading-6 text-[var(--graphite)]">
                {app.summary}
              </p>
              <div className="mt-4 flex justify-between border-t border-[var(--line)] pt-3 font-code text-[10px] uppercase text-[var(--graphite)]">
                <span>{app.primaryMetric}</span>
                <Status app={app} />
              </div>
            </div>
          </a>
        </RevealItem>
      ))}
    </StaggerReveal>
  );
}

function GalleryWall({ apps }: { apps: PortfolioApp[] }) {
  return (
    <StaggerReveal className="mt-6 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-12">
      {apps.map((app, index) => (
        <RevealItem key={app.no} className="md:col-span-6">
          <a
            href={`#/work/${app.no}`}
            className="flex h-full flex-col overflow-hidden border border-[var(--line)] bg-white text-[var(--ink)] no-underline"
            style={{
              gridColumn:
                index === 0 ? "span 8" : index === 1 ? "span 4" : index === 2 ? "span 5" : "span 6",
              gridRow: index === 0 ? "span 2" : "span 1",
            }}
          >
            <div className="relative min-h-0 flex-1">
              <ProductShot app={app} height="100%" />
              <span className="absolute left-3 top-3 bg-[var(--paper)] px-2 py-1 font-code text-[10px] text-[var(--ink)]">
                {app.no}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] px-4 py-3">
              <span className="flex items-center gap-3">
                <Dot color={app.categoryColor} />
                <span className="font-display text-[19px]">{app.name}</span>
              </span>
              <span className="font-code text-[10px] text-[var(--graphite)]">{app.primaryMetric}</span>
            </div>
          </a>
        </RevealItem>
      ))}
    </StaggerReveal>
  );
}

function DetailPage({
  appList,
  no,
  onNavigate,
}: {
  appList: PortfolioApp[];
  no: string;
  onNavigate: (path: string) => void;
}) {
  const index = Math.max(appList.findIndex((app) => app.no === no), 0);
  const app = appList[index] ?? appList[0];
  const previous = appList[(index - 1 + appList.length) % appList.length];
  const next = appList[(index + 1) % appList.length];

  return (
    <main className="px-5 py-8 md:px-9">
      <div className="flex flex-wrap justify-between gap-3 border-b border-[var(--line)] pb-4 font-code text-[11px] uppercase text-[var(--muted)]">
        <a
          href="#/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("#/");
          }}
          className="text-[var(--graphite)] no-underline"
        >
          Index / <span className="text-[var(--ink)]">Work / {app.no}</span>
        </a>
        <span className="flex gap-4">
          <a className="text-[var(--graphite)] no-underline" href={`#/work/${previous.no}`}>
            Prev {previous.no}
          </a>
          <a className="text-[var(--graphite)] no-underline" href={`#/work/${next.no}`}>
            Next {next.no}
          </a>
        </span>
      </div>

      <ScrollReveal>
        <header className="grid gap-8 border-b border-[var(--line)] py-10 lg:grid-cols-[280px_1fr] lg:items-end">
          <aside>
            <Eyebrow index={`${app.no} / ${app.category.toUpperCase()}`}>
              {app.year} / {app.status}
            </Eyebrow>
            <div className="font-code mt-4 text-[11px] uppercase leading-7 text-[var(--graphite)]">
              Role / {app.role}
              <br />
              Cycle / {app.duration}
              <br />
              Stack / {app.stack.slice(0, 3).join(" / ")}
            </div>
          </aside>
          <div>
            <h1 className="font-display korean-copy balanced-copy text-[clamp(46px,12vw,62px)] font-medium leading-[1.02] text-[var(--ink)] md:text-[clamp(64px,7vw,88px)] md:leading-none">
              {app.name}
            </h1>
            <p className="font-display korean-copy mt-5 max-w-2xl text-[19px] italic leading-8 text-[var(--ink-2)]">
              {app.longSummary}
            </p>
          </div>
        </header>
      </ScrollReveal>

      <ScrollReveal className="mt-7">
        <MiniChrome app={app} />
      </ScrollReveal>

      <SplitSection index="01 / METRICS" title="Numbers">
        <StaggerReveal className="grid border border-[var(--line)] bg-white md:grid-cols-3">
          {app.metrics.map(([label, value], metricIndex) => (
            <RevealItem key={label}>
              <div
                className={`p-5 ${metricIndex < app.metrics.length - 1 ? "border-b md:border-b-0 md:border-r" : ""} border-[var(--line)]`}
              >
                <div className="font-code text-[10px] uppercase text-[var(--muted)]">{label}</div>
                <div className="font-display mt-2 text-[38px] text-[var(--ink)]">{value}</div>
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </SplitSection>

      <SplitSection index="02 / PROCESS" title="작업 과정">
        <StaggerReveal>
          {app.process.map((item, itemIndex) => (
            <RevealItem key={`${item.day}-${item.text}`}>
              <div
                className={`grid gap-3 py-4 md:grid-cols-[82px_1fr] ${itemIndex < app.process.length - 1 ? "border-b border-[var(--line)]" : ""}`}
              >
                <span className="font-code text-[11px] text-[var(--graphite)]">{item.day}</span>
                <span className="font-display korean-copy text-[18px] leading-7 text-[var(--ink-2)]">
                  {item.text}
                </span>
              </div>
            </RevealItem>
          ))}
        </StaggerReveal>
      </SplitSection>

      <SplitSection index="03 / AI" title="AI를 활용한 부분">
        <ul className="m-0 list-none p-0">
          {app.aiUse.map((item, itemIndex) => (
            <li
              key={item}
              className={`flex gap-4 py-3 ${itemIndex < app.aiUse.length - 1 ? "border-b border-dashed border-[var(--line-strong)]" : ""}`}
            >
              <span className="font-code shrink-0 text-[10px] text-[var(--muted)]">
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <span className="font-display korean-copy text-[17px] leading-7 text-[var(--ink-2)]">{item}</span>
            </li>
          ))}
        </ul>
      </SplitSection>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        {[previous, next].map((item, itemIndex) => (
          <a
            key={item.no}
            href={`#/work/${item.no}`}
            className="border border-[var(--line)] bg-white p-5 text-[var(--ink)] no-underline transition hover:border-[var(--ink)]"
          >
            <span className="font-code text-[10px] uppercase text-[var(--muted)]">
              {itemIndex === 0 ? "Previous" : "Next"}
            </span>
            <span className="mt-3 flex items-center gap-3">
              <Dot color={item.categoryColor} />
              <span className="font-display text-[26px]">
                {item.no} / {item.name}
              </span>
            </span>
            <span className="font-display korean-copy mt-2 block text-[15px] italic leading-6 text-[var(--graphite)]">
              {item.summary}
            </span>
          </a>
        ))}
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <StaticPage
      eyebrow="A / ABOUT"
      title={
        <>
          작은 제품을 직접 만들고 <span className="italic text-[var(--graphite)]">개선해 왔습니다.</span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[280px_1fr_1fr] lg:gap-12">
        <div>
          <PortraitBlock />
          <div className="font-code mt-4 text-[10px] uppercase leading-6 text-[var(--muted)]">
            Based / Seoul
            <br />
            Focus / AI-assisted products
            <br />
            Strength / product + implementation
          </div>
        </div>
        <div>
          <p className="font-display korean-copy m-0 text-[24px] leading-9 text-[var(--ink)]">
            저는 아이디어를 화면, 데이터, 배포까지 직접 이어 보며 제품을 만들어 왔습니다.
          </p>
          <p className="font-display korean-copy mt-5 text-[17px] leading-8 text-[var(--graphite)]">
            AI는 반복 작업을 줄이고 빠르게 비교하기 위한 도구로 사용합니다. 문제 정의, 우선순위, 출시 전 확인은 직접 판단하려고 합니다.
          </p>
        </div>
        <div>
          <LedgerList
            title="Kept"
            items={[
              ["작게라도 실제로 써 볼 수 있는 흐름", "always"],
              ["AI를 사용한 부분과 직접 검토한 부분", "always"],
              ["화면, 데이터, 배포까지 이어지는 구현", "often"],
              ["작업 과정을 기록으로 남기는 습관", "often"],
            ]}
          />
          <LedgerList
            title="Dropped"
            items={[
              ["보여주기 위한 기능 추가", "2025"],
              ["근거가 약한 AI 강조", "2025"],
              ["사용 흐름 없이 데모만 반복하기", "2026"],
            ]}
          />
        </div>
      </div>
    </StaticPage>
  );
}

function ProcessPage() {
  const beats = [
    ["D01", "A.M.", "사용자가 겪는 문제를 먼저 정리합니다."],
    ["D02", "P.M.", "첫 화면에서 해야 할 일을 하나로 좁힙니다."],
    ["D03", "A.M.", "데이터 구조와 권한 범위를 먼저 잡습니다."],
    ["D04", "P.M.", "필요한 기능과 나중에 해도 되는 기능을 나눕니다."],
    ["D05", "A.M.", "AI가 도울 부분과 직접 검토할 부분을 분리합니다."],
    ["D06", "P.M.", "빌드와 기본 테스트로 출시 전 문제를 줄입니다."],
    ["D07", "ALL", "작동하는 버전과 다음에 확인할 질문을 함께 남깁니다."],
  ];

  return (
    <StaticPage
      eyebrow="P / PROCESS"
      title={
        <>
          작은 범위로 만들고 <span className="italic text-[var(--graphite)]">확인해 왔습니다.</span>
        </>
      }
    >
      <StaggerReveal>
        {beats.map(([day, time, text], index) => (
          <RevealItem key={`${day}-${text}`}>
            <div className="grid gap-3 border-b border-[var(--line)] py-5 md:grid-cols-[100px_90px_1fr_80px] md:items-baseline">
              <span className="font-code text-[14px] text-[var(--ink)]">{day}</span>
              <span className="font-code text-[11px] text-[var(--muted)]">{time}</span>
              <span className="font-display korean-copy text-[24px] text-[var(--ink-2)]">{text}</span>
              <span className="font-code text-[10px] text-[var(--graphite)] md:text-right">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </RevealItem>
        ))}
      </StaggerReveal>
      <blockquote className="mt-10 border border-[var(--ink)] bg-[var(--ink)] p-7 text-[var(--paper)]">
        <div className="font-code text-[10px] uppercase text-[#a8b3af]">Rule of thumb</div>
        <p className="font-display korean-copy mt-2 text-[30px] leading-10">
          작게라도 실제로 써 볼 수 있어야 다음 판단을 할 수 있다고 생각합니다.
        </p>
      </blockquote>
    </StaticPage>
  );
}

function NowPage() {
  return (
    <StaticPage
      eyebrow="N / NOW"
      title={
        <>
          지금은 몇 가지 제품과 <span className="italic text-[var(--graphite)]">개발 도구를 함께 다듬고 있습니다.</span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[var(--line)] bg-white">
          {[
            ["BUILDING", "ScriptureMind / 조용한 루틴 제품", "002"],
            ["SHAPING", "SoloSync / 실제 관계 행동을 돕는 도구", "003"],
            ["FRAMING", "TypeFlow / 실행 패턴 기반 task 도구", "004"],
            ["TOOLING", "BuildRoom + DeployPilot / 작업 기록과 배포 확인", "005-006"],
            ["AVAIL.", "필요한 범위가 분명한 협업", "OPEN"],
          ].map(([label, text, no], index) => (
            <div
              key={label}
              className={`grid gap-2 px-5 py-4 md:grid-cols-[120px_1fr_72px] ${index < 4 ? "border-b border-[var(--line)]" : ""}`}
            >
              <span className="font-code text-[10px] text-[var(--muted)]">{label}</span>
              <span className="font-display korean-copy text-[18px] text-[var(--ink)]">{text}</span>
              <span className="font-code text-[10px] text-[var(--graphite)] md:text-right">{no}</span>
            </div>
          ))}
        </div>
        <CalendarBlock />
      </div>
    </StaticPage>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <StaticPage
      eyebrow="C / CONTACT"
      title={
        <>
          함께 이야기해 보고 싶은 <span className="italic text-[var(--graphite)]">제품이나 작업이 있다면 연락 주세요.</span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div className="font-code text-[11px] uppercase leading-7 text-[var(--graphite)]">
          Email / hi@example.com
          <br />
          GitHub / changhanl
          <br />
          Location / Seoul
          <p className="font-code mt-5 border-t border-[var(--line)] pt-4 text-[10px] normal-case leading-6 text-[var(--muted)]">
            현재 폼은 화면 동작을 보여주기 위한 데모입니다. 실제 연락처와 전송 API는 배포 전 연결하면 됩니다.
          </p>
        </div>
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSent(true);
          }}
          className="border border-[var(--line)] bg-white p-7"
        >
          {sent ? (
            <div>
              <Eyebrow index="OK / SENT">Thank you</Eyebrow>
              <p className="font-display korean-copy mt-4 text-[24px] leading-9 text-[var(--ink)]">
                메시지 형식이 확인되었습니다. 실제 전송은 배포 전 API로 연결하면 됩니다.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 border border-[var(--line)] bg-[var(--paper)] px-4 py-3 font-code text-[11px] uppercase text-[var(--ink)]"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <FormField label="Who you are" placeholder="이름 / 역할 / 회사" />
              <FormField label="One line" placeholder="어떤 제품이나 작업을 이야기해 보고 싶나요?" />
              <FormField label="Link / optional" placeholder="현재 상태를 볼 수 있는 URL" />
              <button
                type="submit"
                className="mt-2 bg-[var(--ink)] px-5 py-3 font-code text-[11px] uppercase text-[var(--paper)]"
              >
                Send / Enter
              </button>
            </>
          )}
        </form>
      </div>
    </StaticPage>
  );
}

function StaticPage({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: ReactNode;
}) {
  return (
    <main className="px-5 py-12 md:px-9">
      <ScrollReveal>
        <header className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-end lg:gap-12">
          <Eyebrow index={eyebrow}>{eyebrow.includes("/") ? eyebrow.split("/").at(-1) : eyebrow}</Eyebrow>
          <h1 className="font-display korean-copy balanced-copy m-0 text-[clamp(38px,10vw,52px)] font-medium leading-[1.04] text-[var(--ink)] md:text-[clamp(58px,6vw,78px)] md:leading-[1]">
            {title}
          </h1>
        </header>
      </ScrollReveal>
      <ScrollReveal className="mt-10 border-t border-[var(--line)] pt-8">{children}</ScrollReveal>
    </main>
  );
}

function ProductShot({ app, height }: { app: PortfolioApp; height: number | string }) {
  const style = {
    "--shot-color": app.categoryColor,
    height: typeof height === "number" ? `${height}px` : height,
  } as CSSProperties;

  return (
    <div
      className="relative overflow-hidden border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--shot-color)_10%,var(--paper))]"
      style={style}
    >
      <div className="absolute inset-3 border border-[var(--line)] bg-white/85 shadow-[0_20px_60px_rgba(20,32,28,0.06)] sm:inset-4">
        <div className="flex h-8 items-center gap-1.5 border-b border-[var(--line)] bg-[var(--paper-alt)]/80 px-3">
          <span className="size-2 rounded-full bg-[#be123c]" />
          <span className="size-2 rounded-full bg-[#d9a300]" />
          <span className="size-2 rounded-full bg-[#65a30d]" />
          <span className="ml-3 truncate font-code text-[10px] text-[var(--muted)]">
            {app.name.toLowerCase().replace(/\s+/g, "")}.app
          </span>
          <span className="ml-auto font-code text-[10px] text-[var(--muted)]">{app.status}</span>
        </div>
        <div className="h-[calc(100%-2rem)] p-4">
          <ProductVisual app={app} />
        </div>
      </div>
    </div>
  );
}

function ProductVisual({ app }: { app: PortfolioApp }) {
  if (app.visual === "terminal") {
    return (
      <div className="h-full bg-[var(--ink)] p-4 font-code text-[11px] leading-6 text-[#a7f3d0]">
        $ buildroom export
        <br />
        decisions ... indexed
        <br />
        screenshots . attached
        <br />
        case ...... ready
      </div>
    );
  }

  if (app.visual === "mobile") {
    return (
      <div className="mx-auto h-full w-28 rounded-[20px] border-4 border-[var(--ink)] bg-white p-3">
        <span className="mx-auto mb-3 block h-1 w-8 rounded-full bg-[var(--ink)]" />
        <ShotLine width="76%" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="h-10 bg-[var(--paper-alt)]" />
          <span className="h-10" style={{ backgroundColor: `${app.categoryColor}40` }} />
        </div>
        <span className="mt-3 block h-8" style={{ backgroundColor: app.categoryColor }} />
        <span className="mt-2 block h-5 bg-[var(--paper-alt)]" />
      </div>
    );
  }

  if (app.visual === "assistant") {
    return (
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <ShotLine width="88%" />
          <ShotLine width="74%" />
          <div className="mt-2 border border-[var(--line)] bg-[var(--paper)] p-2">
            <ShotLine width="62%" />
            <ShotLine width="92%" />
            <ShotLine width="70%" />
          </div>
        </div>
        <div className="grid min-w-0 grid-rows-3 gap-2">
          {["A", "B", "C"].map((label, index) => (
            <div key={label} className="flex items-center gap-2 border border-[var(--line)] bg-white px-2">
              <span
                className="grid size-6 place-items-center rounded-full font-code text-[10px] text-white"
                style={{ backgroundColor: app.categoryColor }}
              >
                {label}
              </span>
              <div className="min-w-0 flex-1">
                <ShotLine width={index === 1 ? "94%" : "78%"} />
                <ShotLine width={index === 2 ? "54%" : "64%"} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (app.visual === "pipeline") {
    return (
      <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-3">
        <div className="space-y-2">
          {["Lead", "Deal", "Paid", "Renew"].map((item, index) => (
            <div key={item} className="border border-[var(--line)] bg-[var(--paper)] p-2">
              <div className="font-code text-[9px] uppercase text-[var(--muted)]">{item}</div>
              <ShotLine width={`${62 + index * 7}%`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[68, 44, 82].map((heightValue, index) => (
            <div key={heightValue} className="flex flex-col justify-end border border-[var(--line)] bg-white p-2">
              <span
                className="block"
                style={{ height: `${heightValue}%`, backgroundColor: app.categoryColor, opacity: 0.3 + index * 0.18 }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (app.visual === "analytics") {
    return (
      <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
        <div className="grid grid-rows-[1fr_auto] gap-2">
          <div className="relative border border-[var(--line)] bg-[var(--paper)]">
            {[18, 34, 22, 48, 42, 64].map((top, index) => (
              <span
                key={top}
                className="absolute size-2 rounded-full"
                style={{ left: `${12 + index * 15}%`, top: `${top}%`, backgroundColor: app.categoryColor }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ShotMetric value="3" label="tasks" />
            <ShotMetric value="1m" label="review" />
            <ShotMetric value="7d" label="cycle" />
          </div>
        </div>
        <div className="space-y-2">
          {[92, 72, 50, 68].map((widthValue) => (
            <div key={widthValue} className="border border-[var(--line)] bg-white p-2">
              <ShotLine width={`${widthValue}%`} />
              <ShotLine width="56%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
      <div className="space-y-3">
        <div className="border border-[var(--line)] bg-[var(--paper)] p-3">
          <ShotLine width="84%" />
          <ShotLine width="66%" />
          <span className="mt-4 block h-8 w-28" style={{ backgroundColor: app.categoryColor }} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <span key={item} className="h-10 border border-[var(--line)] bg-white" />
          ))}
        </div>
      </div>
      <div className="border border-[var(--line)] bg-white p-3">
        <div className="font-code text-[9px] uppercase text-[var(--muted)]">readiness</div>
        {[84, 72, 94, 62].map((widthValue, index) => (
          <div key={widthValue} className="mt-3">
            <span
              className="block h-1.5"
              style={{ width: `${widthValue}%`, backgroundColor: app.categoryColor, opacity: 0.28 + index * 0.12 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShotLine({ width }: { width: string }) {
  return (
    <span
      className="mt-2 block h-2 bg-[color-mix(in_srgb,var(--shot-color)_22%,var(--paper-alt))]"
      style={{ width }}
    />
  );
}

function ShotMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--line)] bg-white p-2">
      <div className="font-display text-[18px] text-[var(--ink)]">{value}</div>
      <div className="font-code text-[8px] uppercase text-[var(--muted)]">{label}</div>
    </div>
  );
}

function MiniChrome({ app }: { app: PortfolioApp }) {
  return (
    <div className="overflow-hidden border border-[var(--line)] bg-white">
      <div className="flex h-8 items-center gap-2 border-b border-[var(--line)] bg-[var(--paper-alt)] px-3">
        <span className="size-2 rounded-full bg-[var(--line-strong)]" />
        <span className="size-2 rounded-full bg-[var(--line-strong)]" />
        <span className="size-2 rounded-full bg-[var(--line-strong)]" />
        <span className="ml-3 flex-1 font-code text-[10px] text-[var(--muted)]">
          {app.name.toLowerCase().replace(/\s+/g, "")}.app
        </span>
      </div>
      <ProductShot app={app} height={420} />
    </div>
  );
}

function SplitSection({
  children,
  index,
  title,
}: {
  children: ReactNode;
  index: string;
  title: string;
}) {
  return (
    <ScrollReveal>
      <section className="mt-12 grid gap-8 border-b border-[var(--line)] pb-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <Eyebrow index={index}>{title}</Eyebrow>
        {children}
      </section>
    </ScrollReveal>
  );
}

function FormField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="mb-4 block">
      <span className="font-code mb-2 block text-[10px] uppercase text-[var(--muted)]">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="font-display korean-copy w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-3 text-[17px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
      />
    </label>
  );
}

function CalendarBlock() {
  const openDays = new Set([9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26]);

  return (
    <div>
      <Eyebrow index="N.1">Calendar / May</Eyebrow>
      <div className="mt-4 border border-[var(--line)] bg-white p-4">
        <div className="grid grid-cols-7 gap-1 text-center font-code text-[10px] text-[var(--muted)]">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const isOpen = openDays.has(day);
            const isToday = day === 5;
            return (
              <div
                key={day}
                className="relative grid aspect-square place-items-center border font-code text-[12px]"
                style={{
                  borderColor: isToday ? tone.ink : tone.hair,
                  backgroundColor: isOpen ? tone.paper : "#fafaf6",
                  color: isOpen ? tone.ink : tone.mute,
                }}
              >
                {day}
                {isOpen ? <span className="absolute bottom-1 size-1 rounded-full bg-[#15803d]" /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LedgerList({ items, title }: { items: Array<[string, string]>; title: string }) {
  return (
    <div className="mb-7">
      <Eyebrow index={title.slice(0, 1)}>{title}</Eyebrow>
      <ul className="m-0 mt-3 list-none p-0">
        {items.map(([label, value]) => (
          <li
            key={label}
            className="flex justify-between gap-5 border-b border-dashed border-[var(--line-strong)] py-3"
          >
            <span className="font-display korean-copy text-[15px] text-[var(--ink)]">{label}</span>
            <span className="font-code shrink-0 text-[10px] uppercase text-[var(--graphite)]">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PortraitBlock() {
  return (
    <div className="grid aspect-square place-items-center border border-[var(--line)] bg-[var(--paper-alt)]">
      <div className="grid size-28 place-items-center rounded-full bg-[var(--ink)] font-display text-4xl text-[var(--paper)]">
        LC
      </div>
    </div>
  );
}

function ToolbarLabel({ children }: { children: ReactNode }) {
  return <span className="font-code text-[10px] uppercase text-[var(--muted)]">{children}</span>;
}

function ToggleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-code text-[10px] uppercase transition ${
        active
          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
          : "border-[var(--line)] bg-transparent text-[var(--graphite)] hover:border-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 hidden h-5 w-px bg-[var(--line)] sm:inline-block" />;
}

function Eyebrow({ children, index }: { children: ReactNode; index: string }) {
  return (
    <div className="flex items-center gap-3 font-code text-[11px] uppercase text-[var(--graphite)]">
      <span className="text-[var(--muted)]">{index}</span>
      <span className="h-px w-7 bg-[var(--line-strong)]" />
      <span>{children}</span>
    </div>
  );
}

function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, backgroundColor: color }} />;
}

function Status({ app }: { app: PortfolioApp }) {
  const color = app.statusTone === "live" ? "#15803d" : app.statusTone === "wip" ? "#b45309" : tone.mute;

  return (
    <span className="font-code text-[10px] uppercase" style={{ color }}>
      / {app.status}
    </span>
  );
}

function FooterStrip() {
  return (
    <footer className="mt-20 grid gap-4 border-t border-[var(--line)] px-5 py-7 font-code text-[11px] uppercase text-[var(--muted)] md:grid-cols-[1fr_auto_1fr] md:px-9">
      <span>2026 Lee Chang-Han / Seoul</span>
      <span className="text-[var(--graphite)]">제품과 개발 도구 / AI 활용 기록</span>
      <span className="md:text-right">hi@example.com / gh changhanl</span>
    </footer>
  );
}

function Shortcuts({ onToggle, visible }: { onToggle: () => void; visible: boolean }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 hidden max-w-[calc(100vw-9rem)] flex-wrap gap-2 sm:flex">
      {visible
        ? [
            ["1-6", "Jump"],
            ["G", "Gallery"],
            ["H", "Hero"],
            ["Esc", "Back"],
          ].map(([key, label]) => (
            <span
              key={key}
              className="hidden items-center gap-2 bg-[var(--ink)] px-2 py-1 font-code text-[9px] uppercase text-[var(--paper)] sm:inline-flex"
            >
              <span className="border border-white/30 px-1">{key}</span>
              {label}
            </span>
          ))
        : null}
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex size-8 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)]"
        aria-label={visible ? "단축키 안내 숨기기" : "단축키 안내 보이기"}
      >
        <Command aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
