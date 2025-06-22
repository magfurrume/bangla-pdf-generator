# 📄 Bangla PDF Generator

Create beautiful Bengali PDF reports with custom fonts, headers, footers, tables, images, page numbers, and multi-column layouts using Puppeteer.

---

## 🚀 Features

✅ Easy text and table rendering in Bangla  
✅ Supports Kalpurush & NotoSans Bengali fonts  
✅ Custom headers, footers, and page numbers  
✅ Multi-column layout via `.column(n)`  
✅ Page breaks and margin/padding control  
✅ Auto-load images, styled tables, RTL-friendly

---

## 📦 Installation

```bash
npm install bangla-pdf-generator
```

> Note: You must use Node.js ≥ 18 and ensure Puppeteer dependencies are installed (like Chromium).

---

## ✨ Basic Usage

```js
import BanglaPDF from 'bangla-pdf-generator';
import path from 'path';

const pdf = new BanglaPDF({
  padding: '30px',
  defaultFont: 'kalpurush'
});

pdf.selectFont('notosans');

pdf.addHeader("প্রতিবেদন শিরোনাম", { align: 'center', bold: true });

pdf.setFooter({
  text: "© 2025 My Company",
  pageNumber: true,
  divider: { enabled: true }
});

pdf.setPageNumberFormat((page, total) => `পৃষ্ঠা ${page} / ${total}`);

pdf.addText("বাংলা টেক্সট", { fontSize: 18, color: 'darkblue' });

await pdf.save('report.pdf');
```

---

## 🧱 API Reference

### 🆕 new BanglaPDF(options)
Options include:
- padding: PDF body padding
- margin: top/right/bottom/left page margins
- defaultFont: 'kalpurush' or 'notosans'
- defaultFontSize: default font size

### 🔤 .selectFont(fontName)
Switch font (use before adding text/tables).

### 🖊️ .addText(text, options)
Add a paragraph or line of styled text.

### 📊 .addTable({ headers, rows, ...options })
Add a basic table with borders and spacing.

### 🖼️ .addImage(path, options)
Add an image. You can control:
- width/height
- align (left, center, right)
- margin

### 🪧 .addHeader(text, options)
Adds a prominent title or section heading.

### 📄 .addPageBreak()
Forces content to start on a new page.

### ➕ .column(count)
Enter column mode (e.g., .column(3))

### 📦 .addColumnItem(contentBlock)
(Alternative) Push manually into columns. Automatically used internally when .column() is active and you call addText/addTable/etc.

### 📍 .setFooter(options)
Adds custom footer with divider, text, and optional page number.

### 🧮 .setPageNumberFormat(fn)
Define page numbering pattern. E.g.,
```js
(page, total) => `পৃষ্ঠা ${page} / ${total}`
```

### 💾 .save(path)
Save the PDF to disk.

---

## 🧪 Sample Output

```js
pdf.column(3);
pdf.addImage('logo.png', { width: 60 });
pdf.addText("শিরোনাম", { bold: true });
pdf.addTable({ headers: ['নাম'], rows: [['রাহিম']] });

pdf.addText("সাধারণ সেকশন");
pdf.addPageBreak();
pdf.addText("শেষ পৃষ্ঠা");
```

---

## 📁 Fonts
This package uses:
- kalpurush.ttf (included)
- NotoSansBengali.ttf (included)

---

## 🛠 Contributing
Pull requests and issues welcome! Please ensure ESLint passes.

---

## 📜 License
MIT © 2025 Md. Magfur Alam
