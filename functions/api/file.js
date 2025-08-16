export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  const url = await env.FILES_M4.get(id);
  if (!url) {
    return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ id, url }), { status: 200 });
}
