import sanitizeHtmlLib from 'sanitize-html';

export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'br',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'img',
      'section',
      'article',
      'div',
      'span',
      'button',
      'form',
      'input',
      'label',
      'textarea',
      'select',
      'option',
      'fieldset',
      'legend',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target'],
      img: ['src', 'alt', 'width', 'height'],
      form: ['method', 'action'],
      input: ['type', 'name', 'placeholder', 'required'],
      textarea: ['name', 'placeholder', 'rows', 'cols'],
      select: ['name'],
      option: ['value'],
      button: ['type', 'name'],
      div: ['class', 'id'],
      span: ['class', 'id'],
      section: ['class', 'id'],
      article: ['class', 'id'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    onTagAttr: (tag: string, name: string, value: string) => {
      // Validate img src for Cloudinary URLs only
      if (tag === 'img' && name === 'src') {
        if (!value.startsWith('https://res.cloudinary.com/')) {
          return false;
        }
      }
      return true;
    },
  });
}
