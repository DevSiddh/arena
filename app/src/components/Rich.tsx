import katex from 'katex';
import { useMemo } from 'react';

/**
 * Minimal, deliberate rich-text renderer.
 *
 * The content layer writes prose with a tiny subset of Markdown (`**bold**`, `*italic*`,
 * `- ` bullets, blank-line paragraphs) plus `$...$` and `$$...$$` for mathematics. Rendering it
 * here means the lesson and item data stay plain strings — no HTML is ever injected, and KaTeX is
 * given only the math fragments.
 */

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, { displayMode, throwOnError: false, strict: false, output: 'html' });
  } catch {
    return `<code>${tex.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)}</code>`;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);
}

/**
 * Convert one line of the subset-Markdown into HTML.
 *
 * The line is split on `$...$` first: the plain fragments are escaped (so no user text can inject
 * markup) while the math fragments go to KaTeX untouched — important because LaTeX contains
 * characters like `&` (matrices) that must not be HTML-escaped.
 */
function inline(line: string): string {
  return line
    .split(/(\$[^$]+\$)/g)
    .map((part) => {
      if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) return renderMath(part.slice(1, -1), false);
      return escapeHtml(part)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    })
    .join('');
}

export function RichText({ text, className }: { text: string; className?: string }): JSX.Element {
  const html = useMemo(() => {
    const lines = text.split('\n');
    const out: string[] = [];
    let list: 'ul' | 'ol' | null = null;
    const closeList = () => {
      if (list) {
        out.push(`</${list}>`);
        list = null;
      }
    };
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (!line.trim()) {
        closeList();
        continue;
      }
      const bullet = line.match(/^\s*[-*]\s+(.*)$/);
      const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (bullet) {
        if (list !== 'ul') {
          closeList();
          out.push('<ul>');
          list = 'ul';
        }
        out.push(`<li>${inline(bullet[1])}</li>`);
        continue;
      }
      if (ordered) {
        if (list !== 'ol') {
          closeList();
          out.push('<ol>');
          list = 'ol';
        }
        out.push(`<li>${inline(ordered[1])}</li>`);
        continue;
      }
      closeList();
      if (line.startsWith('> ')) {
        out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
        continue;
      }
      out.push(`<p>${inline(line)}</p>`);
    }
    closeList();
    return out.join('\n');
  }, [text]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MathBlock({ latex, caption }: { latex: string; caption?: string }): JSX.Element {
  return (
    <div className="formula-block" style={{ margin: '10px 0' }}>
      <div
        style={{ textAlign: 'center', background: '#fafbfc', border: '1px solid var(--line)', borderRadius: 6, padding: '6px 10px' }}
        dangerouslySetInnerHTML={{ __html: renderMath(latex, true) }}
      />
      {caption ? (
        <small className="faint" style={{ display: 'block', marginTop: 4 }}>
          {caption}
        </small>
      ) : null}
    </div>
  );
}

export function InlineMath({ latex }: { latex: string }): JSX.Element {
  return <span dangerouslySetInnerHTML={{ __html: renderMath(latex, false) }} />;
}
