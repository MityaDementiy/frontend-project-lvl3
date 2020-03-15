const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const titlesCollection = doc.getElementsByTagName('title');
  const channelTitle = titlesCollection[0].textContent;
  const descriptionsCollection = doc.getElementsByTagName('description');
  const channelDescription = descriptionsCollection[0].textContent;
  const titlesArray = Array.from(titlesCollection);
  const postsTitles = titlesArray
    .splice(1, titlesArray.length)
    .map((title) => title.textContent);
  const linksCollection = doc.getElementsByTagName('link');
  const linksArray = Array.from(linksCollection);
  const postsLinks = linksArray
    .splice(1, linksArray.length)
    .map((link) => link.textContent);

  return [channelTitle, channelDescription, postsTitles, postsLinks];
};

export default parseData;
