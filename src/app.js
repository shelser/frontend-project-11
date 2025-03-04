import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import render from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';

const validate = (link, links) => {
  const schema = yup.string()
    .url()
    .notOneOf(links);
  return schema.validate(link);
};

const getXml = (link) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${link}`)
  .then((response) => response.data)
  .catch(() => {
    throw new Error('errors.networkError');
  });

const updateRss = (state) => {
  state.links.forEach((li) => {
    getXml(li)
      .then((response) => {
        const content = parser(response.contents);
        const { posts } = content;
        const loadedTitle = state.rssFlow.posts.map((post) => post.title);
        posts.forEach((p) => {
          if (loadedTitle.includes(p.title)) {
            return;
          }
          const id = _.uniqueId();
          state.rssFlow.posts.push({ id, ...p });
        });
      })
      .catch(() => console.log(i18next.t('errors.updateError')));
  });
};

const startRSSUpdate = (state) => {
  const update = () => {
    updateRss(state);
    setTimeout(update, 5000);
  };

  update();
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input'),
    button: document.querySelector('.btn-lg'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    viewButton: document.querySelector('li > button'),
    modal: document.querySelector('#modal'),
  };

  const defaultLang = 'ru';

  const state = {
    links: [],
    loadProcess: {
      type: 'filling',
    },
    errors: '',
    rssFlow: {
      feeds: [],
      posts: [],
    },
    modalCurrentPost: {
      postID: '',
    },
    ui: {
      seenPost: {
        postsID: [],
      },
    },
  };

  yup.setLocale({
    mixed: {
      required: 'errors.validation.required',
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
    watchedState.loadProcess.type = 'sending';
    const { value } = elements.input;
    validate(value, state.links)
      .then((response) => getXml(response))
      .then((response) => {
        const content = parser(response.contents);
        const { feed, posts } = content;
        state.rssFlow.feeds.push(feed);
        const uploadedPosts = posts.map((post) => {
          const id = _.uniqueId();
          return { id, ...post };
        });
        state.rssFlow.posts.push(...uploadedPosts);
        state.links.push(value);
        watchedState.loadProcess.type = 'finished';
      })
      .catch((error) => {
        state.errors = error.message;
        watchedState.loadProcess.type = 'failed';
      });
    elements.posts.addEventListener('click', (ev) => {
      const currentID = ev.target.dataset.id;
      state.modalCurrentPost.postID = currentID;
      watchedState.ui.seenPost.postsID.push(currentID);
    });
  });
  startRSSUpdate(watchedState);
};
