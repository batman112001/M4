export async function onRequest({ request, env }) {
  const { FILES_M4 } = env;   // changed
  const url = new URL(request.url);

  if (request.method === "GET") {
    const list = await FILES_M4.list();
    const out = {};
    for (const k of list.keys) {
      out[k.name] = await FILES_M4.get(k.name);
    }
    return Response.json(out);
  }

  if (request.method === "POST") {
    try {
      const { id, url } = await request.json();
      if (!id || !url) return Response.json({ error: "Missing fields" }, { status: 400 });
      await FILES_M4.put(id, url);
      return Response.json({ message: `File "${id}" added!` });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
