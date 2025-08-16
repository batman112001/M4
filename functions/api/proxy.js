export async function onRequestGet({ request }) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("❌ Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(targetUrl);

    if (!res.ok) {
      return new Response("❌ Failed to fetch target file", { status: res.status });
    }

    // Clone headers but drop unsafe ones
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.delete("content-security-policy");
    headers.delete("content-security-policy-report-only");
    headers.delete("clear-site-data");

    return new Response(res.body, { headers });
  } catch (err) {
    return new Response("❌ Proxy error: " + err.message, { status: 500 });
  }
}
