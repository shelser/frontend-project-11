import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import render from './render.js';
import resources from './locales/index.js';
import parser from './parser.js';

const validate = (link, links) => {
  const schema = yup.string()
    .url()
    .notOneOf(links);
  return schema.validate(link);
};

const getXml = (link) => {
  const request = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
    .then((response) => response)
    .catch(() => {
      throw new Error('errors.networkError');
    });
  return request;
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input'),
    button: document.querySelector('.btn-lg'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const defaultLang = 'ru';

  const state = {
    currentLink: '',
    links: [],
    validate: false,
    errors: '',
    rssFlow: {
      feeds: [],
      posts: [],
    },
    rssFlowLoad: false,
    waitToLoad: false,
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
    state.errors = '';
    state.rssFlowLoad = false;
    watchedState.waitToLoad = true;
    const { value } = elements.input;
    watchedState.currentLink = value;
    validate(value, state.links)
      .then((response) => getXml(response))
      .then((response) => parser(response.data.contents))
      .then((doc) => {
        console.log(doc);
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
          throw new Error('errors.notValidRss');
        }
        const feeds = doc.querySelector('channel');
        const feedId = _.uniqueId();
        const titleFeed = feeds.querySelector('title').textContent;
        const descriptionFeed = feeds.querySelector('description').textContent;
        watchedState.rssFlow.feeds.push({ feedId, titleFeed, descriptionFeed });
        const items = doc.querySelectorAll('item');
        console.log(items);
        items.forEach((item) => {
          const id = _.uniqueId();
          const title = item.querySelector('title').textContent;
          const link = item.querySelector('link').textContent;
          const description = item.querySelector('description').textContent;
          watchedState.rssFlow.posts.push({
            feedId, id, title, link, description,
          });
        });
        watchedState.rssFlowLoad = true;
        watchedState.validate = true;
        state.waitToLoad = false;
        state.links.push(value);
      })
      .catch((error) => {
        console.log('the link is not valid');
        watchedState.errors = error.message;
        state.validate = false;
        state.rssFlowLoad = false;
        state.waitToLoad = false;
        console.log(state);
      });
  });
};

app();
