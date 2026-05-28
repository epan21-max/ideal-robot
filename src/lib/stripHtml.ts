/**
 * Strip HTML tags from a string and return clean text.
 * Converts common HTML elements to readable formatting.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    // Replace <br>, <br/>, <br /> with newline
    .replace(/<br\s*\/?>/gi, '\n')
    // Replace </p>, </div>, </li> with newline
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    // Replace <hr> with separator
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Clean up excessive newlines (more than 2 in a row)
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim();
}
