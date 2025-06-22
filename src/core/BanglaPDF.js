// src/core/BanglaPDF.js
import puppeteer from 'puppeteer';
import path from 'path';
import { generateHTML } from '../utils/htmlGenerator.js';
import { wrapHTML } from '../utils/htmlWrapper.js';
import { FONT_MAP, DEFAULT_OPTIONS } from './constants.js';
import { ImageLoader } from '../utils/imageLoader.js';

export default class BanglaPDF {
  constructor(options = {}) {
    this.content = [];
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      margin: {
        ...DEFAULT_OPTIONS.margin,
        ...(options.margin || {})
      }
    };
    this.currentFont = this.options.defaultFont;
    this.footer = null;
    this.pageNumberFormat = null;
    this.columnMode = null;
    this.columnBuffer = [];
  }

  flushColumnsIfNeeded() {
    if (this.columnBuffer.length > 0 && this.columnMode) {
      this.content.push({
        type: 'columns',
        columns: [...this.columnBuffer],
        count: this.columnMode
      });
      this.columnBuffer = [];
    }
  }

  column(count = 2) {
    this.flushColumnsIfNeeded();
    this.columnMode = count;
    this.columnBuffer = [];
    return this;
  }

addText(text, options = {}) {
  const block = {
    type: 'text',
    value: text,
    font: this.currentFont,
    ...this.options,
    ...options
  };

  if (this.columnMode) {
    this.columnBuffer.push(block);
    if (this.columnBuffer.length === this.columnMode) {
      this.content.push({
        type: 'columns',
        columns: [...this.columnBuffer],
        count: this.columnMode
      });
      this.columnBuffer = [];
    }
  } else {
    this.content.push(block);
  }

  return this;
}


  addHeader(text, options = {}) {
    return this.addText(text, {
      fontSize: 22,
      bold: true,
      align: 'center',
      margin: '0 0 10px 0',
      ...options
    });
  }

  addTable({ headers, rows, ...options }) {
    const block = {
      type: 'table',
      headers,
      rows,
      font: this.currentFont,
      cellPadding: this.options.tableCellPadding,
      ...this.options,
      ...options
    };

    if (this.columnMode) {
      this.columnBuffer.push(block);
      if (this.columnBuffer.length === this.columnMode) this.flushColumnsIfNeeded();
    } else {
      this.content.push(block);
    }
    return this;
  }

  async addImage(source, options = {}) {
    try {
      const processedSrc = await ImageLoader.load(source);
      const block = {
        type: 'image',
        src: processedSrc,
        ...options
      };

      if (this.columnMode) {
        this.columnBuffer.push(block);
        if (this.columnBuffer.length === this.columnMode) this.flushColumnsIfNeeded();
      } else {
        this.content.push(block);
      }

      return this;
    } catch (error) {
      console.error('Image loading error:', error.message);
      this.addText(`[Image failed to load: ${error.message}]`, { color: 'red' });
      return this;
    }
  }

  setFooter(options = {}) {
    this.footer = options;
    return this;
  }

  setPageNumberFormat(formatFunc) {
    this.pageNumberFormat = formatFunc;
    return this;
  }

  addPageBreak() {
    this.flushColumnsIfNeeded();
    this.content.push({
      type: 'pageBreak',
      value: ''
    });
    return this;
  }
selectFont(fontName) {
  if (!FONT_MAP[fontName]) {
    throw new Error(`Font ${fontName} not available. Choose from: ${Object.keys(FONT_MAP).join(', ')}`);
  }
  this.currentFont = fontName;
  return this;
}

  async save(outputPath = 'output.pdf') {
    this.flushColumnsIfNeeded();

    const fontPath = path.resolve(FONT_MAP[this.currentFont]);
    const contentHTML = await generateHTML(this.content, fontPath, this.options.padding);
    const html = wrapHTML(contentHTML, fontPath, this.options.padding, this.currentFont);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--font-render-hinting=none',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security'
      ]
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1
    });

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const footerTextHTML = this.footer?.text
      ? `<div style="${this.footer?.textStyle || ''}">${this.footer.text}</div>`
      : '';

    const pageNumberHTML = this.footer?.pageNumber
      ? `<div style="${this.footer?.pageNumberStyle || ''}">
           Page <span class="pageNumber"></span> of <span class="totalPages"></span>
         </div>`
      : '';

    const footerHtml = `
      <div style="
        width: 100%;
        padding: 0 1cm;
        font-family: sans-serif;
        text-align: ${this.footer?.align || 'center'};
      ">
        ${this.footer?.divider?.enabled ? `<hr style='border:none; border-top: ${this.footer?.divider?.thickness || '1px'} solid ${this.footer?.divider?.color || '#000'}; margin-bottom: 5px;' />` : ''}
        ${footerTextHTML}
        ${pageNumberHTML}
      </div>
    `;

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: this.options.margin.top,
        right: this.options.margin.right,
        bottom: this.options.margin.bottom,
        left: this.options.margin.left
      },
      headerTemplate: `<span></span>`,
      footerTemplate: footerHtml
    });

    await browser.close();
  }
}
