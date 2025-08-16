export async function onRequest({ request, env }) {
  const { FILES } = env;
  const url = new URL(request.url);

  if (request.method === "GET") {
    // Return all mappings
    const list = await FILES.list();
    const out = {};
    for (const k of list.keys) {
      out[k.name] = await FILES.get(k.name);
    }
    return Response.json(out);
  }

  if (request.method === "POST") {
    try {
      const { id, url } = await request.json();
      if (!id || !url) return Response.json({ error: "Missing fields" }, { status: 400 });
      await FILES.put(id, url);
      return Response.json({ message: `File "${id}" added!` });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
