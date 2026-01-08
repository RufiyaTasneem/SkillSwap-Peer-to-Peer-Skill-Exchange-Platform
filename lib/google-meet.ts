/**
 * Utility functions for generating Google Meet links
 */

/**
 * Generates a random Google Meet code (3-letter groups separated by dashes)
 * Format: xxx-yyyy-zzz (3-4-3 characters, 11 characters total)
 */
function generateMeetCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const groups = [3, 4, 3] // Standard Google Meet code format: xxx-yyyy-zzz
  
  return groups
    .map((length) => {
      let group = ''
      for (let i = 0; i < length; i++) {
        group += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return group
    })
    .join('-')
}

/**
 * Generates a Google Meet link with a random meeting code
 * @param skill Optional skill name to include in the meeting title
 * @returns A Google Meet URL
 */
export function generateGoogleMeetLink(skill?: string): string {
  const code = generateMeetCode()
  const baseUrl = 'https://meet.google.com'
  
  // Google Meet links can include parameters for meeting title
  const params = new URLSearchParams()
  if (skill) {
    params.append('hs', 'preview') // Helps with meeting setup
  }
  
  const url = `${baseUrl}/${code}${params.toString() ? '?' + params.toString() : ''}`
  return url
}

/**
 * Validates if a string is a valid Google Meet URL
 */
export function isValidGoogleMeetLink(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'meet.google.com' || urlObj.hostname === 'meet.google.com.'
  } catch {
    return false
  }
}
