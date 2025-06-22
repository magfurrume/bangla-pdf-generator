// src/renderers/TableRenderer.js
export class TableRenderer {
  static render(block) {
    const cellStyle = `
      padding: ${block.cellPadding || '4px'};
      font-size: ${block.fontSize || 14}px;
      border: 1px solid #ddd;
    `;

    const headers = block.headers.map(h => `
      <th style="${cellStyle} font-weight: bold; background: #f5f5f5;">
        ${h}
      </th>
    `).join('');

    const rows = block.rows.map(row => `
      <tr>
        ${row.map(cell => `<td style="${cellStyle}">${cell || '&nbsp;'}</td>`).join('')}
      </tr>
    `).join('');

    return `
      <div style="margin: ${block.margin || '0 0 0.5em 0'};">
        <table style="width:100%; border-collapse:collapse; margin:0;">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }
}