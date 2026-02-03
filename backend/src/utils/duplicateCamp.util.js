import levenshtein from "fast-levenshtein";
import Camp from "../models/camp.model.js";

const normalizeTitle = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
};

const editSimilarity = (a, b) => {
  const dist = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - dist / maxLen;
};

const findDuplicate = async (title, { threshold = 0.8, limit = 50 } = {}) => {
  if (!title || !title.trim()) return null;

  const normalizedInput = normalizeTitle(title);
  const inputKeywords = normalizedInput.split(" ");

  if (!inputKeywords.length) return null;

  const camps = await Camp.find(
    { keywords: { $in: inputKeywords } },
    { _id: 1, title: 1, keywords: 1 },
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  let bestMatch = null;
  let bestScore = 0;

  for (const camp of camps) {
    if (!camp.keywords?.length) continue;

    const normalizedExisting = camp.keywords.join(" ");

    const lenDiff = Math.abs(
      normalizedInput.length - normalizedExisting.length,
    );
    if (
      lenDiff >
      Math.min(normalizedInput.length, normalizedExisting.length) * 0.5
    ) {
      continue;
    }

    const score = editSimilarity(normalizedInput, normalizedExisting);

    if (score >= threshold && score > bestScore) {
      bestScore = score;
      bestMatch = {
        campId: camp._id,
        title: camp.title,
        score,
      };
    }
  }

  return bestMatch;
};

export { normalizeTitle, findDuplicate };
