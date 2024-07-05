export const hashPassword = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);

  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);

  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hex;
};
