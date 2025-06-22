// src/renderers/ImageRenderer.js
export class ImageRenderer {
  static render(block) {
    return `
      <div style="margin: ${block.margin || '0 0 0.5em 0'}; 
                  text-align: ${block.align || 'left'}">
        <img src="${block.src}" 
             style="max-width: ${block.width || '100%'}; 
                    height: ${block.height || 'auto'};
                    display: block;" />
      </div>
    `;
  }
}