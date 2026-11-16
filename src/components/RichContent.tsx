import React from "react";

// Admin-authored body text. Older entries are plain paragraphs separated by blank lines;
// newer ones may be HTML (<h2>, <p>, <ul>, <a>, <img>...), as on the group's other sites.
// Only signed-in admins can write this content, so HTML is rendered as authored.
const HTML_TAG = /<\/?(p|h[1-6]|ul|ol|li|a|img|blockquote|strong|em|br|div|table|figure|span)\b/i;

export function RichContent({ content, className = "" }: { content: string; className?: string }) {
  if (HTML_TAG.test(content)) {
    return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <div className={`rich-text ${className}`}>
      {content
        .split(/\n\s*\n/)
        .filter((p) => p.trim())
        .map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
    </div>
  );
}
