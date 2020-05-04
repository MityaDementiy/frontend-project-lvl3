import { watch } from 'melanke-watchjs';
import i18next from 'i18next';

export default (state) => {
  const submitButton = document.getElementById('submitButton');
  const input = document.getElementById('rssInput');
  const container = document.getElementById('column');

  const removeAlert = () => {
    const alert = document.getElementById('alert');
    if (!alert) {
      return;
    }
    alert.remove();
  };

  const createAlert = (fillingState) => {
    removeAlert();
    const alertTypeMapping = {
      processing: 'info',
      success: 'success',
      feedError: 'warning',
      emptySubmit: 'secondary',
      invalid: 'dark',
      networkError: 'danger',
    };
    const alertType = alertTypeMapping[fillingState];
    const alert = document.createElement('div');
    alert.setAttribute('id', 'alert');
    alert.setAttribute('style', 'position: absolute');
    alert.classList.add('alert', `alert-${alertType}`);
    const alertMessagesMapping = {
      danger: i18next.t('alertMessages.danger'),
      info: i18next.t('alertMessages.processing'),
      success: i18next.t('alertMessages.success'),
      warning: i18next.t('alertMessages.warning'),
      dark: i18next.t('alertMessages.invalid'),
      secondary: i18next.t('alertMessages.secondary'),
    };
    alert.textContent = alertMessagesMapping[alertType];
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
    const removeAlertPeriod = 5000;
    switch (formState) {
      case 'emptySubmit':
        createAlert(formState);
        break;
      case 'processing':
        createAlert(formState);
        break;
      case 'success':
        createAlert(formState);
        addPosts(state.posts);
        setTimeout(removeAlert, removeAlertPeriod);
        break;
      case 'feedError':
        createAlert(formState);
        setTimeout(removeAlert, removeAlertPeriod);
        break;
      case 'networkError':
        createAlert(formState);
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
  });
};
