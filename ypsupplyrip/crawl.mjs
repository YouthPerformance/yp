import { FirecrawlAppV1 } from '@mendable/firecrawl-js';
import fs from 'fs';

const app = new FirecrawlAppV1({ apiKey: 'fc-4882911770044ad283ba8bdbbcbd7e8b' });

async function crawlSupply() {
  console.log('Scraping shopify.supply...');

  // Scrape the main page to get HTML, CSS, and JavaScript
  const result = await app.scrapeUrl('https://shopify.supply', {
    formats: ['html', 'markdown'],
    includeTags: ['style', 'script', 'button', 'a'],
    waitFor: 3000
  });

  console.log('Scrape completed!');

  // Save the full result
  fs.writeFileSync('../newsupply/full-scrape.json', JSON.stringify(result, null, 2));
  console.log('Saved full scrape to newsupply/full-scrape.json');

  // Extract HTML content
  if (result.html) {
    fs.writeFileSync('../newsupply/page.html', result.html);
    console.log('Saved HTML to newsupply/page.html');
  }

  // Extract markdown
  if (result.markdown) {
    fs.writeFileSync('../newsupply/page.md', result.markdown);
    console.log('Saved markdown to newsupply/page.md');
  }

  console.log('\nDone! Check /newsupply for results.');
}

crawlSupply().catch(console.error);
