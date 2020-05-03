import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import i18next from 'i18next';
import isValidUrl from './validator';
import watch from './watchers';
import parseRss from './parser';
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
    updateStatus: '',
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
  const updatePeriod = 5000;

  const updateFeeds = () => {
    state.updateStatus = 'updating';
    const urls = state.feeds;
    const addedPosts = state.posts;
    const identificators = addedPosts.map((post) => post.id);
    urls.forEach((url) => {
      const requestURL = `${proxy}${url}`;
      axios.get(requestURL)
        .then((response) => response.data)
        .then((data) => {
          const posts = parseRss(data);
          posts.forEach((post) => {
            const { title, link, feedName } = post;
            const id = `${title}_${feedName}`;
            if (!identificators.includes(id)) {
              state.posts.push({
                title, link, feedName, id,
              });
            }
          });
          state.updateStatus = 'updated';
        })
        .catch((err) => {
          console.log(`We have error: ${err}`);
        });
    });
    setTimeout(updateFeeds, updatePeriod);
  };

  setTimeout(updateFeeds, updatePeriod);

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
    if (!feedUrl) {
      state.form.fillingProcess.state = 'emptySubmit';
      state.inputValues.length = 0;
      return;
    }
    state.inputValues.length = 0;
    state.form.fillingProcess.state = 'processing';
    const requestURL = `${proxy}${feedUrl}`;
    axios.get(requestURL)
      .then((response) => response.data)
      .then((data) => {
        const posts = parseRss(data);
        const reversedPosts = posts.reverse();
        reversedPosts.forEach((post) => {
          const { title, link, feedName } = post;
          const id = `${title}_${feedName}`;
          state.posts.push({
            title, link, feedName, id,
          });
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
