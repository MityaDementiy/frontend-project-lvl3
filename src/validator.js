import * as yup from 'yup';

export default (url, feedsUrls) => yup.string().notOneOf(feedsUrls).url().isValidSync(url);
