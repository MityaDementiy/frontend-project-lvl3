import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import isValidUrl from './validator';
import watch from './watchers';
import parseData from './parser';

export default () => {
  const state = {
    form: {
      fillingProcess: {
        state: '',
        validationState: 'valid',
      },
    },
    feeds: [],
    posts: [],
    postsLinks: [],
  };

  const form = document.getElementById('formRSS');
  form.addEventListener('input', (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    if (!isValidUrl(inputValue, state.feeds)) {
      state.form.fillingProcess.validationState = 'invalid';
    }
    if (isValidUrl(inputValue, state.feeds)) {
      state.form.fillingProcess.validationState = 'valid';
    }
  });
  watch(state);
};
