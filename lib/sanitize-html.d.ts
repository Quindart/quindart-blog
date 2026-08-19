declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    disallowedTagsMode?: 'discard' | 'escape' | 'recursiveEscape';
    selfClosing?: string[];
    allowProtocolRelative?: boolean;
    allowedSchemes?: string[];
    allowedSchemesByTag?: Record<string, string[]>;
    allowedSchemesAppliedToAllTags?: boolean;
    enforceHtmlBoundary?: boolean;
    parseStyleAttributes?: boolean;
    nonTextTags?: string[];
    textFilter?: (text: string) => string;
    onTagAttr?: (tag: string, name: string, value: string) => boolean;
    transformTags?: Record<string, ((tagName: string, attribs: Record<string, string>) => {tagName: string; attribs: Record<string, string>} | false)>;
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string;
  export = sanitizeHtml;
}
