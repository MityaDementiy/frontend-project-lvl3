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
  lastFeed: {
    title: '',
    description: '',
  },
};

const proxy = 'https://cors-anywhere.herokuapp.com/';

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
    state.feedsList.push([state.form.inputFieldValue]);
    state.form.sbmtButton = 'waiting-blocked';
    state.form.inputFieldValue = '';
    const newFeedUrl = state.feedsList[state.feedsList.length - 1];
    const requestURL = `${proxy}${newFeedUrl}`;
    axios.get(requestURL)
      .then((response) => response.data)
      .then((data) => {
        const [channelTitle, channelDescription, postsTitles, postsLinks] = parseData(data);
        state.lastFeed.title = channelTitle;
        state.lastFeed.description = channelDescription;
        state.feedsList[state.feedsList.length - 1].push(postsTitles);
        state.feedsList[state.feedsList.length - 1].push(postsLinks);
      });
  });

  watch(state);
};

app();
