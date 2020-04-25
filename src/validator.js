import * as yup from 'yup';

const isUniqUrl = (url, feedsUrls) => !feedsUrls.includes(url);
const isUrl = (url) => yup.string().url().required().isValidSync(url);
export default (url, feedsUrls) => isUniqUrl(url, feedsUrls) && isUrl(url);
