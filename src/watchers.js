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
    };
    alert.textContent = alertMessagesMapping[alertType];
    container.prepend(alert);
  };

  watch(state.form.fillingProcess, 'validationState', () => {
    input.classList.toggle('is-invalid');
    sbmtButton.toggleAttribute('disabled');
  });

  watch(state.form.fillingProcess, 'state', () => {
    if (state.form.fillingProcess.state === 'filling') {
      return;
    }
    const removeAlertPeriod = 5000;
    createAlert(state.form.fillingProcess.state);
    if (state.form.fillingProcess.state !== 'processing') {
      setTimeout(removeAlert, removeAlertPeriod);
    }
  });
};
