const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Read all source files
const srcDir = 'src';
const header = fs.readFileSync(path.join(srcDir, 'userscript-header.js'), 'utf8');
const config = fs.readFileSync(path.join(srcDir, 'config.js'), 'utf8');
const styles = fs.readFileSync(path.join(srcDir, 'styles.css'), 'utf8');
const template = fs.readFileSync(path.join(srcDir, 'template.html'), 'utf8');
const utils = fs.readFileSync(path.join(srcDir, 'utils.js'), 'utf8');
const themeManager = fs.readFileSync(path.join(srcDir, 'theme-manager.js'), 'utf8');
const uiManager = fs.readFileSync(path.join(srcDir, 'ui-manager.js'), 'utf8');
const postProcessor = fs.readFileSync(path.join(srcDir, 'post-processor.js'), 'utf8');
const main = fs.readFileSync(path.join(srcDir, 'main.js'), 'utf8');

// Process template with placeholders
const processedTemplate = template
  .replace('{{THEME_OPTIONS}}', '${generateThemeOptions()}')
  .replace('{{FONT_OPTIONS}}', '${generateFontOptions()}')
  .replace('{{FONT_SIZE}}', '${selectedFontSize}')
  .replace('{{WIDTH}}', '${selectedWidth}')
  .replace('{{LINE_SPACING}}', '${selectedLineSpacing}');

// Assemble final file
const output = `${header}

${config}

// #region CSS and HTML Artifacts
const css = \`${styles}\`;

const html = \`${processedTemplate}\`;

// #endregion

${utils}

${themeManager}

${uiManager}

${postProcessor}

${main}
`;

// Write output file
const outputPath = path.join(distDir, 'sv-readingview.user.js');
fs.writeFileSync(outputPath, output);

console.log(`UserScript built successfully: ${outputPath}`);
console.log(`File size: ${Math.round(output.length / 1024)}KB`);
