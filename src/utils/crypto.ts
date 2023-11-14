export function encrypt(text: string, key: string): string {
  let encrypted = ''
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length)
    const encryptedChar = text.charCodeAt(i) ^ keyChar
    encrypted += String.fromCharCode(encryptedChar)
  }
  return btoa(encrypted)
}
export function decrypt(encryptedText: string, key: string): string {
  const decrypted = atob(encryptedText)
  let originalText = ''
  for (let i = 0; i < decrypted.length; i++) {
    const keyChar = key.charCodeAt(i % key.length)
    const decryptedChar = decrypted.charCodeAt(i) ^ keyChar
    originalText += String.fromCharCode(decryptedChar)
  }
  return originalText
}
