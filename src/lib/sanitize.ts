import sanitizeHtmlLib from "sanitize-html";

const ALLOWED_TAGS = [
  "p", "br", "hr",
  "strong", "em", "u", "s", "span",
  "ul", "ol", "li",
  "a", "img",
  "h1", "h2", "h3", "h4",
  "blockquote", "pre", "code",
];

const ALLOWED_ATTR = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "style"],
  span: ["style"],
  p: ["style"],
  "*": ["class"],
};

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
        "font-size": [/^\d+(?:px|em|rem)$/],
      },
    },
  });
}
