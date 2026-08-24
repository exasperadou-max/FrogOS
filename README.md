# FrogOS

A small desktop-style operating system that runs in the browser. Built with plain HTML, CSS, and JavaScript, with a Python (FastAPI) backend that proxies web pages so they can be viewed inside the built-in browser app.

## Features

- Desktop UI with draggable, resizable, minimizable, and maximizable windows
- Top bar with clock and bottom dock with app icons
- **Frog Notes** — a notes app with a sidebar list, add/delete, and autosave.
- **Frog Browser** — a simple in-app browser that searches Ecosia and loads pages through a proxy, with back/forward/reload, shortcuts, and an "open in new tab" fallback when a page can't be embedded

## Project structure

```
index.html   Markup for the desktop, windows, and apps
style.css    Styling and layout
script.js    Window management, notes app, and browser app logic
proxy.py     FastAPI proxy server used by the browser app
```

## Live

https://frog-os-weld.vercel.app/

## Proxy

The browser app fetches pages through a proxy server instead of loading them directly, since most sites block being embedded in an iframe.
If a page can't be proxied or embedded, the frontend shows a message and offers to open it in a new tab instead.

## Notes app storage

Notes are stored in the browser's `localStorage`, keyed under a fixed storage key defined in `script.js`. There is no server-side storage or sync — notes are local to the browser they were created in.

## Browser app notes

- Only `http` and `https` URLs are allowed
- Search queries entered in the address bar or home screen are sent to Ecosia
- Typed URLs without a scheme are assumed to be `https://`
