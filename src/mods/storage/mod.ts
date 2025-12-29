/**
 * Use WebAuthn to store authentication-protected arbitrary bytes
 * 
 * @param name user-friendly name for the data
 * @param data arbitrary data of 64 bytes or less
 * @returns handle to the data
 */
export async function createOrThrow(name: string, data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
      rp: {
        id: location.hostname,
        name: location.hostname
      },
      user: {
        id: data,
        name: name,
        displayName: name
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -8 },
        { type: "public-key", alg: -257 }
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform"
      }
    }
  }) as unknown as { rawId: ArrayBuffer }

  return new Uint8Array(credential.rawId)
}

/**
 * Use WebAuthn to retrieve authentication-protected arbitrary bytes
 * 
 * @param id handle to the data
 * @returns data
 */
export async function getOrThrow(id: Uint8Array<ArrayBuffer>): Promise<Uint8Array> {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
      allowCredentials: [{ type: "public-key", id }],
    }
  }) as unknown as { response: { userHandle: ArrayBuffer } }

  return new Uint8Array(credential.response.userHandle)
}