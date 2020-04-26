import { watch } from 'melanke-watchjs';
import i18next from 'i18next';

export default (state) => {
  const sbmtButton = document.getElementById('submitButton');
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
      error: 'danger',
      emptySubmit: 'warning',
    };
    const alertType = alertTypeMapping[fillingState];
    const alert = document.createElement('div');
    alert.setAttribute('id', 'alert');
    alert.setAttribute('style', 'position: absolute');
    alert.classList.add('alert', `alert-${alertType}`);
    const alertMessagesMapping = {
      danger: i18next.t('alertMessages.error'),
      info: i18next.t('alertMessages.processing'),
      success: i18next.t('alertMessages.success'),
      warning: i18next.t('alertMessages.warning'),
    };
    alert.textContent = alertMessagesMapping[alertType];
    container.prepend(alert);
  };

  const isUniq = (id) => !document.getElementById(id);

  const addPosts = (posts) => {
    const postsList = document.getElementById('postsList');
    const uniqPosts = posts
      .filter((post) => isUniq(post.title))
      .reverse();
    uniqPosts.forEach((post) => {
      const postItem = document.createElement('li');
      const postLink = document.createElement('a');
      postLink.textContent = `${post.title} — ${post.feedName}`;
      postLink.setAttribute('href', `${post.link}`);
      postLink.setAttribute('target', '_blank');
      postItem.append(postLink);
      postItem.setAttribute('id', `${post.title}`);
      postsList.prepend(postItem);
    });
  };

  watch(state.form.fillingProcess, 'validationState', () => {
    input.classList.toggle('is-invalid');
    sbmtButton.toggleAttribute('disabled');
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
      case 'error':
        createAlert(formState);
        setTimeout(removeAlert, removeAlertPeriod);
        break;
      default:
        throw new Error(`Error! '${formState}' is unknown state.`);
    }
    form.reset();
  });
};
