import type { ReactNode } from "react";

export type GalleryFilter = "ALL" | "PRODUCT" | "SYSTEM";
export type GalleryMode = "ledger" | "cards" | "wall";
export type HeroVariant = "default" | "ai" | "ship";
export type SortMode = "recent" | "alpha" | "impact";
export type AiTier = "deep" | "medium" | "light";
export type StatusTone = "live" | "wip" | "quiet";
export type VisualType = "marketplace" | "mobile" | "assistant" | "analytics" | "terminal" | "pipeline";

export type PortfolioApp = {
  no: string;
  name: string;
  year: string;
  category: Exclude<GalleryFilter, "ALL">;
  categoryColor: string;
  status: string;
  statusTone: StatusTone;
  duration: string;
  stack: string[];
  role: string;
  summary: string;
  longSummary: string;
  primaryMetric: string;
  metrics: Array<[string, string]>;
  process: Array<{ day: string; text: string }>;
  aiUse: string[];
  aiTier: AiTier;
  visual: VisualType;
};

export const galleryFilters: GalleryFilter[] = ["ALL", "PRODUCT", "SYSTEM"];

export const heroCopies: Record<
  HeroVariant,
  { eyebrow: string; title: [ReactNode, ReactNode]; body: string }
> = {
  default: {
    eyebrow: "작은 제품을 직접 설계하고 구현해 온 기록입니다.",
    title: ["아이디어를", "작동하는 화면으로 옮깁니다."],
    body: "문제 정의부터 화면, 데이터, 배포까지 직접 다뤄 보며 만든 프로젝트들을 정리했습니다. 빠른 구현보다 실제로 써 볼 수 있는 흐름을 중요하게 봅니다.",
  },
  ai: {
    eyebrow: "AI는 반복 작업을 줄이고 비교를 빠르게 하기 위한 도구로 사용했습니다.",
    title: ["AI를 활용해", "작업 속도와 검토 범위를 넓혔습니다."],
    body: "프로젝트마다 AI를 어디에 썼고, 어떤 부분은 직접 검토했는지 함께 적었습니다. 자동화 자체보다 작업 과정에서 무엇을 확인했는지를 보여주려 합니다.",
  },
  ship: {
    eyebrow: "짧게 만들고 실제 사용 흐름으로 확인했습니다.",
    title: ["작게 만들고", "다시 고쳐 왔습니다."],
    body: "처음부터 큰 기능을 쌓기보다, 필요한 범위를 정해 만들고 사용 흐름을 확인했습니다. 이 포트폴리오는 그 과정과 결과를 모은 기록입니다.",
  },
};

export const apps: PortfolioApp[] = [
  {
    no: "001",
    name: "Lyt",
    year: "2025",
    category: "PRODUCT",
    categoryColor: "#111827",
    status: "launched",
    statusTone: "live",
    duration: "6 weeks",
    stack: ["Next.js", "TypeScript", "Supabase", "Stripe", "AI copy"],
    role: "product / frontend / data / payment",
    summary: "브랜드와 크리에이터의 협업 과정을 정리하는 마켓플레이스입니다.",
    longSummary:
      "캠페인 등록, 제안, 수락, 결제 흐름을 하나로 이어 보며 실제 출시까지 진행한 프로젝트입니다. 단순한 매칭보다 협업 조건과 운영 흐름을 명확하게 만드는 데 초점을 두었습니다.",
    primaryMetric: "5 flows",
    metrics: [
      ["Build", "6w"],
      ["Flows", "5"],
      ["Status", "Live"],
    ],
    process: [
      { day: "D01", text: "캠페인 생성부터 결제 확인까지 필요한 상태를 먼저 정리했습니다." },
      { day: "D03", text: "브랜드와 크리에이터가 각각 확인해야 하는 정보를 분리했습니다." },
      { day: "D06", text: "결제와 제안 흐름은 짧은 QA 목록으로 반복 확인했습니다." },
    ],
    aiUse: [
      "캠페인 문구 초안과 제안서 비교에 AI를 사용했습니다.",
      "운영 체크리스트를 빠르게 정리하는 데 활용했습니다.",
      "가격, 정책, 최종 화면 문구는 직접 확인했습니다.",
    ],
    aiTier: "deep",
    visual: "marketplace",
  },
  {
    no: "002",
    name: "ScriptureMind",
    year: "2026",
    category: "PRODUCT",
    categoryColor: "#365314",
    status: "prototype",
    statusTone: "wip",
    duration: "4 weeks",
    stack: ["React Native", "Expo", "TypeScript", "Local storage", "AI prompts"],
    role: "mobile product / routine model / ux writing",
    summary: "묵상과 성경 기억 루틴을 돕는 모바일 제품입니다.",
    longSummary:
      "짧은 묵상 기록, 암송 카드, 반복 알림을 한 흐름으로 묶은 앱입니다. 사용자가 부담 없이 돌아올 수 있도록 기능 수보다 루틴의 지속성을 우선해 설계했습니다.",
    primaryMetric: "daily loop",
    metrics: [
      ["Loop", "Daily"],
      ["Cards", "3"],
      ["Scope", "MVP"],
    ],
    process: [
      { day: "D01", text: "하루에 완료할 수 있는 최소 행동을 먼저 정했습니다." },
      { day: "D04", text: "묵상, 암송, 회고가 서로 끊기지 않도록 기록 구조를 맞췄습니다." },
      { day: "D07", text: "알림보다 사용자가 다시 열고 싶은 화면 흐름을 우선했습니다." },
    ],
    aiUse: [
      "묵상 질문의 초안과 카드 문구를 빠르게 비교하는 데 AI를 사용했습니다.",
      "반복 루틴에 맞는 문장 길이와 톤을 검토했습니다.",
      "신학적 표현과 사용자에게 보이는 문장은 직접 확인했습니다.",
    ],
    aiTier: "medium",
    visual: "mobile",
  },
  {
    no: "003",
    name: "SoloSync",
    year: "2026",
    category: "PRODUCT",
    categoryColor: "#7c2d12",
    status: "concept",
    statusTone: "quiet",
    duration: "2 weeks",
    stack: ["Next.js", "TypeScript", "Prisma", "AI planning"],
    role: "problem framing / flow / prototype",
    summary: "혼자 있는 시간을 실제 관계 행동으로 이어 주는 도구입니다.",
    longSummary:
      "감정 기록에서 끝나지 않고, 메시지 보내기나 약속 잡기처럼 작은 관계 행동으로 이어지도록 설계한 컨셉 제품입니다.",
    primaryMetric: "4 cards",
    metrics: [
      ["Focus", "Action"],
      ["Stage", "Concept"],
      ["Cards", "4"],
    ],
    process: [
      { day: "D01", text: "감정 기록과 관계 행동을 별도 단계로 나누어 살펴봤습니다." },
      { day: "D02", text: "불필요한 분석 표현을 줄이고 선택 가능한 행동 카드로 바꿨습니다." },
      { day: "D05", text: "위험한 조언처럼 보일 수 있는 문장은 안내 문구에서 제외했습니다." },
    ],
    aiUse: [
      "사용자 상황별 행동 후보를 넓게 뽑고 비교하는 데 AI를 사용했습니다.",
      "민감한 표현과 권장 행동은 직접 줄였습니다.",
      "감정 분석보다 오늘 할 수 있는 행동을 보여주는 방향으로 조정했습니다.",
    ],
    aiTier: "medium",
    visual: "assistant",
  },
  {
    no: "004",
    name: "TypeFlow",
    year: "2026",
    category: "PRODUCT",
    categoryColor: "#1e40af",
    status: "prototype",
    statusTone: "wip",
    duration: "3 weeks",
    stack: ["Next.js", "TypeScript", "Zustand", "Framer Motion"],
    role: "task model / board ui / interaction",
    summary: "성향 라벨보다 실행 패턴을 기준으로 일을 정리하는 task 도구입니다.",
    longSummary:
      "사용자를 고정된 유형으로 분류하기보다, 어떤 조건에서 일이 잘 진행되는지 기록하고 다음 작업 선택에 반영하는 도구입니다.",
    primaryMetric: "6 patterns",
    metrics: [
      ["Views", "3"],
      ["Patterns", "6"],
      ["Stage", "Beta"],
    ],
    process: [
      { day: "D01", text: "작업 입력, 분류, 회고 흐름을 한 보드 안에서 이어지게 만들었습니다." },
      { day: "D03", text: "패턴 문구가 사용자를 단정하지 않도록 표현을 조정했습니다." },
      { day: "D06", text: "필터와 카드 이동이 모바일에서도 무너지지 않게 확인했습니다." },
    ],
    aiUse: [
      "작업 기록을 요약하고 패턴 후보를 찾는 데 AI를 사용했습니다.",
      "분류 기준을 비교해 화면에 남길 항목을 줄였습니다.",
      "실제 표시 방식과 최종 문구는 직접 조정했습니다.",
    ],
    aiTier: "light",
    visual: "analytics",
  },
  {
    no: "005",
    name: "BuildRoom",
    year: "2026",
    category: "SYSTEM",
    categoryColor: "#334155",
    status: "internal",
    statusTone: "quiet",
    duration: "2 weeks",
    stack: ["Next.js", "MDX", "GitHub", "AI summary"],
    role: "ops tool / content system / case format",
    summary: "작업 로그와 결과물을 포트폴리오 케이스로 정리하는 도구입니다.",
    longSummary:
      "만든 기능, 남긴 기록, 배운 점을 흩어지지 않게 모아 케이스 스터디 형태로 정리하는 내부 도구입니다.",
    primaryMetric: "12 docs",
    metrics: [
      ["Docs", "12"],
      ["Use", "Internal"],
      ["Format", "Case"],
    ],
    process: [
      { day: "D01", text: "프로젝트별로 문제, 역할, 결과, 배운 점을 같은 순서로 정리했습니다." },
      { day: "D02", text: "AI 요약은 초안으로만 쓰고 공개 문장은 직접 다듬었습니다." },
      { day: "D04", text: "포트폴리오에 보여 줄 수 있는 정보만 남기는 기준을 세웠습니다." },
    ],
    aiUse: [
      "커밋 기록과 작업 메모를 요약해 초안을 만드는 데 AI를 사용했습니다.",
      "반복되는 케이스 스터디 구조를 빠르게 비교했습니다.",
      "공개할 내용과 민감한 내용의 구분은 직접 했습니다.",
    ],
    aiTier: "deep",
    visual: "terminal",
  },
  {
    no: "006",
    name: "DeployPilot",
    year: "2026",
    category: "SYSTEM",
    categoryColor: "#0f766e",
    status: "internal",
    statusTone: "wip",
    duration: "1 week",
    stack: ["Next.js", "Vercel", "GitHub Actions", "Playwright"],
    role: "release checklist / qa view / deploy flow",
    summary: "배포 전 변경 사항과 테스트 결과를 한곳에서 확인하는 도구입니다.",
    longSummary:
      "작은 프로젝트에서도 배포 전 확인해야 할 항목이 흩어지지 않도록, 변경 내용과 기본 점검 결과를 한 화면에 모으는 도구입니다.",
    primaryMetric: "8 checks",
    metrics: [
      ["Checks", "8"],
      ["Target", "Vercel"],
      ["Stage", "Tool"],
    ],
    process: [
      { day: "D01", text: "배포 전 꼭 확인해야 하는 항목과 있으면 좋은 항목을 나눴습니다." },
      { day: "D02", text: "테스트 결과, 변경 요약, 링크를 한 화면에서 확인하도록 구성했습니다." },
      { day: "D05", text: "자동화 결과가 있어도 최종 확인은 사람이 하도록 흐름을 남겼습니다." },
    ],
    aiUse: [
      "변경 사항 요약과 점검 항목 초안을 만드는 데 AI를 사용했습니다.",
      "기본 테스트 관점을 빠르게 넓히는 데 활용했습니다.",
      "실제 배포 여부와 위험 판단은 직접 확인하도록 설계했습니다.",
    ],
    aiTier: "deep",
    visual: "pipeline",
  },
];
