export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const url = await env.FILES_M4.get(id);
  if (!url) {
    return new Response("File not found", { status: 404 });
  }

  const res = await fetch(url);
  if (!res.ok) {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream"
    }
  });
}
