export const escapeHtml =  (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/, "&quot;")
    .replace(/'/g, "&#039;")
}