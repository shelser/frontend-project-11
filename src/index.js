import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import render from './render.js';
import resources from './locales/index.js';

const validate = (link, links) => {
  const schema = yup.string()
    .url()
    .notOneOf(links);
  return schema.validate(link);
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    feedback: document.querySelector('.feedback'),
  };

  const defaultLang = 'ru';

  const state = {
    currentLink: '',
    links: [],
    validate: false,
    errors: '',
  };

  yup.setLocale({
    mixed: {
      notOneOf: 'errors.validation.notMatchLink',
    },
    string: {
      url: 'errors.validation.notValidUrl',
    },
  });

  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLang,
    debug: false,
    resources,
  });

  const watchedState = render(state, elements, i18n);
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    watchedState.currentLink = value;
    validate(value, state.links)
      .then((response) => {
        console.log('the link is valid');
        watchedState.links.push(response);
        watchedState.validate = true;
        state.errors = '';
        console.log(state);
      })
      .catch((error) => {
        console.log('the link is not valid');
        watchedState.errors = error.message;
        state.validate = false;
        console.log(state);
      });
  });
};

app();
