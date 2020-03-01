import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import watch from './watchers';

const app = () => {
  const state = {
    form: {
      inputFieldValue: '',
      sbmtButton: 'blocked',
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

  const form = document.querySelector('form');
  form.addEventListener('input', (e) => {
    e.preventDefault();
    state.form.inputFieldValue = e.target.value;
    if (state.form.inputFieldValue === '' || (!isValidUrl(state.form.inputFieldValue))) {
      state.form.sbmtButton = 'blocked';
    }
    if (isValidUrl(state.form.inputFieldValue)) {
      state.form.sbmtButton = 'active';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.feedsList.push(state.form.inputFieldValue);
    state.form.sbmtButton = 'blocked';
    state.form.inputFieldValue = '';
  });

  watch(state);
};

app();
