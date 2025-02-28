export default function CustomLink({ href, children }) {
    const isExternal = href.startsWith('http');
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    );
  }
  