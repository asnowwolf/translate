const includePattern = /^link:([-\w\/]+\.adoc)\[]$/;

export function restoreIncludeUrl(linkUrl: string): string {
  return linkUrl.replace(includePattern, 'include::$1[]');
}
