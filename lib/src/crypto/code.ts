export const generateCode = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return bytes.reduce((acc, n) => acc + n.toString(10), '');
};
