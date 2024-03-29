const handleViewForm = (elements, watchedState, path, value) => {
  switch (value) {
    case 'error':
      elements.input.classList.add('is-invalid');
      break;
    case 'succees':
      elements.input.classList.remove('is-invalid');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

export default (elements, watchedState) => (path, value) => {
  switch (path) {
    case 'validationForm.statusProcess':
    // функция меняющая форму в зависимости от того как прошла валидация
      handleViewForm(elements, watchedState, path, value);
      break;
    default:
      break;
  }
};
