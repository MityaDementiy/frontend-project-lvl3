import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import i18next from 'i18next';
import isValidUrl from './validator';
import watch from './watchers';
import parseData from './parser';
import en from './locales/en';

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
    inputValues: [],
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });

  const form = document.getElementById('formRSS');
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    if (!isValidUrl(inputValue, state.feeds)) {
      state.form.fillingProcess.validationState = 'invalid';
    }
    if (isValidUrl(inputValue, state.feeds)) {
      state.form.fillingProcess.validationState = 'valid';
      state.inputValues.push(inputValue);
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedUrl = state.inputValues[state.inputValues.length - 1];
    state.inputValues.length = 0;
    state.form.fillingProcess.state = 'processing';
    const requestURL = `${proxy}${feedUrl}`;
    axios.get(requestURL)
      .then((response) => response.data)
      .then((data) => {
        const posts = parseData(data);
        posts.forEach((post) => {
          state.posts.push(post);
        });
        state.feeds.push(feedUrl);
        state.form.fillingProcess.state = 'success';
      })
      .catch((err) => {
        state.form.fillingProcess.state = 'error';
        console.log(`We have error: ${err}`);
      });
  });

  watch(state);
};
