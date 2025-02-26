import onChange from 'on-change';

export default (state, elements, i18n) => {
  const {
    input, feedback, posts, feeds, button,
  } = elements;

  const handleWait = () => {
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    button.disabled = true;
  };

  const handleError = () => {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t(state.errors);
    button.disabled = false;
  };

  const handleValidTrue = () => {
    input.classList.remove('is-invalid');
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = i18n.t('validUrl');
    input.value = '';
    input.focus();
    button.disabled = false;
  };

  const renderFeeds = () => {
    feeds.innerHTML = '';
    const divFeeds = document.createElement('div');
    divFeeds.classList.add('card', 'border-0');
    const divFeedsName = document.createElement('div');
    divFeedsName.classList.add('card-body');
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('feeds');
    divFeedsName.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    state.rssFlow.feeds.forEach((item) => {
      const elLi = document.createElement('li');
      elLi.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = item.titleFeed;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = item.descriptionFeed;
      elLi.append(h3, p);
      ul.append(elLi);
    });
    divFeeds.append(divFeedsName, ul);
    feeds.append(divFeeds);
  };

  const renderPosts = () => {
    posts.innerHTML = '';
    const divPosts = document.createElement('div');
    divPosts.classList.add('card', 'border-0');
    const divPostName = document.createElement('div');
    divPostName.classList.add('card-body');
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18n.t('posts');
    posts.append(divPosts);
    divPosts.append(divPostName);
    divPostName.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    state.rssFlow.posts.forEach((item) => {
      const elLi = document.createElement('li');
      elLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const elA = document.createElement('a');
      elA.setAttribute('href', item.link);
      elA.setAttribute('data-id', item.id);
      elA.setAttribute('target', '_blank');
      elA.setAttribute('rel', 'noopener');
      elA.classList.add('fw-bold');
      elA.textContent = item.title;
      const elBut = document.createElement('button');
      elBut.setAttribute('type', 'button');
      elBut.setAttribute('data-id', item.id);
      elBut.setAttribute('data-bs-toggle', 'modal');
      elBut.setAttribute('data-bs-target', '#modal');
      elBut.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      elBut.textContent = i18n.t('viewing');
      elLi.append(elA, elBut);
      ul.append(elLi);
    });
    divPosts.append(ul);
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
      case 'rssFlowLoad':
        renderFeeds();
        renderPosts();
        console.log(state);
        break;
      case 'waitToLoad':
        handleWait();
        break;
      case 'rssFlow.posts':
        renderPosts();
        break;
      default:
        break;
    }
  });
  return watchedState;
};
