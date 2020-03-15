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

const point = document.getElementById('point');

const container = document.createElement('div');
container.classList.add('container-fluid');
point.append(container);

const row = document.createElement('div');
row.classList.add('row');
row.classList.add('justify-content-center');
container.append(row);

const col = document.createElement('div');
col.classList.add('col-sm-6');
col.classList.add('col-12');
row.append(col);

const jumbotron = document.createElement('div');
jumbotron.classList.add('jumbotron');
col.append(jumbotron);

const form = document.createElement('form');
form.setAttribute('id', 'form');
jumbotron.append(form);

const inputDiv = document.createElement('div');
inputDiv.classList.add('form-group');
form.append(inputDiv);
const label = document.createElement('label');
label.textContent = i18next.t('formTexts.addURL');
inputDiv.append(label);

const input = document.createElement('input');
input.classList.add('form-control');
inputDiv.append(input);

const submitButton = document.createElement('button');
submitButton.classList.add('btn-primary');
submitButton.classList.add('btn');
submitButton.setAttribute('type', 'submit');
submitButton.setAttribute('disabled', '');
submitButton.textContent = i18next.t('formTexts.addButton');
form.append(submitButton);

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
  if (alertType === 'danger') {
    alert.textContent = i18next.t('alertMessages.error');
  }
  if (alertType === 'info') {
    alert.textContent = i18next.t('alertMessages.processing');
  }
  if (alertType === 'success') {
    alert.textContent = i18next.t('alertMessages.success');
  }
  col.prepend(alert);
};

const createFeedElement = (title, description, postItems, postsLinks) => {
  const newFeedElement = document.createElement('div');
  newFeedElement.classList.add('border');
  newFeedElement.classList.add('rounded');
  newFeedElement.setAttribute('style', 'padding: 10px');
  newFeedElement.setAttribute('id', `${title}`);
  col.append(newFeedElement);
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
    postItem.append(postLink);
    postLink.textContent = item;
    postsList.append(postItem);
    postItem.setAttribute('id', `${item}`);
  });
};

const isDuplicatedFeedElement = (id) => document.getElementById(id);

export default (state) => {
  watch(state.form, 'sbmtButton', () => {
    if (state.form.sbmtButton === 'active') {
      submitButton.removeAttribute('disabled');
      input.classList.remove('is-invalid');
    }
    if (state.form.sbmtButton === 'blocked') {
      submitButton.setAttribute('disabled', '');
      input.classList.add('is-invalid');
    }
    if (state.form.sbmtButton === 'waiting-blocked') {
      input.classList.remove('is-invalid');
      submitButton.setAttribute('disabled', '');
    }
  });

  watch(state, 'alertType', () => {
    createAlert(state.alertType);
    if (state.alertType !== 'info') {
      setTimeout(removeAlert, 5000);
    }
  });

  watch(state, 'feedsList', () => {
    const feedTitle = state.feedsList[state.feedsList.length - 1][1];
    const feedDescription = state.feedsList[state.feedsList.length - 1][2];
    const lastFeedPosts = state.feedsList[state.feedsList.length - 1][3];
    const lastFeedLinks = state.feedsList[state.feedsList.length - 1][4];
    if (isDuplicatedFeedElement(feedTitle)) {
      return;
    }
    if (!lastFeedPosts) {
      form.reset();
      return;
    }
    form.reset();
    createFeedElement(feedTitle, feedDescription, lastFeedPosts, lastFeedLinks);
  });
};
