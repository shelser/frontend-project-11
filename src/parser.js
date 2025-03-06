export default (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('errors.notValidRss');
  }
  const feedInfo = doc.querySelector('channel');
  const titleFeed = feedInfo.querySelector('title').textContent;
  const descriptionFeed = feedInfo.querySelector('description').textContent;
  const feed = { titleFeed, descriptionFeed };
  const items = doc.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return { title, link, description };
  });
  return { feed, posts };
};
