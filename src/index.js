import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import watch from './watchers';
import parseData from './parser';

const state = {
  form: {
    inputFieldValue: '',
    sbmtButton: 'waiting-blocked',
  },
  feedsList: [],
  alertType: '',
  updateStatus: 'ready',
};

const proxy = 'https://cors-anywhere.herokuapp.com/';
const updatePeriod = 5000;

const isValidUrl = (string) => {
  const isUrl = () => yup.string().url().required().isValidSync(string);
  const isUniq = () => {
    const feedsArray = state.feedsList;
    const feedsUrls = feedsArray.map((feed) => feed[0]);
    if (!feedsUrls.flat().includes(string)) {
      return true;
    }
    return false;
  };
  if (isUrl(string) && isUniq(string)) {
    return true;
  }
  return false;
};

const updateFeeds = () => {
  const urlsToUpdate = state.feedsList.map((feed) => feed[0]);
  if (urlsToUpdate.length < 1) {
    return;
  }
  state.updateStatus = 'updating';
  urlsToUpdate.forEach((url) => {
    const requestURL = `${proxy}${url}`;
    const feedTitles = state.feedsList
      .filter((el) => el[0] === url)
      .map((el) => el[3]);
    const feedUrls = state.feedsList
      .filter((el) => el[0] === url)
      .map((el) => el[4]);
    axios.get(requestURL)
      .then((response) => response.data)
      .then((data) => {
        const [, , postTitles, postLinks] = parseData(data);
        const newPostTitles = postTitles.filter((title) => !feedTitles.includes(title));
        const newPostLinks = postLinks.filter((link) => !feedUrls.includes(link));
        state.feedsList.forEach((feedElement) => {
          if (feedElement[0] === url) {
            feedElement[3].push(newPostTitles);
            feedElement[4].push(newPostLinks);
          }
        });
      })
      .catch((err) => {
        console.log(`We have error: ${err}`);
      })
      .finally(() => {
        state.updateStatus = 'updated';
      });
  });
  setTimeout(updateFeeds, updatePeriod);
};

const inputHandler = (e) => {
  e.preventDefault();
  state.form.inputFieldValue = e.target.value;
  state.alertType = '';
  if (state.form.inputFieldValue === '') {
    state.form.sbmtButton = 'waiting-blocked';
    state.alertType = '';
  }
  if ((!isValidUrl(state.form.inputFieldValue)) && state.form.inputFieldValue !== '') {
    state.form.sbmtButton = 'blocked';
  }
  if (isValidUrl(state.form.inputFieldValue)) {
    state.form.sbmtButton = 'active';
  }
};

const submitHandler = (e) => {
  e.preventDefault();
  state.feedsList.push([state.form.inputFieldValue]);
  state.form.sbmtButton = 'waiting-blocked';
  state.form.inputFieldValue = '';
  const newFeedUrl = state.feedsList[state.feedsList.length - 1];
  const requestURL = `${proxy}${newFeedUrl}`;
  state.alertType = 'info';
  axios.get(requestURL)
    .then((response) => response.data)
    .then((data) => {
      const [channelTitle, channelDescription, postsTitles, postsLinks] = parseData(data);
      state.feedsList[state.feedsList.length - 1]
        .push(channelTitle, channelDescription, postsTitles, postsLinks);
      state.alertType = 'success';
    })
    .catch((err) => {
      state.alertType = 'danger';
      state.feedsList.pop();
      console.log(`We have error: ${err}`);
    });
  if (state.feedsList.length === 1) {
    setTimeout(updateFeeds, updatePeriod);
  }
};

const app = () => {
  const form = document.querySelector('form');
  form.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitHandler);
  watch(state);
};

app();
