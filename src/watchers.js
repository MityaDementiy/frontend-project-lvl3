import { watch } from 'melanke-watchjs';
import en from './locales/en';

export default (state) => {
  const sbmtButton = document.getElementById('submitButton');
  const input = document.getElementById('rssInput');
  watch(state.form.fillingProcess, 'validationState', () => {
    input.classList.toggle('is-invalid');
    sbmtButton.toggleAttribute('disabled');
  });
};
