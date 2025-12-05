
export const toSentenceFromCase = (input: string): string => {
  if (!input) return "";

  // Normalize separators first
  const normalized = input.replace(/[_-]+/g, " ");

  // Insert spaces between camel/pascal boundaries and letters/numbers
  const spaced = normalized
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")   // camelCase -> camel Case, v2API -> v2 API
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")   // API2 -> API 2
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")   // 2FA -> 2 FA
    .replace(/\s+/g, " ")
    .trim();

  // Sentence case: only first letter uppercase, rest lowercase
  const lower = spaced.toLowerCase();
  return lower ? lower[0].toUpperCase() + lower.slice(1) : "";
};
