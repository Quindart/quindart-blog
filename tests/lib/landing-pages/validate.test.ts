import { validateSlug, validateHtml, validateImageUrls } from '@/lib/landing-pages/validate';

describe('validateSlug', () => {
  it('accepts valid slug', () => {
    const result = validateSlug('summer-promo');
    expect(result.valid).toBe(true);
  });

  it('rejects slug with uppercase', () => {
    const result = validateSlug('Summer-Promo');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase');
  });

  it('rejects slug with spaces', () => {
    const result = validateSlug('summer promo');
    expect(result.valid).toBe(false);
  });

  it('rejects slug with special chars', () => {
    const result = validateSlug('summer@promo');
    expect(result.valid).toBe(false);
  });

  it('rejects slug longer than 50 chars', () => {
    const result = validateSlug('a'.repeat(51));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('50');
  });

  it('rejects reserved subdomains', () => {
    const reserved = ['www', 'api', 'admin', 'mail', 'ftp'];
    reserved.forEach((slug) => {
      const result = validateSlug(slug);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('reserved');
    });
  });

  it('accepts slug with numbers and hyphens', () => {
    const result = validateSlug('test-123-slug');
    expect(result.valid).toBe(true);
  });
});

describe('validateHtml', () => {
  it('accepts non-empty HTML', () => {
    const result = validateHtml('<h1>Test</h1>');
    expect(result.valid).toBe(true);
  });

  it('rejects empty HTML', () => {
    const result = validateHtml('');
    expect(result.valid).toBe(false);
  });

  it('rejects whitespace-only HTML', () => {
    const result = validateHtml('   ');
    expect(result.valid).toBe(false);
  });
});

describe('validateImageUrls', () => {
  it('accepts Cloudinary URLs', () => {
    const result = validateImageUrls(['https://res.cloudinary.com/example.jpg']);
    expect(result.valid).toBe(true);
  });

  it('rejects non-Cloudinary URLs', () => {
    const result = validateImageUrls(['https://example.com/image.jpg']);
    expect(result.valid).toBe(false);
  });

  it('rejects non-array input', () => {
    const result = validateImageUrls('not-an-array' as any);
    expect(result.valid).toBe(false);
  });
});
