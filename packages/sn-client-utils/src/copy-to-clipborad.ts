/**
 * Copy to clipboard
 * @param value The string which will be copied
 */
export async function copyToClipboard(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value)
  } catch (error) {
    console.log(error.message)
  }
}
