import onChange from 'on-change';

export default (state, elements, i18n) => {
  const { input, feedback } = elements;

  const handleError = () => {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t(state.errors);
  };

  const handleValidTrue = () => {
    input.classList.remove('is-invalid');
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = i18n.t('validUrl');
    input.value = '';
    input.focus();
  };

  const watchedState = onChange(state, (path) => {
    console.log(path);
    switch (path) {
      case 'validate':
        handleValidTrue();
        break;
      case 'errors':
        handleError();
        break;
      default:
        break;
    }
  });
  return watchedState;
};
