import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import en from './locales/en';

i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
});

const container = document.getElementById('column');
const submitButton = document.getElementById('submitButton');
const input = document.getElementById('rssInput');
const form = document.getElementById('formRSS');

const removeAlert = () => {
  const alert = document.getElementById('alert');
  if (!alert) {
    return;
  }
  alert.remove();
};

const createAlert = (alertType) => {
  removeAlert();
  const alert = document.createElement('div');
  alert.setAttribute('id', 'alert');
  alert.setAttribute('style', 'position: absolute');
  alert.classList.add('alert', `alert-${alertType}`);
  const mapping = {
    danger: i18next.t('alertMessages.error'),
    info: i18next.t('alertMessages.processing'),
    success: i18next.t('alertMessages.success'),
  };
  alert.textContent = mapping[alertType];
  container.prepend(alert);
};

const createFeedElement = (title, description, postItems, postsLinks) => {
  const newFeedElement = document.createElement('div');
  newFeedElement.classList.add('border');
  newFeedElement.classList.add('rounded');
  newFeedElement.setAttribute('style', 'padding: 10px; margin-bottom: 10px');
  newFeedElement.setAttribute('id', `${title}`);
  container.append(newFeedElement);
  const feedName = document.createElement('h3');
  feedName.textContent = `${title} — ${description}`;
  newFeedElement.append(feedName);
  const postsList = document.createElement('ul');
  newFeedElement.append(postsList);
  postItems.forEach((item) => {
    const linkIndex = postItems.indexOf(item);
    const postItem = document.createElement('li');
    const postLink = document.createElement('a');
    postLink.setAttribute('href', `${postsLinks[linkIndex]}`);
    postLink.setAttribute('target', '_blank');
    postLink.setAttribute('id', 'href');
    postItem.append(postLink);
    postLink.textContent = item;
    postsList.append(postItem);
    postItem.setAttribute('id', `${item}`);
  });
};

const isDuplicatedElement = (id) => document.getElementById(id);

const updateFeedElements = (title, posts, links) => {
  const feedElement = document.getElementById(title);
  const feedPostsList = feedElement.querySelector('ul');
  const newPosts = posts
    .flat()
    .filter((post) => !isDuplicatedElement(post))
    .reverse();
  const newLinks = links.flat();
  const postsFlat = posts.flat();
  newPosts.forEach((post) => {
    const linkIndex = postsFlat.indexOf(post);
    const newPostItem = document.createElement('li');
    const newPostLink = document.createElement('a');
    newPostLink.setAttribute('href', `${newLinks[linkIndex]}`);
    newPostLink.setAttribute('target', '_blank');
    newPostLink.setAttribute('id', 'href');
    newPostItem.append(newPostLink);
    newPostLink.textContent = `${post}`;
    newPostItem.setAttribute('id', `${post}`);
    feedPostsList.prepend(newPostItem);
  });
};

export default (state) => {
  watch(state.form, 'sbmtButton', () => {
    switch (state.form.sbmtButton) {
      case 'active':
        submitButton.removeAttribute('disabled');
        input.classList.remove('is-invalid');
        break;
      case 'blocked':
        submitButton.setAttribute('disabled', '');
        input.classList.add('is-invalid');
        break;
      case 'waiting-blocked':
        input.classList.remove('is-invalid');
        submitButton.setAttribute('disabled', '');
        break;
      default:
        throw new Error(`Error! '${state.form.sbmtButton}' is unknown state.`);
    }
  });

  watch(state, 'alertType', () => {
    createAlert(state.alertType);
    if (state.alertType !== 'info') {
      setTimeout(removeAlert, 5000);
    }
  });

  watch(state, 'feedsList', () => {
    if (state.feedsList.length === 0) {
      form.reset();
      return;
    }
    const feedTitle = state.feedsList[state.feedsList.length - 1][1];
    const feedDescription = state.feedsList[state.feedsList.length - 1][2];
    const lastFeedPosts = state.feedsList[state.feedsList.length - 1][3];
    const lastFeedLinks = state.feedsList[state.feedsList.length - 1][4];
    if (isDuplicatedElement(feedTitle)) {
      return;
    }
    if (!lastFeedPosts) {
      form.reset();
      return;
    }
    form.reset();
    createFeedElement(feedTitle, feedDescription, lastFeedPosts, lastFeedLinks);
  });

  watch(state, 'updateStatus', () => {
    if (state.updateStatus === 'updated') {
      const feedElements = state.feedsList;
      feedElements.forEach((element) => {
        const elementTitles = element[1];
        const elementPosts = element[3];
        const elementLinks = element[4];
        updateFeedElements(elementTitles, elementPosts, elementLinks);
      });
    }
  });
};
