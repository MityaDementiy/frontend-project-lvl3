import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import watch from './watchers';


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
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'application/xml');
        const titlesCollection = doc.getElementsByTagName('title');
        const channelTitle = titlesCollection[0].textContent;
        const descriptionsCollection = doc.getElementsByTagName('description');
        const channelDescription = descriptionsCollection[0].textContent;
        state.lastFeed.title = channelTitle;
        state.lastFeed.description = channelDescription;
        const titlesArray = Array.from(titlesCollection);
        const postsTitlesArray = titlesArray.splice(1, titlesArray.length);
        const postsTitles = postsTitlesArray.map((title) => title.textContent);
        state.feedsList[state.feedsList.length - 1].push(postsTitles);
        const linksCollection = doc.getElementsByTagName('link');
        const linksArray = Array.from(linksCollection);
        const postLinks = linksArray.splice(1, linksArray.length)
          .map((link) => link.textContent);
        state.feedsList[state.feedsList.length - 1].push(postLinks);
      });
  });

  watch(state);
};

app();
