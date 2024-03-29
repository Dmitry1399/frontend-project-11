import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';

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

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
};

const watchedState = onChange(initialState, render(elements, initialState));

const schema = yup.string()
  .trim()
  .url()
  .test('already added feed', 'this feed has already been added', function (value) {
    const addedUrls = this.options.context.urls;
    return !addedUrls.includes(value);
  })
  .required();

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const sentedUrl = formData.get('url');
  const addedUrls = initialState.feeds;
  schema.validate(sentedUrl, { context: { urls: addedUrls } })
    .then(() => {
      initialState.feeds.push(sentedUrl.trim());
      watchedState.validationForm.statusProcess = 'succees';
    })
    .catch((err) => {
      watchedState.validationForm.errors = err.message;
      watchedState.validationForm.statusProcess = 'error';
    });
});

export default () => {
};
