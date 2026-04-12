const HOST = "www.yourpropertyguide.com.au";
const BING_ENDPOINT = "https://www.bing.com/indexnow";

function getKey(): string {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error("INDEXNOW_KEY environment variable is not set");
  return key;
}

export async function submitToIndexNow(urls: string[]): Promise<{ submitted: number }> {
  if (urls.length === 0) return { submitted: 0 };

  const key = getKey();
  const keyLocation = `https://${HOST}/${key}.txt`;

  // Bing accepts up to 10,000 URLs per request
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 10_000) {
    chunks.push(urls.slice(i, i + 10_000));
  }

  for (const chunk of chunks) {
    const res = await fetch(BING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key, keyLocation, urlList: chunk }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IndexNow submission failed: HTTP ${res.status} — ${text}`);
    }
  }

  return { submitted: urls.length };
}
