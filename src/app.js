import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
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
};
