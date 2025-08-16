// functions/api/unzip.js
import JSZip from "jszip";

export async function onRequestPost({ request }) {
  try {
    const { url, password } = await request.json();

    // Step 1: Download the zip
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch zip file" }), { status: 400 });
    }
    const zipBuffer = await response.arrayBuffer();

    // Step 2: Load with JSZip (note: AES encrypted zip requires extra lib)
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer, { password });

    // Step 3: Extract files into memory
    let extractedFiles = {};
    for (const filename of Object.keys(zipContent.files)) {
      const fileData = await zipContent.files[filename].async("uint8array");
      extractedFiles[filename] = btoa(
        String.fromCharCode(...fileData)
      ); // Base64 encode for transport
    }

    return new Response(JSON.stringify({ files: extractedFiles }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
