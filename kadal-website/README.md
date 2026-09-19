# Kadal website

A static website with all HTML, CSS, JavaScript, and images included. No npm install, build step, account, or API keys required.

## Run locally

1. Extract the ZIP and open a terminal in the `kadal-website` folder.
2. Run:

   macOS / Linux: `python3 -m http.server 8000 --bind 127.0.0.1`

   Windows: `py -m http.server 8000 --bind 127.0.0.1`

3. Open http://localhost:8000 in your browser.
4. Press Ctrl+C in the terminal to stop the server.

Python 3 must be installed for these commands. Alternatively, open this folder in VS Code and use the Live Server extension on index.html.

## Edit the site

- index.html: page content and layout
- style.css: typography, colours, layout, and CSS animations
- app.js: general interactions
- publishing.js: scroll narratives, tabs, and orchestration
- precision.js: interactive publishing previews and animation controls
- network.js: interactive fibre and particle visuals
- PNG and WebP files: bundled branding and photography

Save changes and refresh your browser to see them. Local edits do not automatically change the hosted website.

Google Fonts needs internet access; the site uses a system font fallback offline. Marketing demonstrations and the video placeholder are not connected to a backend.
