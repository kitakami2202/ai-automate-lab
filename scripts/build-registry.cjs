const fs = require("fs");
const { execSync } = require("child_process");

// --- 1. Parse keyword-map.csv ---
const kwData = fs.readFileSync("scripts/keyword-map.csv", "utf8");
const kwLines = kwData.split("\n");
const kwMap = {};
for (let i = 1; i < kwLines.length; i++) {
  const l = kwLines[i].trim();
  if (l.length === 0) continue;
  const fields = [];
  let field = "", inQ = false;
  for (const c of l) {
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { fields.push(field); field = ""; }
    else { field += c; }
  }
  fields.push(field);
  if (fields[0]) {
    kwMap[fields[0]] = {
      primary_kw: fields[1],
      layer: fields[3],
      article_type: fields[4],
      cluster: fields[5],
      priority: fields[6],
      status: fields[7],
      notes: fields[8] || ""
    };
  }
}

// --- 2. Scan articles ---
const categories = ["ai-api", "discord-bot", "frameworks", "gas", "no-code", "reviews"];
const articles = [];

for (const cat of categories) {
  const dir = `src/content/articles/${cat}`;
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
  for (const file of files) {
    const slug = file.replace(".md", "");
    const filepath = `${dir}/${file}`;
    const content = fs.readFileSync(filepath, "utf8");

    // Extract title
    const titleMatch = content.match(/^title:\s*"(.+?)"/m);
    const title = titleMatch ? titleMatch[1] : "";

    // Count FAQ
    const faqCount = (content.match(/  - question:/g) || []).length;

    // Count internal links
    const linkCount = (content.match(/\/articles\//g) || []).length;

    // Line count (approx word count)
    const lineCount = content.split("\n").length;

    // Git dates
    let createdDate = "", updatedDate = "";
    try {
      createdDate = execSync(`git log --diff-filter=A --format="%ad" --date=short -- "${filepath}"`, { encoding: "utf8" }).trim().split("\n").pop() || "";
      updatedDate = execSync(`git log -1 --format="%ad" --date=short -- "${filepath}"`, { encoding: "utf8" }).trim();
    } catch (e) {}

    // Keyword map data
    const kw = kwMap[slug] || {};

    // Determine version
    let version = "v1.0";
    // Check if article was rewritten (multiple major commits)
    const rewriteArticles = ["gas-line-bot", "gas-spreadsheet-automation", "gas-basics", "gas-slack-notification",
      "discord-bot-gas", "ai-introduction-5steps", "automation-roi-template", "where-to-automate-first",
      "gas-basics", "automation-roadmap", "discord-bot-overview", "no-code-overview", "ai-api-overview"];
    const refinedArticles = Object.keys(kwMap).filter(s => kwMap[s].status === "reviewed");

    if (rewriteArticles.includes(slug) && refinedArticles.includes(slug)) {
      version = "v2.1";
    } else if (rewriteArticles.includes(slug)) {
      version = "v2.0";
    } else if (refinedArticles.includes(slug)) {
      version = "v1.1";
    }

    articles.push({
      slug,
      title,
      category: cat,
      cluster: kw.cluster || cat,
      layer: kw.layer || "",
      article_type: kw.article_type || "",
      priority: kw.priority || "",
      status: kw.status || "published",
      version,
      created_date: createdDate,
      last_updated: updatedDate,
      primary_kw: kw.primary_kw || "",
      word_count: lineCount,
      faq_count: faqCount,
      internal_links: linkCount,
      notes: kw.notes || ""
    });
  }
}

// Sort by priority then category
const priorityOrder = { S: 0, A: 1, B: 2, C: 3, "": 4 };
articles.sort((a, b) => {
  const pa = priorityOrder[a.priority] || 4;
  const pb = priorityOrder[b.priority] || 4;
  if (pa !== pb) return pa - pb;
  return a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug);
});

// --- 3. Write article-registry.csv ---
const header = "slug,title,category,cluster,layer,article_type,priority,status,version,created_date,last_updated,primary_kw,word_count,faq_count,internal_links,notes";
const csvLines = [header];
for (const a of articles) {
  const escape = (s) => {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  csvLines.push([
    a.slug,
    escape(a.title),
    a.category,
    a.cluster,
    a.layer,
    a.article_type,
    a.priority,
    a.status,
    a.version,
    a.created_date,
    a.last_updated,
    escape(a.primary_kw),
    a.word_count,
    a.faq_count,
    a.internal_links,
    escape(a.notes)
  ].join(","));
}
fs.writeFileSync("scripts/article-registry.csv", csvLines.join("\n") + "\n", "utf8");
console.log(`article-registry.csv: ${articles.length} articles written`);

// --- 4. Build changelog.csv ---
const changelogHeader = "date,slug,action,phase,before_status,after_status,before_version,after_version,summary,commit";
const changelogRows = [changelogHeader];

// Initial commit: 2026-02-09 - all original articles
const initialArticles = ["gas-basics", "gas-spreadsheet-automation", "gas-line-bot", "gas-slack-notification",
  "discord-bot-gas", "claude-api-intro", "openai-api-intro", "gemini-api-intro", "n8n-self-hosting",
  "ai-introduction-5steps", "automation-roi-template", "where-to-automate-first", "ai-dev-tools-comparison",
  "automation-tools-matrix", "discord-slash-commands", "discord-spreadsheet-db", "zapier-vs-make",
  "gas-basics", "automation-roadmap"];

for (const slug of [...new Set(initialArticles)]) {
  changelogRows.push(`2026-02-09,${slug},create,T1-T3,,-,drafted,-,v1.0,初回作成,1fe68b5`);
}

// Rewrite: 2026-02-09
changelogRows.push("2026-02-09,gas-line-bot,rewrite,T3-T6,drafted,published,v1.0,v2.0,フルリライト完了,67723698");
changelogRows.push("2026-02-09,gas-spreadsheet-automation,rewrite,T3-T6,drafted,published,v1.0,v2.0,フルリライト完了,f1d0e54");

// Rewrite: 2026-02-10
const rewriteFeb10 = ["gas-basics", "gas-slack-notification", "discord-bot-gas", "ai-introduction-5steps",
  "automation-roi-template", "where-to-automate-first", "ai-dev-tools-comparison", "automation-tools-matrix",
  "automation-roadmap"];
for (const slug of rewriteFeb10) {
  changelogRows.push(`2026-02-10,${slug},rewrite,T3-T6,drafted,published,v1.0,v2.0,リライト・公開,e4ee503`);
}

// Pillar articles: 2026-02-11
const pillarFeb11 = ["discord-bot-overview", "no-code-overview", "ai-api-overview", "automation-roadmap"];
for (const slug of pillarFeb11) {
  changelogRows.push(`2026-02-11,${slug},create,T1-T6,-,published,-,v1.0,ピラー記事作成・公開,86cd6cc`);
}

// Massive expansion: 2026-02-12 commit 5e9fd3f
// New articles created (S+A priority)
const newFeb12_SA = [
  "claude-code-automation", "ai-coding-tools-comparison", "mcp-intro", "gas-pdf-generation",
  "prompt-engineering-business", "ai-coding-non-engineer",
  "gas-mail-automation", "gas-form-automation", "gas-syntax-reference",
  "discord-scheduler-bot", "discord-vs-line-bot", "gas-chatgpt-api",
  "gas-ai-coding", "discord-ai-bot", "ai-coding-cost-reduction",
  "api-key-management", "ai-coding-prompt-patterns", "gas-claude-api"
];
for (const slug of newFeb12_SA) {
  changelogRows.push(`2026-02-12,${slug},create,T1-T6,-,published,-,v1.0,新規作成・パイプライン通過,5e9fd3f`);
}

// New articles (B priority)
const newFeb12_B = [
  "tool-selection-guide", "automation-failure", "no-code-tool-matrix", "gas-calendar",
  "n8n-ai-workflow", "make-ai-scenarios", "codex-intro", "mcp-google-workspace",
  "discord-attendance", "ai-api-cost-management", "dify-intro", "cursor-business"
];
for (const slug of newFeb12_B) {
  changelogRows.push(`2026-02-12,${slug},create,T1-T6,-,published,-,v1.0,新規作成・公開,5e9fd3f`);
}

// New articles (C priority)
const newFeb12_C = [
  "ai-business-overview", "ai-invoice", "ai-customer-support", "ai-meeting-minutes",
  "ai-data-report", "ai-email-triage", "ai-recruitment-screening", "ai-coding-overview",
  "github-copilot-business", "windsurf-intro", "ai-code-review"
];
for (const slug of newFeb12_C) {
  changelogRows.push(`2026-02-12,${slug},create,T1-T6,-,published,-,v1.0,新規作成・公開,5e9fd3f`);
}

// Refine S+A articles: 2026-02-12 commit 5e9fd3f
const refineSA = [
  "discord-slash-commands", "discord-spreadsheet-db", "openai-api-intro", "claude-api-intro",
  "zapier-vs-make", "gas-mail-automation", "gas-form-automation", "gas-syntax-reference",
  "discord-scheduler-bot", "discord-vs-line-bot", "gas-chatgpt-api", "gas-ai-coding",
  "discord-ai-bot", "ai-coding-cost-reduction", "api-key-management", "ai-coding-prompt-patterns",
  "claude-code-automation"
];
for (const slug of refineSA) {
  changelogRows.push(`2026-02-12,${slug},refine,TR1→TR2→T4→T5/T6,published,reviewed,v1.0,v1.1,リファインパイプライン通過,5e9fd3f`);
}

// Refine C articles: 2026-02-12 commit 5e9fd3f
for (const slug of newFeb12_C) {
  changelogRows.push(`2026-02-12,${slug},refine,TR1→TR2→T4→T5/T6,published,reviewed,v1.0,v1.1,リファインパイプライン通過,5e9fd3f`);
}

// Refine B articles: 2026-02-12 commit 365eb14
for (const slug of newFeb12_B) {
  changelogRows.push(`2026-02-12,${slug},refine,TR1→TR2→T4→T5/T6,published,reviewed,v1.0,v1.1,リファインパイプライン通過（B優先度）,365eb14`);
}

// Link fix
changelogRows.push("2026-02-12,discord-scheduler-bot,fix,-,reviewed,reviewed,v1.1,v1.1,relatedArticlesカテゴリプレフィックス修正,365eb14");

fs.writeFileSync("scripts/changelog.csv", changelogRows.join("\n") + "\n", "utf8");
console.log(`changelog.csv: ${changelogRows.length - 1} entries written`);

// Cleanup
if (fs.existsSync("scripts/parse-kw.cjs")) {
  fs.unlinkSync("scripts/parse-kw.cjs");
}
