export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a slug for a landing page
 * Rules:
 * - Cannot be empty
 * - Must be 50 characters or less
 * - Cannot contain reserved words (www, api, admin, mail, ftp, smtp, imap)
 * - Must only contain lowercase letters, numbers, and hyphens
 * - Cannot start or end with a hyphen
 */
export function validateSlug(slug: string): ValidationResult {
  // Check if empty
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Slug cannot be empty' };
  }

  // Check length
  if (slug.length > 50) {
    return { valid: false, error: 'Slug must be 50 characters or less' };
  }

  // Check for reserved words
  const reserved = ['www', 'api', 'admin', 'mail', 'ftp', 'smtp', 'imap'];
  if (reserved.includes(slug)) {
    return { valid: false, error: `Slug "${slug}" is reserved` };
  }

  // Check pattern: lowercase letters, numbers, hyphens only, not starting/ending with hyphen
  const slugPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!slugPattern.test(slug)) {
    return { valid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
  }

  return { valid: true };
}

/**
 * Validates HTML content
 * Rules:
 * - Cannot be empty or whitespace-only
 */
export function validateHtml(html: string): ValidationResult {
  if (!html || html.trim().length === 0) {
    return { valid: false, error: 'HTML cannot be empty' };
  }

  return { valid: true };
}

/**
 * Validates image URLs
 * Rules:
 * - Must be an array
 * - All URLs must be from Cloudinary (start with https://res.cloudinary.com/)
 */
export function validateImageUrls(urls: any): ValidationResult {
  // Check if it's an array
  if (!Array.isArray(urls)) {
    return { valid: false, error: 'Images must be an array' };
  }

  // Check if all URLs are from Cloudinary
  for (const url of urls) {
    if (!url.startsWith('https://res.cloudinary.com/')) {
      return { valid: false, error: 'All image URLs must be from Cloudinary' };
    }
  }

  return { valid: true };
}
