import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
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
        inputValue: '',
      },
    },
    feeds: [],
    posts: [],
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
    const feedsUrls = state.feeds;
    const currentPosts = state.posts;
    const requestsResponses = feedsUrls.map((url) => axios.get(`${proxy}${url}`));
    Promise.all(requestsResponses)
      .then((responses) => {
        responses.forEach(({ data }) => {
          const posts = parseRss(data);
          const newPosts = _.differenceBy(posts, currentPosts, (post) => `${post.title}_${post.feedName}`);
          newPosts.forEach((post) => {
            const { title, link, feedName } = post;
            const id = `${title}_${feedName}`;
            state.posts.push({
              title, link, feedName, id,
            });
          });
        });
      })
      .catch((err) => {
        state.updateStatus = 'updateFailed';
        console.log(err);
      })
      .finally(() => {
        state.updateStatus = 'updated';
        setTimeout(updateFeeds, updatePeriod);
      });
  };

  setTimeout(updateFeeds, updatePeriod);

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const inputValue = e.target.value;
    if (isValidUrl(inputValue, state.feeds)) {
      state.form.fillingProcess.validationState = 'valid';
      state.form.fillingProcess.inputValue = inputValue;
    } else {
      state.form.fillingProcess.validationState = 'invalid';
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedUrl = state.form.fillingProcess.inputValue;
    if (!feedUrl) {
      state.form.fillingProcess.state = 'emptySubmit';
      return;
    }
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
        state.form.fillingProcess.inputValue = '';
        state.form.fillingProcess.state = 'success';
      })
      .catch((err) => {
        if (err.response) {
          state.form.fillingProcess.state = 'networkError';
          state.form.fillingProcess.inputValue = '';
          console.log(err);
        } else {
          state.form.fillingProcess.state = 'feedError';
          state.form.fillingProcess.inputValue = '';
          console.log(err);
        }
      });
  });

  watch(state);
};
