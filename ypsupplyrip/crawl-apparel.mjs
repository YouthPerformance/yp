import fs from "node:fs";
import { FirecrawlAppV1 } from "@mendable/firecrawl-js";

const app = new FirecrawlAppV1({ apiKey: "fc-4882911770044ad283ba8bdbbcbd7e8b" });

async function crawlApparel() {
  console.log("Scraping shopify.supply/categories/apparel...");

  const result = await app.scrapeUrl("https://shopify.supply/categories/apparel", {
    formats: ["html", "rawHtml"],
    waitFor: 5000,
  });

  console.log("Scrape completed!");

  fs.writeFileSync("../newsupply/apparel-scrape.json", JSON.stringify(result, null, 2));
  console.log("Saved to newsupply/apparel-scrape.json");

  if (result.html) {
    fs.writeFileSync("../newsupply/apparel.html", result.html);
    console.log("Saved HTML");
  }

  if (result.rawHtml) {
    fs.writeFileSync("../newsupply/apparel-raw.html", result.rawHtml);
    console.log("Saved raw HTML");
  }
}

crawlApparel().catch(console.error);
