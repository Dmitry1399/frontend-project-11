/* eslint-disable no-param-reassign, no-return-assign, */
const renderPosts = (posts, watchedState, i18n) => {
  const list = document.querySelector('.posts > .card > ul');

  posts.forEach(({ titlePost, linkPost, id }) => {
    const item = document.createElement('li');
    const title = document.createElement('a');
    const button = document.createElement('button');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    if (watchedState.ui.clickedPosts.includes(id)) {
      title.classList.add('fw-normal', 'link-secondary');
    } else {
      title.classList.add('fw-bold');
    }

    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    title.setAttribute('href', `${linkPost}`);
    title.setAttribute('data-id', `${id}`);
    title.setAttribute('target', '_blank');
    title.setAttribute('rel', 'noopener noreferrer');

    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-name', 'view');

    title.textContent = titlePost;
    button.textContent = i18n.t('buttons.view');

    item.append(title, button);
    list.prepend(item);
  });
};

const renderFeeds = (feeds) => {
  const list = document.querySelector('.feeds .card ul');

  feeds.forEach((feed) => {
    const containerContentFeed = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    containerContentFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    title.classList.add('h6', 'm-0');
    description.classList.add('m-0', 'small', 'text-black-50');

    title.textContent = feed.title;
    description.textContent = feed.description;

    containerContentFeed.append(title, description);
    list.prepend(containerContentFeed);
  });
};

const handleModalView = (watchedState, value) => {
  const currentPost = document.querySelector(`[data-id="${value}"]`);
  const { posts } = watchedState;
  const currentPostData = posts.find(({ id }) => id === value);
  const { titlePost, linkPost, descriptionPost } = currentPostData;

  currentPost.classList.remove('fw-bold');
  currentPost.classList.add('fw-normal', 'link-secondary');

  document.querySelector('.modal-title').textContent = titlePost;
  document.querySelector('.modal-body').textContent = descriptionPost;
  document.querySelector('.full-article').setAttribute('href', `${linkPost}`);
};
const addTitles = (titleText) => {
  const container = document.createElement('div');
  const titlesContainer = document.createElement('div');
  const title = document.createElement('h2');
  const list = document.createElement('ul');

  container.classList.add('card', 'border-0');
  titlesContainer.classList.add('card-body');
  title.classList.add('card-title', 'h4');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  title.textContent = titleText;

  titlesContainer.append(title);
  container.append(titlesContainer, list);

  return container;
};

const deletContentRenderTitles = (i18n, path) => {
  document.querySelector(`.${path}`).textContent = '';
  document.querySelector(`.${path}`).append(
    addTitles(i18n.t(`titles.${path}`)),
  );
  document.querySelector(`.${path}`).textContent = '';
  document.querySelector(`.${path}`).append(
    addTitles(i18n.t(`titles.${path}`)),
  );
};

const renderErrorMessage = (watchedState, i18n, path) => {
  const rere = path.replace('.statusProcess', '');
  const errorMessage = watchedState[rere].errors;

  document.querySelector('#url-input').classList.add('is-invalid');
  document.querySelector('.feedback').classList.remove('text-success');
  document.querySelector('.feedback').classList.add('text-danger');
  document.querySelector('.feedback').textContent = i18n.t(errorMessage);
};

const renderSuccessMessage = (i18n) => {
  document.querySelector('#url-input').classList.remove('is-invalid');
  document.querySelector('.rss-form').reset();
  document.querySelector('#url-input').focus();
  document.querySelector('.feedback').classList.remove('text-danger');
  document.querySelector('.feedback').classList.add('text-success');
  document.querySelector('.feedback').textContent = i18n.t('messages.success');
};

const toggleFormOff = () => {
  const button = document.querySelector('#button-add');
  const input = document.querySelector('#url-input');

  button.toggleAttribute('disabled');
  input.toggleAttribute('readonly');
};

const handleViewForm = (watchedState, i18n, path, value) => {
  switch (value) {
    case 'error':
      renderErrorMessage(watchedState, i18n, path);
      break;

    case 'sent':
      renderSuccessMessage(i18n);
      break;

    default:
      break;
  }
};

const handleRenderForm = (watchedState, i18n, path, value) => {
  switch (value) {
    case 'start':
      toggleFormOff();
      break;
    case 'success':
      toggleFormOff();
      break;
    case 'errorLoad':
      renderErrorMessage(watchedState, i18n, path);
      toggleFormOff();
      break;
    default:
      toggleFormOff();
      break;
  }
};

export default (watchedState, i18n) => (path, value) => {
  switch (path) {
    case 'validationForm.statusProcess':
      handleViewForm(watchedState, i18n, path, value);
      break;

    case 'loadProcess.statusProcess':
      handleRenderForm(watchedState, i18n, path, value);
      break;

    case 'ui.activePost':
      handleModalView(watchedState, value);
      break;

    case 'feeds':
      deletContentRenderTitles(i18n, path);
      renderFeeds(watchedState.feeds);
      break;

    case 'posts':
      deletContentRenderTitles(i18n, path);
      renderPosts(watchedState.posts, watchedState, i18n);
      break;

    default:
      break;
  }
};
