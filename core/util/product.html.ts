const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export function containsHtmlMarkup(value: string) {
  return HTML_TAG_PATTERN.test(value);
}

export function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getProductTextContent(value?: string | null) {
  if (!value) return "";
  return containsHtmlMarkup(value) ? stripHtmlTags(value) : value.trim();
}

export function isSameProductText(a?: string | null, b?: string | null) {
  const left = getProductTextContent(a);
  const right = getProductTextContent(b);
  if (!left || !right) return false;
  return left === right;
}
