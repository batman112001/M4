export async function onRequestGet({ request, env }) {
  const { FILES } = env;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const url = await FILES.get(id);
  if (!url) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ id, url });
}
