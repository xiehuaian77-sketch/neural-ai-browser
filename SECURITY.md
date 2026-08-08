# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. Do **not** open a public issue for security problems.
2. Send details to the maintainers via a private channel if available.
3. Include steps to reproduce, affected versions, and potential impact.
4. Allow time for a fix before public disclosure.

We aim to acknowledge reports within 3 business days and provide an estimated timeline for a fix.

## Security Best Practices for Users

- Do **not** commit `.env` or any file containing real API keys to version control.
- Rotate keys if they are ever exposed.
- Keep dependencies up to date and review changes before upgrading.
- Run the app in a trusted network environment; the dev server binds to `127.0.0.1` by default.
