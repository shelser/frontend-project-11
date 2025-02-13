import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

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
  };
  const initialState = {
    currentLink: '',
    links: [],
    validate: false,
    errors: {},
  };
  const state = onChange(initialState, render(initialState, elements));
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.input;
    state.currentLink = value;
    state.validate = true;
    validate(value, initialState.links)
      .then((response) => {
        console.log('the link is valid');
        state.links.push(response);
        state.errors = null;
      })
      .catch((error) => {
        console.log('the link is not valid');
        state.errors = error.errors;
        state.validate = false;
      });
    console.log(initialState);
  });
};

app();
