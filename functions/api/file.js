export async function onRequestGet({ request, env }) {
  const { FILES_M4 } = env;   // changed
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const url = await FILES_M4.get(id);
  if (!url) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ id, url });
}
