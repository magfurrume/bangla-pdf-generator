// src/utils/htmlWrapper.js
import path from 'path';
import { FONT_MAP } from '../core/constants.js';

export function wrapHTML(bodyContent, fontURL, padding, fontName) {
  const notosansPath = path.resolve(FONT_MAP.notosans);

  return `
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="utf-8">
      <style>
        @font-face {
          font-family: 'kalpurush';
          src: url('file://${fontURL}') format('truetype');
        }
        @font-face {
          font-family: 'notosans';
          src: url('file://${notosansPath}') format('truetype');
        }
        body {
          font-family: '${fontName}', sans-serif;
          padding: ${padding};
          line-height: 1.4;
          margin: 0;
        }
        div, p {
          margin: 0 0 0.5em 0;
          padding: 0;
        }
        table {
          margin: 0 0 0.5em 0;
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 4px;
          font-size: 14px;
        }
        img {
          display: block;
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;
}
