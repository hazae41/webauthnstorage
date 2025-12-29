# WebAuthnStorage

Deterministic storage using WebAuthn

```bash
npm install @hazae41/webauthnstorage
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/webauthnstorage)

## About

Use WebAuthn as a authentication-protected storage of arbitrary bytes

This WON'T use any cryptoprocessor (HSM, Secure Enclave) as it stores the bytes in `userHandle` (probably on disk)

This is only used to prevent unauthenticated access to the stored values

Supply-chain attacks, phishing, misclick, phone-left-on-the-table attack would still require user authentication before accessing the data

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies
- Battle-tested on many browsers

## Usage

```tsx
import { webAuthnStorage } from "@hazae41/webauthnstorage"

async function create() {
  /**
   * Generate a new private key
   */
  const bytes = crypto.getRandomValues(new Uint8Array(32))

  /**
   * Store the private key into authenticated storage
   */
  const handle = await webAuthnStorage.create("My Private Key", bytes)
  
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
  const bytes = await webAuthnStorage.get(handle)
}
```

## Limitations

### Storage size

Values must have a maximum length of 64 bytes

https://github.com/w3c/webauthn/issues/1302

I recommend only storing private keys, signatures, and identifiers

### User interation

This requires user interaction on most browsers

e.g. You have to create and get when the user clicks a button

```tsx
const [handle, setHandle] = useState<Uint8Array>()

const onCreateClick = useCallback(async () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const handle = await webAuthnStorage.create("My Private Key", bytes)

  setHandle(handle)
}, [])

const onGetClick = useCallback(async () => {
  const bytes = await webAuthnStorage.get(handle)

  console.log(bytes)
}, [handle])

return <>
  <button onClick={onCreateClick}>
    Create
  </button>
  <button onClick={onGetClick}>
    Get
  </button>
</>
```