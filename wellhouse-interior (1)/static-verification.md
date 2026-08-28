# 정적 전환 검증 기록

롤백 후 `client/src/main.tsx`는 React 클라이언트만 마운트하며, Home 페이지에는 서버·tRPC·OAuth 의존성이 없습니다. `package.json`은 `vite --host` 개발 서버와 정적 Vite 빌드 스크립트를 사용합니다.

`pnpm check`와 `pnpm build`가 성공했습니다. 데스크톱 1280px 화면에서는 기존 히어로·견적 폼·투명 헤더·포트폴리오 구성이 유지되었습니다. 모바일 390px 화면에서는 햄버거 메뉴, 히어로 카피, 견적 폼이 세로로 자연스럽게 배치되었습니다.
