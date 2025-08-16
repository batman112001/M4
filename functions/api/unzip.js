import fetch from "node-fetch";
import unzipper from "unzipper";

export async function onRequestPost(context) {
  try {
    const { fileId, password } = await context.request.json();
    if (!fileId || !password) {
      return new Response("Missing fileId or password", { status: 400 });
    }

    // Lookup file from KV
    const fileUrl = await context.env.FILES.get(fileId);
    if (!fileUrl) {
      return new Response("File not found", { status: 404 });
    }

    // Download zip
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Failed to fetch zip: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    // Try extracting with password
    const directory = await unzipper.Open.buffer(buffer, { password });
    if (!directory || directory.files.length === 0) {
      return new Response("Wrong password or empty zip", { status: 401 });
    }

    // For simplicity, return the first file (can be expanded to zip all)
    const firstFile = directory.files[0];
    const content = await firstFile.buffer();

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${firstFile.path}"`,
      },
    });

  } catch (err) {
    console.error(err);
    return new Response(`❌ Error: ${err.message}`, { status: 500 });
  }
}
