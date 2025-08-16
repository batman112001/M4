export async function onRequestPost({ request, env }) {
  const { password, id, url } = await request.json();

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!id || !url) {
    return new Response(JSON.stringify({ error: "Missing id or url" }), { status: 400 });
  }

  await env.FILES_M4.put(id, url);
  return new Response(JSON.stringify({ success: true, id, url }), { status: 200 });
}

export async function onRequestGet({ env }) {
  const list = await env.FILES_M4.list();
  return new Response(JSON.stringify(list.keys), { status: 200 });
}
