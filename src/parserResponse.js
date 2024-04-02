export default (response) => {
  const domParser = new DOMParser();
  const content = response.data.contents;
  const parsed = domParser.parseFromString(content, 'text/xml');
  const parseError = parsed.querySelector('parsererror');

  if (parseError) throw new Error('parseError');
  const { children } = parsed.querySelector('channel');
  const staticCollection = [...children];
  const titleFeed = staticCollection.find((el) => el.tagName === 'title').textContent;
  const desctiptionFeed = staticCollection.find((el) => el.tagName === 'description').textContent;
  const itemsFeed = staticCollection.filter((el) => el.tagName === 'item');
  const posts = itemsFeed.map((post) => {
    const titlePost = post.querySelector('title').textContent;
    const linkPost = post.querySelector('link').textContent;
    const descriptionPost = post.querySelector('description').textContent;
    return { titlePost, linkPost, descriptionPost };
  });
  return { titleFeed, desctiptionFeed, posts };
};
