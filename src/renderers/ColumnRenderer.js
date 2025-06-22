//src/renderers/ColumnRenderer.js
import { TextRenderer } from './TextRenderer.js';
import { TableRenderer } from './TableRenderer.js';
import { ImageRenderer } from './ImageRenderer.js';

export class ColumnRenderer {
  static render(block) {
    const colWidth = 100 / block.count;

    const columns = block.columns.map((item) => {
      let html = '';

      switch (item.type) {
        case 'text':
          html = TextRenderer.render(item);
          break;
        case 'image':
          html = ImageRenderer.render(item);
          break;
        case 'table':
          html = TableRenderer.render(item);
          break;
        default:
          html = `<div style="color:red;">[Unsupported block type: ${item.type}]</div>`;
      }

      return `<div style="flex: 0 0 ${colWidth}%; padding: 0 0.5em;">${html}</div>`;
    }).join('');

    return `<div style="display: flex; justify-content: space-between; margin: 1em 0;">${columns}</div>`;
  }
}
