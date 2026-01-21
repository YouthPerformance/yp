import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// LLMS.TXT AUTO-UPDATE HOOK
// Keeps the Answer Engine interface current
// ============================================================================

interface LlmsEntry {
  title: string;
  url: string;
  description: string;
  expert: string;
}

const LLMS_TXT_PATH = 'public/llms.txt';
const LLMS_FULL_PATH = 'public/llms-full.txt';

export async function updateLlmsTxt(
  newPages: Array<{
    slug: string;
    title: string;
    meta_description: string;
    expert: string;
    cluster: string;
  }>,
  baseUrl: string = 'https://youthperformance.com'
): Promise<void> {
  console.log('\n📝 HOOK 2: Updating llms.txt...\n');

  // Read existing llms.txt
  let existingContent = '';
  try {
    existingContent = await fs.readFile(LLMS_TXT_PATH, 'utf-8');
  } catch {
    console.log('   Creating new llms.txt');
  }

  // Group new pages by cluster
  const byCluster = new Map<string, typeof newPages>();
  for (const page of newPages) {
    const cluster = page.cluster || 'general';
    if (!byCluster.has(cluster)) {
      byCluster.set(cluster, []);
    }
    byCluster.get(cluster)!.push(page);
  }

  // Generate new entries
  const newEntries: string[] = [];

  for (const [cluster, pages] of byCluster) {
    newEntries.push(`\n## ${formatClusterName(cluster)}\n`);

    for (const page of pages) {
      newEntries.push(`- [${page.title}](${baseUrl}${page.slug}): ${page.meta_description.substring(0, 100)}...`);
    }
  }

  // Find insertion point (before "## Citation Format" or at end)
  const insertionMarker = '## Citation Format';
  let updatedContent: string;

  if (existingContent.includes(insertionMarker)) {
    const parts = existingContent.split(insertionMarker);
    updatedContent = parts[0] + newEntries.join('\n') + '\n\n' + insertionMarker + parts[1];
  } else {
    updatedContent = existingContent + newEntries.join('\n');
  }

  // Write updated llms.txt
  await fs.writeFile(LLMS_TXT_PATH, updatedContent);
  console.log(`   ✅ Added ${newPages.length} pages to llms.txt`);

  // Also update llms-full.txt with detailed entries
  await updateLlmsFullTxt(newPages, baseUrl);
}

async function updateLlmsFullTxt(
  newPages: Array<{
    slug: string;
    title: string;
    meta_description: string;
    expert: string;
    quick_answer?: string[];
  }>,
  baseUrl: string
): Promise<void> {
  // Read existing
  let existingContent = '';
  try {
    existingContent = await fs.readFile(LLMS_FULL_PATH, 'utf-8');
  } catch {
    existingContent = `# YouthPerformance Knowledge Base (Full)\n\n`;
  }

  // Generate detailed entries
  const newEntries: string[] = [];

  for (const page of newPages) {
    const expertName = page.expert === 'adam-harrington' ? 'Adam Harrington' : 'James Scott';

    newEntries.push(`
### ${page.title}
- **URL**: ${baseUrl}${page.slug}
- **Expert**: ${expertName}
- **Answer**: ${page.quick_answer?.[0] || page.meta_description}
`);
  }

  // Append to file
  const updatedContent = existingContent + newEntries.join('\n');
  await fs.writeFile(LLMS_FULL_PATH, updatedContent);
  console.log(`   ✅ Added ${newPages.length} entries to llms-full.txt`);
}

function formatClusterName(cluster: string): string {
  return cluster
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Sitemap update (bonus)
export async function updateSitemap(
  newPages: Array<{ slug: string }>,
  baseUrl: string = 'https://youthperformance.com'
): Promise<void> {
  console.log('\n🗺️ Updating sitemap.xml...\n');

  const SITEMAP_PATH = 'public/sitemap.xml';

  // Read existing sitemap
  let existingContent = '';
  try {
    existingContent = await fs.readFile(SITEMAP_PATH, 'utf-8');
  } catch {
    existingContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }

  // Generate new entries
  const today = new Date().toISOString().split('T')[0];
  const newUrls = newPages.map(page => `
  <url>
    <loc>${baseUrl}${page.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  // Insert before closing tag
  const updatedContent = existingContent.replace('</urlset>', `${newUrls}\n</urlset>`);

  await fs.writeFile(SITEMAP_PATH, updatedContent);
  console.log(`   ✅ Added ${newPages.length} URLs to sitemap.xml`);
}
