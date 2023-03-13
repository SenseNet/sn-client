/**
 * Copy to clipboard
 * @param value The string which will be copied
 * @returns The error message or true if the operation succeeded.
 */
export async function copyToClipboard(value: string): Promise<string | true> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch (error) {
    return error.message
  }
}
