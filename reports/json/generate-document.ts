const fs = require("fs");

const data = JSON.parse(fs.readFileSync("results.json", "utf-8"));

let md = `# Laporan Hasil Test Playwright\n\n`;

data.suites.forEach((suite) => {
  suite.specs.forEach((test) => {
    md += `## ${test.title}\n`;
    md += `• Status: **${test.ok ? "LULUS" : "GAGAL"}**\n`;
    md += `• Durasi: ${test.duration}ms\n\n`;
  });
});

fs.writeFileSync("laporan.md", md);
