const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const feedName = doc.querySelector('title').textContent;
  const feedItems = doc.querySelectorAll('item');
  const posts = [];
  feedItems.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const post = {
      title,
      link,
      feedName,
    };
    posts.push(post);
  });
  return posts;
};
export default parseData;
