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
};

const proxy = 'https://cors-anywhere.herokuapp.com/';

const isValidUrl = (string) => {
  const isUrl = () => yup.string().url().required().isValidSync(string);
  const isUniq = () => {
    const feedsArray = state.feedsList;
    const feedsTitles = feedsArray.map((feed) => feed[0]);
    if (!feedsTitles.flat().includes(string)) {
      return true;
    }
    return false;
  };
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
  });

  form.addEventListener('submit', (e) => {
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
        state.form.sbmtButton = 'waiting-blocked';
        console.log(`We have error: ${err}`);
      });
  });

  watch(state);
};

app();
