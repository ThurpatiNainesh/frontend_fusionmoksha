const fs = require('fs');
const path = require('path');

// Create the _redirects file in the build directory
const redirectsContent = `/*    /index.html   200
/login    /index.html   200
/register    /index.html   200
/shop    /index.html   200
/shop/*    /index.html   200
/cart    /index.html   200
/profile    /index.html   200
/search    /index.html   200
/contact    /index.html   200
/about    /index.html   200`;

const buildDir = path.join(__dirname, 'build');
const redirectsPath = path.join(buildDir, '_redirects');

// Create 200.html and 404.html as copies of index.html
const indexHtmlPath = path.join(buildDir, 'index.html');
const html200Path = path.join(buildDir, '200.html');
const html404Path = path.join(buildDir, '404.html');

try {
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    fs.writeFileSync(html200Path, indexHtmlContent);
    fs.writeFileSync(html404Path, indexHtmlContent);
    console.log('Created 200.html and 404.html');
  } else {
    console.error('index.html not found in build directory');
  }

  fs.writeFileSync(redirectsPath, redirectsContent);
  console.log('Created _redirects file in build directory');
} catch (error) {
  console.error('Error creating files:', error);
}
