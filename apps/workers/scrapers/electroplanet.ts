import { chromium } from "playwright";

type Product = {
  title: string;
  priceMad: number;
  url: string;
  merchant: string;
};

async function scrapeElectroplanet(query: string): Promise<Product[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    `https://www.electroplanet.ma/catalogsearch/result/?q=${encodeURIComponent(
      query
    )}`,
    { waitUntil: "networkidle" } // attendre que les requêtes AJAX se terminent
  );

  // attendre que les produits arrivent dans le DOM
  await page.waitForSelector("li.item.product.product-item", {
    timeout: 30000
  });

  const products: Product[] = await page.$$eval(
    "li.item.product.product-item",
    (els: Element[]) =>
      els.map((el) => {
        const title =
          (el.querySelector(".product-item-name a")?.textContent || "").trim();
        const priceTxt =
          (el.querySelector(".price")?.textContent || "").replace(/[^\d]/g, "");
        const price = parseFloat(priceTxt) || 0;
        const link =
          el.querySelector(".product-item-name a")?.getAttribute("href") || "";
        return { title, priceMad: price, url: link, merchant: "Electroplanet" };
      })
  );

  await browser.close();
  return products;
}

if (require.main === module) {
  scrapeElectroplanet("iphone")
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch(console.error);
}
