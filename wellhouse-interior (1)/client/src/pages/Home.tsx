/* Quiet Atelier: asymmetrical editorial layout, warm neutrals, cocoa accents, restrained motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Check, Menu, MessageCircle, Phone, X } from "lucide-react";

const heroImages = [
  { src: "/manus-storage/wellhouse-hero-living_4bcf3645.jpg", label: "RESIDENTIAL / LIVING", title: "인천 검단 아파트 40평" },
  { src: "/manus-storage/wellhouse-kitchen_b8808787.jpg", label: "RESIDENTIAL / KITCHEN", title: "부평 오크 키친 리노베이션" },
  { src: "/manus-storage/wellhouse-hero-living_4bcf3645.jpg", label: "RESIDENTIAL / SIGNATURE", title: "송도 더블하이트 하우스" },
  { src: "/manus-storage/wellhouse-office_68441b52.jpg", label: "COMMERCIAL / OFFICE", title: "마곡 크리에이티브 오피스" },
  { src: "/manus-storage/wellhouse-cafe_4733c3aa.jpg", label: "COMMERCIAL / CAFE", title: "김포 장기동 카페" },
  { src: "/manus-storage/wellhouse-salon_ec6db7b2.jpg", label: "COMMERCIAL / SALON", title: "인천 원당 피부샵" },
  { src: "/manus-storage/wellhouse-hero-living_4bcf3645.jpg", label: "WELLHOUSE / PROJECT", title: "생활을 담은 공간" },
];

const projects = [
  { type: "residential", size: "40평대", image: "/manus-storage/wellhouse-hero-living_4bcf3645.jpg", location: "인천 서구 당하동", title: "힐스테이트 40평", desc: "주거 인테리어" },
  { type: "residential", size: "20평대", image: "/manus-storage/wellhouse-kitchen_b8808787.jpg", location: "부평구 산곡동", title: "오크 키친 리노베이션", desc: "주거 인테리어" },
  { type: "commercial", category: "사무실", image: "/manus-storage/wellhouse-office_68441b52.jpg", location: "서울 마곡동", title: "크리에이티브 오피스", desc: "상업 인테리어" },
  { type: "commercial", category: "음식점 · 카페", image: "/manus-storage/wellhouse-cafe_4733c3aa.jpg", location: "김포 장기동", title: "커피와 여백의 카페", desc: "상업 인테리어" },
  { type: "commercial", category: "미용샵", image: "/manus-storage/wellhouse-salon_ec6db7b2.jpg", location: "인천 서구 원당", title: "피부샵 리뉴얼", desc: "상업 인테리어" },
  { type: "residential", size: "60평대 이상", image: "/manus-storage/wellhouse-hero-living_4bcf3645.jpg", location: "인천 송도동", title: "더블하이트 하우스", desc: "주거 인테리어" },
];

const services = ["전체 인테리어", "부분 인테리어", "목공", "도배", "필름", "마루", "중문", "폴딩도어", "욕실", "주방", "조명", "수납 · 붙박이장"];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [space, setSpace] = useState("residential");
  const [compare, setCompare] = useState(53);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((s) => (s + 1) % heroImages.length), 5000);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  const visibleProjects = useMemo(() => projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "residential") return p.type === "residential" && (subFilter === "all" || p.size === subFilter);
    return p.type === "commercial" && (subFilter === "all" || p.category === subFilter);
  }), [filter, subFilter]);

  const setMainFilter = (value: string) => { setFilter(value); setSubFilter("all"); };
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return <div className="site-shell">
    <header className={`site-header ${scrolled ? "header-light" : "header-dark"}`}>
      <button className="brand" onClick={() => scrollTo("top")} aria-label="웰하우스인테리어 홈"><img src="/manus-storage/wellhouse-logo-color_44cbc7e1.png" alt="" /><span><b>WELLHOUSE INTERIOR</b><small>웰하우스 인테리어</small></span></button>
      <nav className="desktop-nav"><button onClick={() => scrollTo("about")}>회사소개</button><button onClick={() => scrollTo("residential")}>주거 인테리어</button><button onClick={() => scrollTo("commercial")}>상업 인테리어</button><button onClick={() => scrollTo("projects")}>시공 사례</button><button onClick={() => scrollTo("contact")}>견적 문의</button></nav>
      <a className="header-phone" href="tel:010-6552-4063"><Phone size={17} /><span>상담문의: 010-6552-4063</span></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴 열기">{menuOpen ? <X /> : <Menu />}</button>
    </header>
    {menuOpen && <div className="mobile-menu"><button onClick={() => scrollTo("about")}>회사소개</button><button onClick={() => scrollTo("residential")}>주거 인테리어</button><button onClick={() => scrollTo("commercial")}>상업 인테리어</button><button onClick={() => scrollTo("projects")}>시공 사례</button><button onClick={() => scrollTo("contact")}>견적 문의</button></div>}

    <main id="top">
      <section className="hero">
        {heroImages.map((image, index) => <div key={image.src + index} className={`hero-slide ${index === slide ? "is-active" : ""}`} style={{ backgroundImage: `url(${image.src})` }} />)}
        <div className="hero-overlay" />
        <div className="hero-copy"><p className="eyebrow">WELLHOUSE INTERIOR <span>— EST. 2006</span></p><h1>공간에 대한 생각을<br /><em>현실로 완성합니다.</em></h1><p className="hero-description">주거공간부터 상업공간까지,<br />공간의 가치와 사용자의 생활을 생각하는 인테리어.</p><button className="line-button light" onClick={() => scrollTo("projects")}>시공 사례 보기 <ArrowUpRight size={17} /></button></div>
        <div className="hero-form-wrap"><QuoteForm space={space} setSpace={setSpace} submitted={submitted} onSubmit={() => setSubmitted(true)} compact /></div>
        <div className="hero-meta"><span>{String(slide + 1).padStart(2, "0")} / {String(heroImages.length).padStart(2, "0")}</span><div className="hero-controls"><button onClick={() => setSlide((slide - 1 + heroImages.length) % heroImages.length)} aria-label="이전"><ChevronLeft /></button><button onClick={() => setSlide((slide + 1) % heroImages.length)} aria-label="다음"><ChevronRight /></button></div></div>
      </section>

      <section className="numbers section-pad"><div className="numbers-grid"><div><strong><CountUp target={20} /><span className="metric-plus">+</span><span className="metric-unit"> years</span></strong><p>시공 경력</p></div><div><strong><CountUp target={140} /><span className="metric-plus">+</span><span className="metric-unit"> cases</span></strong><p>누적 시공사례</p></div><div><strong className="stars">★★★★★</strong><p>고객 만족도</p></div></div></section>

      <section id="about" className="about section-pad"><div className="vertical-label">ABOUT WELLHOUSE</div><div className="about-visual"><div className="about-frame" /><img src="/manus-storage/wellhouse-hero-living_4bcf3645.jpg" alt="웰하우스인테리어 시공 공간" /></div><div className="about-copy"><p className="section-kicker">ABOUT WELLHOUSE</p><h2>공간을 이해하는 것부터<br /><em>좋은 인테리어는 시작됩니다.</em></h2><p>주거공간부터 상업공간까지 공간의 구조와 사용 목적을 세심하게 살펴 보다 편안하고 완성도 높은 공간을 만들어갑니다.</p><p>전체 인테리어는 물론 필요한 공간만 변화시키는 부분 인테리어까지, 다양한 현장 경험을 바탕으로 공간에 적합한 인테리어를 제안합니다.</p><button className="text-button" onClick={() => scrollTo("contact")}>웰하우스인테리어 소개 <ArrowUpRight size={16} /></button></div></section>

      <section className="split-services"><div id="residential" className="service-panel residential-panel"><div className="service-image" style={{ backgroundImage: "url(/manus-storage/wellhouse-hero-living_4bcf3645.jpg)" }} /><div className="service-content"><p className="section-kicker">RESIDENTIAL INTERIOR</p><h2>주거<br /><em>인테리어</em></h2><p>아파트부터 단독주택까지<br />생활의 편안함과 공간의 아름다움을 함께 고려합니다.</p><button className="line-button" onClick={() => { setMainFilter("residential"); scrollTo("projects"); }}>자세히 보기 <ArrowUpRight size={16} /></button></div></div><div id="commercial" className="service-panel commercial-panel"><div className="service-image" style={{ backgroundImage: "url(/manus-storage/wellhouse-cafe_4733c3aa.jpg)" }} /><div className="service-content"><p className="section-kicker">COMMERCIAL INTERIOR</p><h2>상업<br /><em>인테리어</em></h2><p>공간의 목적과 업종의 특성을 고려하여<br />브랜드와 고객 경험을 담은 상업공간을 완성합니다.</p><button className="line-button" onClick={() => { setMainFilter("commercial"); scrollTo("projects"); }}>자세히 보기 <ArrowUpRight size={16} /></button></div></div></section>

      <section id="projects" className="projects section-pad"><div className="projects-heading"><div><p className="section-kicker">PROJECT</p><h2>웰하우스인테리어의<br /><em>다양한 공간을 만나보세요.</em></h2></div><p className="projects-intro">사진을 통해 공간의 변화와<br />그 안의 생활을 살펴보세요.</p></div><div className="filter-row">{[["all", "전체보기"], ["residential", "주거 인테리어"], ["commercial", "상업 인테리어"]].map(([value, label]) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setMainFilter(value)}>{label}</button>)}</div>{filter !== "all" && <div className="sub-filter-row">{(filter === "residential" ? ["all", "10평대", "20평대", "30평대", "40평대", "50평대", "60평대 이상"] : ["all", "사무실", "음식점 · 카페", "미용샵", "상가"]).map((value) => <button key={value} className={subFilter === value ? "active" : ""} onClick={() => setSubFilter(value)}>{value === "all" ? "전체보기" : value}</button>)}</div>}<div className="project-grid">{visibleProjects.map((project) => <article className="project-card" key={project.title}><div className="project-image"><img src={project.image} alt={project.title} /><span className="project-arrow"><ArrowUpRight /></span></div></article>)}</div><button className="outline-button" onClick={() => setMainFilter("all")}>시공 사례 전체보기 <ArrowUpRight size={16} /></button></section>

      <section className="before-after section-pad"><div className="before-heading"><div><p className="section-kicker">BEFORE & AFTER</p><h2>공간의 변화를<br /><em>직접 확인해보세요.</em></h2></div><p>전체 리모델링부터 부분 인테리어까지,<br />변화의 순간을 한 장면으로 비교합니다.</p></div><div className="compare-wrap"><div className="compare-image after" style={{ backgroundImage: "url(/manus-storage/wellhouse-office_68441b52.jpg)" }} /><div className="compare-image before" style={{ backgroundImage: "url(/manus-storage/wellhouse-kitchen_b8808787.jpg)", width: `${compare}%` }} /><div className="compare-handle" style={{ left: `${compare}%` }}><span>←</span><i /><span>→</span></div><input className="compare-range" type="range" min="8" max="92" value={compare} onChange={(e) => setCompare(Number(e.target.value))} aria-label="비포 애프터 비교" /><div className="compare-label before-label">BEFORE</div><div className="compare-label after-label">AFTER</div></div></section>

      <section className="services section-pad"><div className="services-title"><p className="section-kicker">INTERIOR SERVICE</p><h2>다양한 인테리어<br /><em>시공을 제안합니다.</em></h2><p>공간의 성격과 필요한 변화에 맞춰<br />가장 적합한 공정을 함께 설계합니다.</p></div><div className="service-list">{services.map((service, index) => <div key={service}><span>{String(index + 1).padStart(2, "0")}</span><b>{service}</b><ArrowUpRight size={18} /></div>)}</div></section>

      <section className="process section-pad"><div className="process-head"><p className="section-kicker">PROCESS</p><h2>인테리어 진행 과정</h2></div><div className="process-list">{[["01", "상담 문의", "전화 · 카카오톡 · 홈페이지를 통한 상담"], ["02", "현장 확인", "공간과 시공 범위를 확인합니다."], ["03", "견적 및 시공 제안", "현장에 적합한 공사 내용과 견적을 안내합니다."], ["04", "계약", "시공 범위와 공사 일정을 확정합니다."], ["05", "시공", "계획된 일정에 따라 인테리어를 진행합니다."], ["06", "완공", "최종 현장 확인 및 마무리를 진행합니다."]].map(([number, title, desc]) => <div className="process-item" key={number}><span>{number}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></section>

      <section className="why"><div className="why-inner section-pad"><div><p className="section-kicker">WHY WELLHOUSE</p><h2>웰하우스인테리어를<br /><em>선택하는 이유</em></h2></div><div className="why-list">{[["01", "20년 이상의 시공 경험", "다양한 주거 및 상업공간의 현장 경험을 바탕으로 공간에 적합한 시공을 진행합니다."], ["02", "주거부터 상업공간까지", "아파트·주택은 물론 사무실, 음식점, 미용샵, 학원 등 다양한 공간의 인테리어가 가능합니다."], ["03", "전체부터 부분 인테리어까지", "전체 리모델링뿐 아니라 필요한 공간과 공정만 선택한 부분 인테리어도 가능합니다."], ["04", "상담부터 시공까지", "상담과 현장 확인부터 시공 및 마무리까지 체계적으로 진행합니다."]].map(([n, t, d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>

      <section className="story section-pad"><div className="story-head"><div><p className="section-kicker">WELLHOUSE STORY</p><h2>웰하우스인테리어의<br /><em>새로운 시공 이야기를 만나보세요.</em></h2></div><button className="text-button">네이버 블로그 바로가기 <ArrowUpRight size={16} /></button></div><div className="story-grid"><article><img src="/manus-storage/wellhouse-hero-living_4bcf3645.jpg" alt="송도 더블하이트 하우스" /></article><article><img src="/manus-storage/wellhouse-cafe_4733c3aa.jpg" alt="김포 장기동 카페" /></article><article><img src="/manus-storage/wellhouse-salon_ec6db7b2.jpg" alt="인천 서구 원당 피부샵" /></article></div></section>

      <section id="contact" className="contact section-pad"><div className="contact-intro"><p className="section-kicker">CONTACT</p><h2>인테리어를<br /><em>계획하고 계신가요?</em></h2><p>아래의 양식을 제출해주시면<br />확인 후 신속히 견적을 안내해드립니다.</p><a href="tel:010-6552-4063" className="contact-call"><Phone size={17} /> 빠른 전화 상담 <b>010-6552-4063</b></a></div><QuoteForm space={space} setSpace={setSpace} submitted={submitted} onSubmit={() => setSubmitted(true)} /></section>
    </main>

    <footer><div className="footer-brand"><img src="/manus-storage/wellhouse-logo-color_44cbc7e1.png" alt="" /><div><strong>WELLHOUSE INTERIOR</strong><small>웰하우스 인테리어</small><p>공간의 목적과 생활을 생각하며<br />주거부터 상업공간까지 완성도 높은 인테리어를 제안합니다.</p></div></div><div className="footer-col"><p className="section-kicker">CONTACT</p><p>전화 <b>010-6552-4063</b></p><p>이메일 <b>dagttw@naver.com</b></p><p>주소 <b>인천광역시 검단구 완정로45번길 16, 1층 3호</b></p></div><div className="footer-col"><p className="section-kicker">SERVICE AREA</p><p><b>인천</b> 검단 · 청라 · 송도 전 지역</p><p><b>경기</b> 김포 · 일산 전 지역</p><p><b>서울</b> 마포 · 마곡 전 지역</p></div><div className="footer-col"><p className="section-kicker">QUICK LINK</p><button onClick={() => scrollTo("contact")}>견적 문의</button><button>카카오톡 상담</button><button>네이버 블로그</button></div><div className="copyright">Copyright © WELLHOUSE INTERIOR. All Rights Reserved.</div></footer>
    <div className="quick-menu"><a href="tel:010-6552-4063"><Phone size={18} /><span>전화 상담</span></a><a href="#contact" aria-label="카카오톡 상담"><span className="quick-icon kakao-icon"><MessageCircle size={18} /></span><span>카카오톡</span></a><a href="#story" aria-label="네이버 블로그"><span className="quick-icon naver-icon">N</span><span>네이버 블로그</span></a><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUpRight size={18} /><span>TOP</span></button></div>
  </div>;
}

function CountUp({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const duration = 1300;
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect(); } }, { threshold: 0.55 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);
  return <span ref={ref} className="count-value">{value}</span>;
}

function QuoteForm({ space, setSpace, submitted, onSubmit, compact = false }: { space: string; setSpace: (s: string) => void; submitted: boolean; onSubmit: () => void; compact?: boolean }) {
  return <form className={`quote-form ${compact ? "compact" : ""}`} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}><div className="form-head"><p className="section-kicker">QUICK ESTIMATE</p><div className="form-title-row"><img className="form-logo" src="/manus-storage/wellhouse-logo-color_44cbc7e1.png" alt="" /><h3>{submitted ? "문의가 접수되었습니다." : "간편 견적 문의"}</h3></div><p>{submitted ? "확인 후 빠르게 연락드리겠습니다." : "아래의 양식을 제출해주시면 확인 후 신속히 안내해드립니다."}</p></div>{!submitted && <><div className="space-toggle"><button type="button" className={space === "residential" ? "active" : ""} onClick={() => setSpace("residential")}>주거공간</button><button type="button" className={space === "commercial" ? "active" : ""} onClick={() => setSpace("commercial")}>상업공간</button></div><label>이름<input required placeholder="이름을 입력해주세요." /></label><label>휴대폰 번호<input required type="tel" placeholder="010-0000-0000" /></label><label>요청사항<textarea required placeholder="시공을 원하시는 공간, 지역, 평수 및 문의 내용을 간단히 작성해주세요." /></label><label className="consent"><input type="checkbox" required /><span><Check size={13} /> 개인정보 수집 및 이용 동의</span></label><button className="submit-button" type="submit">문의 접수하기 <ArrowUpRight size={16} /></button></>}</form>;
}
