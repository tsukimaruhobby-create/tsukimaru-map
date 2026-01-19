# Tsukimaru-map.io

## Security Notice

This endpoint uses `postMessage` with a wildcard origin.
Consumers **must validate `event.origin`** on the parent window
before processing authentication results.
