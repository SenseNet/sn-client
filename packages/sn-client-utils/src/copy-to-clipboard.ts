/**
 * Copy to clipboard
 * @param value The string which will be copied
 * @returns @boolean as a result of the operation.
 * @error it will out a console.log with message
 */
export async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch (error) {
    console.log(error.message)
    return false
  }
}
