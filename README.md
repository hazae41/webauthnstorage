# WebAuthnStorage

Deterministic storage using WebAuthn

```bash
npm i @hazae41/webauthnstorage
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/webauthnstorage)

## About

Use WebAuthn as a authentication-protected storage of arbitrary bytes

This WON'T use any cryptoprocessor (HSM, Secure Enclave) as it stores the bytes in `userHandle` (probably on disk)

This is only used to prevent unauthenticated access to the stored values

Supply-chain attacks, phishing, misclick, phone-left-on-the-table attack would still require user approval before accessing the data

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Battle-tested on many browsers

## Usage

```tsx
import { WebAuthnStorage } from "@hazae41/webauthnstorage"

async function create() {
  /**
   * Generate a new private key
   */
  const bytes = crypto.getRandomValues(new Uint8Array(32))

  /**
   * Store the private key into authenticated storage
   */
  const handle = await WebAuthnStorage.create("My Private Key", bytes)
  
  /**
   * Store the handle to the private key into some unauthenticated storage
   */
  const cache = await caches.open("my-storage")
  const request = new Request("my-private-key")
  const response = new Response(handle)
  await cache.put(request, response)
}

async function get() {
  /**
   * Retrieve the handle to the private key from some unauthenticated storage
   */
  const cache = await caches.open("my-storage")
  const request = new Request("my-private-key")
  const response = await cache.match(request)
  const handle = new Uint8Array(await response.arrayBuffer())

  /**
   * Retrieve the private key from authenticated storage
   */
  const bytes = await WebAuthnStorage.get(handle)
}
```