// src/renderers/TextRenderer.js
export class TextRenderer {
  static render(block) {
    const style = `
      margin: ${block.margin || '0 0 0.5em 0'};
      line-height: ${block.lineHeight || 1.4};
      font-family: '${block.font || 'kalpurush'}', sans-serif;
      font-size: ${block.fontSize || 16}px;
      color: ${block.color || '#000'};
      font-weight: ${block.bold ? 'bold' : 'normal'};
      text-align: ${block.align || 'left'};
      text-decoration: ${block.underline ? 'underline' : 'none'};
      letter-spacing: ${block.letterSpacing || 'normal'};
      margin: ${block.margin || '0 0 3rem 0'};

    `;

    const underlineStyle = block.underline ? `
      text-decoration: underline;
      text-decoration-color: ${block.underlineColor || 'currentColor'};
      text-decoration-thickness: ${block.underlineThickness || '1px'};
      text-underline-position: ${block.underlinePosition || 'under'};
    ` : '';

    return block.value.split('\n')
      .map(line => `<div style="${style} ${underlineStyle}">${line || '&nbsp;'}</div>`)
      .join('');
  }
}