import { apps } from "@/data/apps";

export type PortfolioChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type PortfolioChatSource = {
  id: string;
  title: string;
  kind: string;
  href?: string;
};

export type PortfolioChatResponse = {
  answer: string;
  sources: PortfolioChatSource[];
  suggestions: string[];
};

type KnowledgeItem = {
  id: string;
  title: string;
  kind: string;
  href?: string;
  tags: string[];
  body: string;
};

const strategyDocs: KnowledgeItem[] = [
  {
    id: "strategy-ai",
    title: "AI 활용 방식",
    kind: "strategy",
    tags: ["ai", "workflow", "자동화", "llm", "rag", "작업 방식"],
    body: [
      "AI는 반복 작업을 줄이고 여러 안을 빠르게 비교하기 위한 도구로 사용했습니다.",
      "문구 초안, 요약, 체크리스트, 테스트 관점 확장처럼 속도를 높일 수 있는 작업에 주로 활용했습니다.",
      "문제 정의, 우선순위, 민감한 표현, 최종 배포 판단은 직접 확인하는 흐름을 유지했습니다.",
    ].join(" "),
  },
  {
    id: "strategy-scope",
    title: "작업 범위",
    kind: "strategy",
    tags: ["mvp", "scope", "build", "빠른", "7일", "짧은", "제품"],
    body: [
      "처음부터 큰 제품을 만들기보다, 작게라도 실제로 써 볼 수 있는 범위를 먼저 정했습니다.",
      "각 프로젝트는 문제 정의, 핵심 화면, 데이터 흐름, 배포 전 확인 항목을 함께 남기는 방식으로 진행했습니다.",
    ].join(" "),
  },
  {
    id: "strategy-positioning",
    title: "포트폴리오 방향",
    kind: "strategy",
    tags: ["portfolio", "positioning", "소개", "개발자", "포지션"],
    body: [
      "이 포트폴리오는 AI를 활용해 작은 제품과 개발 도구를 직접 설계하고 구현해 온 과정을 보여줍니다.",
      "보여주려는 부분은 화려한 소개보다, 실제로 어떤 문제를 정리했고 어디까지 만들어 봤는지입니다.",
    ].join(" "),
  },
  {
    id: "process",
    title: "작업 과정",
    kind: "process",
    tags: ["process", "과정", "검증", "qa", "배포", "협업"],
    body: [
      "작업은 문제 정리, 핵심 흐름 설계, 데이터 구조 확인, 구현, 기본 테스트, 배포 전 확인 순서로 진행했습니다.",
      "필요한 기능과 나중에 해도 되는 기능을 나누고, AI가 도울 부분과 직접 검토할 부분을 분리했습니다.",
    ].join(" "),
  },
];

const appDocs: KnowledgeItem[] = apps.map((app) => ({
  id: app.no,
  title: app.name,
  kind: "project",
  href: `#/work/${app.no}`,
  tags: [
    app.name.toLowerCase(),
    app.category.toLowerCase(),
    app.status,
    app.year,
    ...app.stack.map((stack) => stack.toLowerCase()),
  ],
  body: [
    app.summary,
    app.longSummary,
    app.role,
    app.aiUse.join(" "),
    app.process.map((item) => item.text).join(" "),
  ].join(" "),
}));

const knowledge = [...appDocs, ...strategyDocs];

const defaultSuggestions = [
  "AI는 어디에 활용했나요?",
  "DeployPilot은 어떤 프로젝트인가요?",
  "짧은 기간에 만든 프로젝트가 있나요?",
  "BuildRoom과 DeployPilot은 어떻게 다른가요?",
];

const stopwords = new Set([
  "the",
  "and",
  "for",
  "with",
  "what",
  "where",
  "how",
  "about",
  "프로젝트",
  "설명",
  "알려줘",
  "무엇",
  "어떤",
  "어디",
  "있나요",
  "했나요",
  "해줘",
  "인가요",
  "관련",
]);

const tokenize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s#/-]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopwords.has(token));

const scoreItem = (item: KnowledgeItem, queryTokens: string[]) => {
  const haystack = `${item.title} ${item.kind} ${item.tags.join(" ")} ${item.body}`.toLowerCase();
  return queryTokens.reduce((score, token) => {
    if (item.title.toLowerCase().includes(token)) return score + 6;
    if (item.tags.some((tag) => tag.includes(token))) return score + 4;
    if (haystack.includes(token)) return score + 2;
    return score;
  }, 0);
};

const findRelevant = (query: string) => {
  const tokens = tokenize(query);
  const scored = knowledge
    .map((item) => ({ item, score: scoreItem(item, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    tokens,
    items: scored.map(({ item }) => item),
  };
};

const toSources = (items: KnowledgeItem[]): PortfolioChatSource[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    kind: item.kind,
    href: item.href,
  }));

const findApp = (items: KnowledgeItem[]) => {
  const project = items.find((item) => item.kind === "project");
  return apps.find((app) => app.no === project?.id);
};

const answerAiQuestion = (items: KnowledgeItem[], query: string) => {
  const normalized = query.toLowerCase();
  const app = apps.find((candidate) => normalized.includes(candidate.name.toLowerCase()));

  if (app) {
    return `${app.name}에서는 ${app.aiUse.join(" ")} 이 포트폴리오에서 보여주려는 부분은 AI를 많이 썼다는 사실보다, 어떤 작업에 활용했고 어떤 부분은 직접 확인했는지입니다.`;
  }

  return [
    "AI는 반복 작업을 줄이고 여러 안을 빠르게 비교하기 위한 도구로 사용했습니다.",
    "주로 문구 초안, 요약, 체크리스트, 테스트 관점 확장에 활용했고, 문제 정의와 최종 판단은 직접 확인했습니다.",
  ].join(" ");
};

const answerFastCycleQuestion = () =>
  [
    "짧은 기간에 만든 프로젝트들은 처음부터 큰 범위를 잡지 않았습니다.",
    "핵심 화면, 데이터 흐름, 배포 전 확인 항목을 먼저 정하고 작게라도 실제로 써 볼 수 있는 버전을 만드는 방식으로 진행했습니다.",
    "이 흐름은 Lyt, BuildRoom, DeployPilot에서 특히 잘 드러납니다.",
  ].join(" ");

const answerComparison = () =>
  [
    "BuildRoom과 DeployPilot은 모두 내부 도구지만 쓰임이 다릅니다.",
    "BuildRoom은 작업이 끝난 뒤 문제, 역할, 결과를 포트폴리오 케이스로 정리하는 도구입니다.",
    "DeployPilot은 배포 직전에 변경 사항, 테스트 결과, 확인 항목을 한 화면에서 보는 도구입니다.",
  ].join(" ");

const formatProjectAnswer = (appId: string) => {
  const app = apps.find((candidate) => candidate.no === appId);
  if (!app) return "";

  return [
    `${app.name}은 ${app.summary}`,
    app.longSummary,
    `제가 맡은 부분은 ${app.role}`,
    `현재 상태는 ${app.status}이며, 핵심 지표는 ${app.metrics
      .map(([label, value]) => `${label} ${value}`)
      .join(", ")}입니다.`,
    `AI 활용: ${app.aiUse.join(" ")}`,
  ].join(" ");
};

const buildAnswer = (query: string, items: KnowledgeItem[]) => {
  const normalized = query.toLowerCase();

  if (/(ai|llm|rag|자동화|인공지능|활용)/i.test(normalized)) {
    return answerAiQuestion(items, query);
  }

  if (/(7일|짧|빠른|mvp|기간|일주일)/i.test(normalized)) {
    return answerFastCycleQuestion();
  }

  if (/(buildroom|deploypilot|비교|차이)/i.test(normalized)) {
    return answerComparison();
  }

  const app = findApp(items);
  if (app) return formatProjectAnswer(app.no);

  const strategy = items.find((item) => item.kind !== "project");
  if (strategy) return strategy.body;

  return [
    "현재 공개된 포트폴리오 데이터에서는 이 질문에 답할 근거가 충분하지 않습니다.",
    "프로젝트 이름, AI 활용 방식, 작업 과정처럼 포트폴리오에 공개된 범위로 질문해 주시면 더 정확히 답변드릴 수 있습니다.",
  ].join(" ");
};

export function answerPortfolioQuestion(messages: PortfolioChatMessage[]): PortfolioChatResponse {
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  const { items } = findRelevant(latestUserMessage);
  return {
    answer: buildAnswer(latestUserMessage, items),
    sources: toSources(items),
    suggestions: defaultSuggestions,
  };
}
