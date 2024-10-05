import { KEY_CONFIG } from '/lib/data/constants.ts';

const load_key = async () => {
  try {
    const jwk = await Deno.readTextFile('./key.json');
    return crypto.subtle.importKey(
      'jwk',
      JSON.parse(jwk),
      ...KEY_CONFIG,
    );
  } catch {
    const key = await crypto.subtle.generateKey(...KEY_CONFIG) as CryptoKey;

    const data = await crypto.subtle.exportKey('jwk', key);
    Deno.writeTextFile('./key.json', JSON.stringify(data, null, 2));

    return key;
  }
};

export const key = await load_key();
