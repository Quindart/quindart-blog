import { sanitizeHtml } from '@/lib/landing-pages/sanitize';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const dirty = '<div><script>alert("xss")</script>Content</div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('script');
    expect(clean).toContain('Content');
  });

  it('preserves safe HTML tags', () => {
    const safe = '<h1>Title</h1><p>Paragraph</p><a href="https://example.com">Link</a>';
    const clean = sanitizeHtml(safe);
    expect(clean).toContain('<h1>');
    expect(clean).toContain('<p>');
    expect(clean).toContain('<a');
  });

  it('removes onclick handlers', () => {
    const dirty = '<button onclick="alert(1)">Click</button>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('onclick');
    expect(clean).toContain('button');
  });

  it('allows img tags with src', () => {
    const html = '<img src="https://res.cloudinary.com/example.jpg" alt="test" />';
    const clean = sanitizeHtml(html);
    expect(clean).toContain('<img');
    expect(clean).toContain('src=');
  });

  it('removes iframe tags', () => {
    const dirty = '<iframe src="https://evil.com"></iframe>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('iframe');
  });

  it('preserves form elements', () => {
    const html = '<form><input type="email" /><button>Submit</button></form>';
    const clean = sanitizeHtml(html);
    expect(clean).toContain('<form');
    expect(clean).toContain('<input');
  });
});
