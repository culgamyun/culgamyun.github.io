# 이창한 포트폴리오

작은 제품과 개발 도구를 직접 설계하고 구현해 온 과정을 정리한 Next.js 기반 포트폴리오입니다.

## 공개 페이지

[https://culgamyun.github.io](https://culgamyun.github.io)

## 실행

```bash
npm install
npm run dev
```

로컬 개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 주요 파일

- `src/app/page.tsx`: 포트폴리오 진입점
- `src/components/portfolio-page.tsx`: 해시 기반 SPA UI, 갤러리, 상세 페이지
- `src/components/portfolio-chat.tsx`: 브라우저에서 동작하는 포트폴리오 챗봇
- `src/lib/portfolio-knowledge.ts`: 프로젝트 데이터 검색과 답변 생성
- `src/data/apps.ts`: 6개 프로젝트의 공개 포트폴리오 데이터
- `.github/workflows/deploy-pages.yml`: GitHub Pages 정적 배포 워크플로

## 검증

```bash
npm run lint
npm run build
```

`npm run build`가 완료되면 GitHub Pages에 배포할 정적 파일이 `out` 디렉터리에 생성됩니다.
