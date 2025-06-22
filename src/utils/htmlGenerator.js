// src/utils/htmlGenerator.js
import { TextRenderer } from '../renderers/TextRenderer.js';
import { TableRenderer } from '../renderers/TableRenderer.js';
import { ImageRenderer } from '../renderers/ImageRenderer.js';
import { PageBreakRenderer } from '../renderers/PageBreakRenderer.js';
import { ColumnRenderer } from '../renderers/ColumnRenderer.js';

const renderers = {
  text: TextRenderer,
  table: TableRenderer,
  image: ImageRenderer,
  pageBreak: PageBreakRenderer,
  columns: ColumnRenderer
};

export async function generateHTML(content, fontURL, padding, options = {}) {
  let html = '';
  for (const block of content) {
    block.margin = block.margin || options.defaultBlockPadding || '0 0 0.5em 0';
    const renderer = renderers[block.type];
    if (!renderer) {
      html += `<div style="color:red">[Unknown block type: ${block.type}]</div>`;
      continue;
    }
    try {
      const rendered = typeof renderer.render === 'function'
        ? await renderer.render(block)
        : renderer.render(block);
      html += rendered;
    } catch (err) {
      html += `<div style="color:red">Error rendering ${block.type} block: ${err.message}</div>`;
    }
  }
  return html;
}