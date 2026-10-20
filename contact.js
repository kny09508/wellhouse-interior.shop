// Cloudflare Pages Function: POST /api/contact
// 견적 문의 폼 → Resend API 로 메일 발송
//
// 필요한 환경 변수 (Cloudflare Pages > Settings > Variables and Secrets)
//   RESEND_API_KEY  (Secret, 필수)  Resend API 키
//   FROM_EMAIL      (선택)           기본값: noreply@wellhouse-interior.shop
//                                    ※ Resend 에서 인증(Verify)한 도메인의 주소여야 함

const FROM_NAME = "웰하우스인테리어";
const DEFAULT_FROM_EMAIL = "noreply@wellhouse-interior.shop";

const TO = ["dagttw@naver.com"];
const CC = ["fkdl789123@st-group1.com", "fkdl789123@naver.com"];

const SUBJECT = "[웰하우스인테리어] 견적문의가 접수되었습니다";

// 허용할 Origin (다른 사이트에서 이 API 를 마음대로 호출하는 것을 방지)
const ALLOWED_ORIGINS = [
  "https://wellhouse-interior.shop",
  "https://www.wellhouse-interior.shop",
];
// *.pages.dev 미리보기 주소도 허용하려면 true
const ALLOW_PAGES_DEV_PREVIEW = true;

const LIMITS = { name: 50, phone: 30, space: 30, address: 300, message: 3000 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const escapeHtml = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clean = (v, max) =>
  String(v ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, max);

function originAllowed(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (ALLOW_PAGES_DEV_PREVIEW && /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.pages\.dev$/.test(origin)) return true;
  return false;
}

function buildHtml(fields, receivedAt) {
  const rows = fields
    .map(
      ([label, value]) => `
      <tr>
        <th style="width:110px;padding:12px 14px;background:#f5f3ef;border:1px solid #e3dfd8;text-align:left;font-size:14px;color:#444;vertical-align:top;">${escapeHtml(label)}</th>
        <td style="padding:12px 14px;border:1px solid #e3dfd8;font-size:14px;color:#111;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value) || "-"}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="ko"><body style="margin:0;padding:24px;background:#faf9f7;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e3dfd8;padding:28px;">
    <h2 style="margin:0 0 6px;font-size:20px;color:#111;">견적 문의가 접수되었습니다</h2>
    <p style="margin:0 0 20px;font-size:13px;color:#888;">접수 시각: ${escapeHtml(receivedAt)}</p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <p style="margin:20px 0 0;font-size:12px;color:#999;">웰하우스인테리어 홈페이지(wellhouse-interior.shop)에서 자동 발송된 메일입니다.</p>
  </div>
</body></html>`;
}

function buildText(fields, receivedAt) {
  return (
    `견적 문의가 접수되었습니다\n접수 시각: ${receivedAt}\n\n` +
    fields.map(([label, value]) => `■ ${label}\n${value || "-"}`).join("\n\n")
  );
}

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request)) {
    return json({ success: false, error: "forbidden" }, 403);
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY 환경 변수가 설정되지 않았습니다.");
    return json({ success: false, error: "server_misconfigured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "invalid_json" }, 400);
  }

  const data = {
    name: clean(body.name, LIMITS.name),
    phone: clean(body.phone, LIMITS.phone),
    space: clean(body.space, LIMITS.space),
    address: clean(body.address, LIMITS.address),
    message: clean(body.message, LIMITS.message),
  };

  if (!data.name || !data.phone) {
    return json({ success: false, error: "missing_required_fields" }, 400);
  }

  const receivedAt = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });

  const fields = [
    ["이름", data.name],
    ["연락처", data.phone],
    ["공간 구분", data.space],
    ["주소", data.address],
    ["문의 내용", data.message],
  ];

  const fromEmail = env.FROM_EMAIL || DEFAULT_FROM_EMAIL;

  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${fromEmail}>`,
        to: TO,
        cc: CC,
        subject: SUBJECT,
        html: buildHtml(fields, receivedAt),
        text: buildText(fields, receivedAt),
      }),
    });
  } catch (e) {
    console.error("Resend 요청 실패:", e);
    return json({ success: false, error: "upstream_unreachable" }, 502);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend 응답 오류:", res.status, detail);
    return json({ success: false, error: "send_failed" }, 502);
  }

  return json({ success: true });
}

// POST 이외의 메서드는 거부
export async function onRequest() {
  return json({ success: false, error: "method_not_allowed" }, 405);
}
