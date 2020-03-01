import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import watch from './watchers';

const state = {
  form: {
    inputFieldValue: '',
    sbmtButton: 'waiting-blocked',
  },
  feedsList: [],
};

const isValidUrl = (string) => {
  const isUrl = () => yup.string().url().required().isValidSync(string);
  const isUniq = () => !state.feedsList.includes(string);
  if (isUrl(string) && isUniq(string)) {
    return true;
  }
  return false;
};

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('input', (e) => {
    e.preventDefault();
    state.form.inputFieldValue = e.target.value;
    if (state.form.inputFieldValue === '') {
      state.form.sbmtButton = 'waiting-blocked';
    }
    if ((!isValidUrl(state.form.inputFieldValue)) && state.form.inputFieldValue !== '') {
      state.form.sbmtButton = 'blocked';
    }
    if (isValidUrl(state.form.inputFieldValue)) {
      state.form.sbmtButton = 'active';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.feedsList.push(state.form.inputFieldValue);
    state.form.sbmtButton = 'waiting-blocked';
    state.form.inputFieldValue = '';
  });

  watch(state);
};

app();
