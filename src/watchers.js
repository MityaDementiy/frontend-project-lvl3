import { watch } from 'melanke-watchjs';
import i18next from 'i18next';

export default (state) => {
  const submitButton = document.getElementById('submitButton');
  const input = document.getElementById('rssInput');
  const container = document.getElementById('column');
  const removeAlertPeriod = 5000;

  const removeAlert = () => {
    const alert = document.getElementById('alert');
    if (!alert) {
      return;
    }
    alert.remove();
  };

  const createAlert = (messageTrigger) => {
    removeAlert();
    const alert = document.createElement('div');
    alert.setAttribute('id', 'alert');
    alert.setAttribute('style', 'position: absolute');
    alert.classList.add('alert', 'alert-info');
    const alertMessagesMapping = {
      networkError: i18next.t('alertMessages.networkError'),
      processing: i18next.t('alertMessages.processing'),
      success: i18next.t('alertMessages.success'),
      feedError: i18next.t('alertMessages.feedError'),
      invalid: i18next.t('alertMessages.invalid'),
      emptySubmit: i18next.t('alertMessages.emptySubmit'),
      updatingError: i18next.t('alertMessages.updatingError'),
    };
    alert.textContent = alertMessagesMapping[messageTrigger];
    container.prepend(alert);
  };

  const addPosts = (posts) => {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';
    posts.forEach((post) => {
      const postItem = document.createElement('li');
      const postLink = document.createElement('a');
      postLink.textContent = `${post.title} — ${post.feedName}`;
      postLink.setAttribute('href', `${post.link}`);
      postLink.setAttribute('target', '_blank');
      postItem.append(postLink);
      postItem.setAttribute('id', `${post.id}`);
      postsList.prepend(postItem);
    });
  };

  watch(state.form.fillingProcess, 'validationState', () => {
    input.classList.toggle('is-invalid');
    submitButton.toggleAttribute('disabled');
    const urlCheckingState = state.form.fillingProcess.validationState;
    switch (urlCheckingState) {
      case 'invalid':
        createAlert(urlCheckingState);
        break;
      case 'valid':
        removeAlert();
        break;
      default:
        throw new Error(`Error! '${urlCheckingState}' is unknown state.`);
    }
  });

  watch(state.form.fillingProcess, 'state', () => {
    const formState = state.form.fillingProcess.state;
    if (formState === 'filling') {
      return;
    }
    const form = document.getElementById('formRSS');
    switch (formState) {
      case 'emptySubmit':
      case 'processing':
        createAlert(formState);
        break;
      case 'feedError':
      case 'networkError':
        createAlert(formState);
        setTimeout(removeAlert, removeAlertPeriod);
        break;
      case 'success':
        createAlert(formState);
        addPosts(state.posts);
        setTimeout(removeAlert, removeAlertPeriod);
        break;
      default:
        throw new Error(`Error! '${formState}' is unknown state.`);
    }
    form.reset();
  });

  watch(state, 'updateStatus', () => {
    if (state.updateStatus === 'updated') {
      addPosts(state.posts);
    }
    if (state.updateStatus === 'updateFailed') {
      createAlert('updatingError');
      setTimeout(removeAlert, removeAlertPeriod);
    }
  });
};
