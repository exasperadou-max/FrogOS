# FrogOS

A small operating system that runs in the browser. Built in HTML, CSS, JavaScript and Python for the proxy, so webpages can be viewed inside the built-in browser app.

## Features

- Desktop UI with draggable, minimizable, and maximizable windows
- Top bar with clock and bottom dock with app icons
- **Frog Notes** : a notes app with a sidebar list, add/delete, and autosave.
- **Frog Browser** : a browser that searches Ecosia and loads pages through a proxy, with back/forward/reload buttons

## Project structure

```
index.html   Desktop, windows, and apps
style.css    Styling and Layout
script.js    Script Logic for the windows
proxy.py     FastAPI proxy server used by the browser app
```

## Live

https://frog-os-weld.vercel.app/

## Proxy

The browser app fetches pages through a proxy server instead of loading them directly, since most sites block being embedded in an iframe.
If a page can't be proxied or embedded, the frontend shows a message and invites the user to open it in a new tab instead.

