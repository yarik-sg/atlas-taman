import { chromium, type Browser } from "playwright";

type Product = {
  title: string;
  priceMad: number;
  url: string;
  merchant: string;
};

async function scrapeJumia(query: string): Promise<Product[]> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      `https://www.jumia.ma/catalog/?q=${encodeURIComponent(query)}`,
      { waitUntil: "domcontentloaded" }
    );

    // attendre que les produits soient rendus
    await page.waitForSelector(".prd._fb.col.c-prd", { timeout: 10000 });

    return await page.$$eval(
      ".prd._fb.col.c-prd",
      (els: Element[]) =>
        els.map((el) => {
          const title =
            (el.querySelector(".name")?.textContent || "").trim();
          const priceTxt =
            (el.querySelector(".prc")?.textContent || "").replace(/[^\d]/g, "");
          const price = parseFloat(priceTxt) || 0;
          const link =
            "https://www.jumia.ma" +
            (el.querySelector("a.core")?.getAttribute("href") || "");
          return { title, priceMad: price, url: link, merchant: "Jumia" };
        })
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// si exécuté directement : node/ts-node apps/workers/scrapers/jumia.ts
if (require.main === module) {
  scrapeJumia("iphone 15")
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch(console.error);
}
