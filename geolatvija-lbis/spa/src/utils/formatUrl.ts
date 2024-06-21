export const formatUrl = (url: string) => {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return 'https://' + url;
  }
  return url;
};

export const updateUrlsInStringForHref = (content: string): string => {
  const regex: RegExp = /href="([^"]*)"/g;
  let updatedString: string = content;

  const replacedUrls: Set<string> = new Set();

  updatedString = updatedString.replace(regex, (match: string, url: string) => {
    if (!replacedUrls.has(url)) {
      replacedUrls.add(url);
      const formattedUrl: string = formatUrl(url);
      return `href="${formattedUrl}"`;
    }
    return match;
  });

  return updatedString;
};
