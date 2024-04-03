/* eslint-disable no-param-reassign, */
const renderPosts = (posts, i18n) => {
  const list = document.querySelector('.posts .card ul');

  posts.forEach(({ titlePost, linkPost, id }) => {
    const item = document.createElement('li');
    const titleElement = document.createElement('a');
    const button = document.createElement('button');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    titleElement.setAttribute('href', `${linkPost}`);
    titleElement.setAttribute('data-id', `${id}`);
    titleElement.setAttribute('target', '_blank');
    titleElement.setAttribute('rel', 'noopener noreferrer');

    button.setAttribute('type', 'button');
    button.setAttribute('data-id', `${id}`);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-name', 'view');

    titleElement.textContent = titlePost;
    button.textContent = i18n.t('buttons.view');

    item.append(titleElement, button);
    list.prepend(item);
  });
};

const renderFeeds = (feeds) => {
  const list = document.querySelector('.feeds .card ul');

  feeds.forEach((feed) => {
    const conteinerContentFeed = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    conteinerContentFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    title.classList.add('h6', 'm-0');
    description.classList.add('m-0', 'small', 'text-black-50');

    title.textContent = feed.title;
    description.textContent = feed.description;

    conteinerContentFeed.append(title, description);
    list.prepend(conteinerContentFeed);
  });
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

const deletContentRenderTitles = (elements, i18n, path) => {
  elements.content[path].textContent = '';
  elements.content[path].append(
    addTitles(i18n.t(`titles.${path}`)),
  );
};

const handleViewForm = (elements, watchedState, i18n, path, value) => {
  switch (value) {
    case 'error':
      elements.input.classList.add('is-invalid');
      // рендерить ошибку
      break;
    case 'succees':
      elements.input.classList.remove('is-invalid');
      elements.form.reset();
      elements.input.focus();
      // ренжерим "успех"
      break;
    default:
      break;
  }
};

export default (elements, watchedState, i18n) => (path, value) => {
  switch (path) {
    case 'validationForm.statusProcess':
    // функция меняющая форму в зависимости от того как прошла валидация
      handleViewForm(elements, watchedState, i18n, path, value);
      break;
    case 'feeds':
      deletContentRenderTitles(elements, i18n, path);
      renderFeeds(watchedState.feeds);
      break;
    case 'posts':
      deletContentRenderTitles(elements, i18n, path);
      renderPosts(watchedState.posts, i18n, watchedState);
      break;
    default:
      break;
  }
};
