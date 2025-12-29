/**
 * Use WebAuthn to store authentication-protected arbitrary bytes
 *
 * @param name user-friendly name for the data
 * @param data arbitrary data of 64 bytes or less
 * @returns handle to the data
 */
declare function createOrThrow(name: string, data: Uint8Array): Promise<Uint8Array>;
/**
 * Use WebAuthn to retrieve authentication-protected arbitrary bytes
 *
 * @param id handle to the data
 * @returns data
 */
declare function getOrThrow(id: Uint8Array): Promise<Uint8Array>;

export { createOrThrow, getOrThrow };
