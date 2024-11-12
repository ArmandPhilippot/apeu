---
"apeu": minor
---

Adds an environment variable to configure the content directory path.

By default, this project will look for contents in `./content`. If you want to define another base path, you can use an environment variable named `CONTENT_PATH` (see `.env.example`).

This can be useful to define different data between development and production for example.
