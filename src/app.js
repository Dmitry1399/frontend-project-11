import _ from 'lodash';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import render from './view.js';
import resources from './locales/index.js';
import parserResponse from './parserResponse.js';

const start = (initialState, i18n) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    content: {
      posts: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),
    },
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
      const { addedUrls } = this.options;
      return !addedUrls.includes(value);
    })
    .required();

  const initFeedsAndPosts = (content, url) => {
    const { titleFeed: title, descriptionFeed: description, items } = content;
    const idForFeed = _.uniqueId();

    const feed = {
      title,
      description,
      url,
      id: idForFeed,
    };

    const initPosts = items.map((item) => {
      const postId = _.uniqueId();
      return {
        ...item,
        id: postId,
        idForFeed,
      };
    });

    const posts = initPosts.reverse();
    return { feed, posts };
  };

  const getProxyUrl = (url) => {
    const proxyUrl = new URL('https://allorigins.hexlet.app/get?');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', url);

    return proxyUrl;
  };

  function updateUrl() {
    const { feeds, posts } = initialState;

    const gettingFeedsAndPosts = feeds.map(({ url }) => {
      const proxyUrl = getProxyUrl(url);

      return axios.get(proxyUrl)
        .then(parserResponse)
        .then((data) => initFeedsAndPosts(data, url));
    });

    const result = Promise.all(gettingFeedsAndPosts);

    result
      .then((newContent) => {
        const refreshedPosts = newContent.reduce((acc, feedsAndPosts) => {
          acc.push(...feedsAndPosts.posts);
          return acc;
        }, []);

        const comparator = (first, second) => first.titlePost === second.titlePost;
        const newPost = _.differenceWith(refreshedPosts, posts, comparator);
        if (newPost.length) {
          watchedState.posts.push(...newPost);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setTimeout(updateUrl, 5000));
  }
  const refresh = () => {
    setTimeout(updateUrl, 5000);
  };

  refresh();

  const loadingFeedsAndPosts = (proxyUrl, sentedUrl) => {
    watchedState.loadProcess.statusProcess = 'start';

    return axios.get(proxyUrl)
      .then((respose) => {
        const content = parserResponse(respose);
        const { feed, posts } = initFeedsAndPosts(content, sentedUrl);
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);
        watchedState.loadProcess.statusProcess = 'success';
        watchedState.validationForm.statusProcess = 'sent';
      })
      .catch((err) => {
        if (err.code === 'ERR_NETWORK') {
          watchedState.loadProcess.errors = 'messages.networkError';
        } else {
          watchedState.loadProcess.errors = `messages.${err.message}`;
        }
        watchedState.loadProcess.errors = 'errorLoad';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sentedUrl = formData.get('url');
    const addedUrls = watchedState.feeds.map(({ url }) => url);
    const proxyUrl = getProxyUrl(sentedUrl);

    schema.validate(sentedUrl, { addedUrls })
      .then(() => {
        loadingFeedsAndPosts(proxyUrl, sentedUrl);
      })
      .catch((err) => {
        watchedState.validationForm.errors = `messages.${err.message}`;
        watchedState.validationForm.statusProcess = 'error';
      });
  });

  document.querySelector('.posts').addEventListener('click', (e) => {
    const el = e.target;
    const { id } = el.dataset;

    if (id) {
      watchedState.ui.activePost = id;
      watchedState.ui.clickedPosts.push(id);
    }
  });
};

export default () => {
  const initialState = {
    validationForm: {
      statusProcess: 'waiting',
      errors: null,
    },
    loadProcess: {
      statusProcess: 'waiting',
      errors: null,
    },
    feeds: [],
    posts: [],
    ui: {
      activePost: null,
      clickedPosts: [],
    },
  };

  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    resources,
  }).then(start(initialState, i18n));
};
