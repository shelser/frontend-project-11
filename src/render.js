const handleValid = (elements, valid) => {
  switch (valid) {
    case true:
      elements.input.classList.remove('is-invalid');
      break;
    case false:
      elements.input.classList.add('is-invalid');
      break;
    default:
      throw new Error(`Unknown process state: ${valid}`);
  }
};
export default (state, elements) => (path, value) => {
  switch (path) {
    case 'validate':
      handleValid(elements, value);
      break;
    default:
      break;
  }
};
