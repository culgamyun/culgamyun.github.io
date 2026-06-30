# 이창한의 프로젝트

작은 제품과 개발 도구를 직접 설계하고 구현하고 있습니다.

이 저장소는 프로젝트마다 해결하려던 문제, 맡은 역할, 작업 과정과 AI 활용 방식을 모아 보여주는 포트폴리오 사이트입니다.

**[포트폴리오 보기](https://culgamyun.github.io/)**

## 프로젝트

| 프로젝트 | 소개 | 상태 |
| --- | --- | --- |
| [Lyt](https://culgamyun.github.io/#/work/001) | 브랜드와 크리에이터의 협업 과정을 정리하는 마켓플레이스 | 출시 |
| [ScriptureMind](https://culgamyun.github.io/#/work/002) | 묵상과 성경 기억 루틴을 돕는 모바일 제품 | 프로토타입 |
| [SoloSync](https://culgamyun.github.io/#/work/003) | 혼자 있는 시간을 실제 관계 행동으로 이어 주는 도구 | 컨셉 |
| [TypeFlow](https://culgamyun.github.io/#/work/004) | 실행 패턴을 기준으로 일을 정리하는 task 도구 | 프로토타입 |
| [BuildRoom](https://culgamyun.github.io/#/work/005) | 작업 로그와 결과물을 포트폴리오 케이스로 정리하는 도구 | 내부 도구 |
| [DeployPilot](https://culgamyun.github.io/#/work/006) | 배포 전 변경 사항과 테스트 결과를 한곳에서 확인하는 도구 | 내부 도구 |

각 상세 페이지에는 다음 내용을 정리했습니다.

- 무엇을 만들었고 왜 만들었는지
- 직접 맡은 설계와 구현 범위
- 작업 과정과 현재 상태
- AI를 활용한 부분과 직접 검토한 부분

## 기술

`Next.js` · `TypeScript` · `React` · `Framer Motion`

포트폴리오 챗봇은 별도 서버 없이 공개된 프로젝트 데이터를 브라우저에서 검색해 답변합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:3000`입니다.

## 검증과 배포

```bash
npm run lint
npm run build
```

`main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 정적 사이트를 빌드해 GitHub Pages에 배포합니다.
