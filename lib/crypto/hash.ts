export const hash_password = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);

  const memory = await crypto.subtle.digest('SHA-256', data);
  const view = new Uint8Array(memory);

  const hex = [...view].map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hex;
};
