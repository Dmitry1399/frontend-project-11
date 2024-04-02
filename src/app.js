import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './view.js';
import resources from './locales/index.js';
import axios from 'axios';
import parserResponse from './parserResponse.js';

const start = (initialState, i18n) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
  };

  const watchedState = onChange(initialState, render(elements, initialState, i18n));

  yup.setLocale({
    string: {
      url: 'invalidUrl',
    },
  });

  const schema = yup.string()
    .trim()
    .url()
    .test('already added feed', 'alreadyAddUrl', function isAlreadyAddFeed(value) {
      const addedUrls = this.options.context.urls;
      return !addedUrls.includes(value);
    })
    .required();

  const getProxyUrl = (url) => {
    const proxyUrl = new URL('https://allorigins.hexlet.app/get?');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', url);

    return proxyUrl;
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sentedUrl = formData.get('url');
    const addedUrls = initialState.feeds;
    schema.validate(sentedUrl, { context: { urls: addedUrls } })
      .then(() => {
        initialState.feeds.push(sentedUrl.trim());
        watchedState.validationForm.statusProcess = 'succees';
        axios.get(getProxyUrl(sentedUrl)).then((data) => console.log(parserResponse(data)));
      })
      .catch((err) => {
        watchedState.validationForm.errors = `message.${err.message}`;
        watchedState.validationForm.statusProcess = 'error';
      });
  });
};

export default () => {
  const initialState = {
    validationForm: {
      statusProcess: 'waiting', // succees,error,filling
      errors: null,
    },
    // loadProcess: {

    // },
    feeds: [],
  // posts: [],
  };

  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    resources,
  }).then(start(initialState, i18n));
};
