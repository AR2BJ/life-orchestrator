import { LANG_ALIAS } from "./constants/lang-alias.constants";
import { createHighlighter } from "shiki";
import { getTheme } from "@/services/theme.service";

let highlighterPromise = null;

function mapCategoryToLanguage(categoryId) {
  const cat = String(categoryId || "").toLowerCase();
  return cat ? LANG_ALIAS[cat] : "";
}

export function checkIsShortCode(rawCode, maxLines = 10) {
  if (!rawCode) return true;
  const lineCount = rawCode.split("\n").length;
  return lineCount <= maxLines;
}

export function getLineNumbersHtml(rawCode) {
  if (!rawCode) return "";
  const lines = rawCode.split("\n");
  return lines.map((_, index) => `<span>${index + 1}</span>`).join("\n");
}

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro", "one-light"],
      langs: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "vue",
        "svelte",
        "html",
        "css",
        "scss",
        "python",
        "go",
        "rust",
        "shellscript",
        "sql",
        "json",
        "docker",
        "regexp",
        "graphql",
        "http",
        "markdown",
        "nginx",
        "apache",
        "yml",
        "cypher",
        "surrealql",
        "splunk",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightWithShiki(rawCode, categoryId) {
  if (!rawCode) return "";

  const highlighter = await getHighlighter();
  const lang = mapCategoryToLanguage(categoryId);

  const currentTheme = getTheme();
  const selectedTheme = currentTheme === "dark" ? "one-dark-pro" : "one-light";

  return highlighter.codeToHtml(rawCode, {
    lang: lang,
    theme: selectedTheme,
    colorReplacements: {
      "#282c34": "transparent",
      "#fafafa": "transparent",
    },
  });
}
