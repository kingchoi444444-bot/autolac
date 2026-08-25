import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "hr",
  "strong", "em", "u", "s", "span",
  "ul", "ol", "li",
  "a", "img",
  "h1", "h2", "h3", "h4",
  "blockquote", "pre", "code",
];

const ALLOWED_ATTR = ["href", "src", "alt", "style", "target", "rel", "class"];

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
