import { watch } from 'melanke-watchjs';

const point = document.getElementById('point');

const container = document.createElement('div');
container.classList.add('container-fluid');
point.append(container);

const row = document.createElement('div');
row.classList.add('row');
row.classList.add('justify-content-center');
container.append(row);

const col = document.createElement('div');
col.classList.add('col-sm-6');
col.classList.add('col-12');
row.append(col);

const jumbotron = document.createElement('div');
jumbotron.classList.add('jumbotron');
col.append(jumbotron);

const form = document.createElement('form');
form.setAttribute('id', 'form');
jumbotron.append(form);

const inputDiv = document.createElement('div');
inputDiv.classList.add('form-group');
form.append(inputDiv);
const label = document.createElement('label');
label.textContent = 'Add URL to RSS feed';
inputDiv.append(label);

const input = document.createElement('input');
input.classList.add('form-control');
inputDiv.append(input);

const submitButton = document.createElement('button');
submitButton.classList.add('btn-primary');
submitButton.classList.add('btn');
submitButton.setAttribute('type', 'submit');
submitButton.setAttribute('disabled', '');
submitButton.textContent = 'Add';
form.append(submitButton);

const createFeedElement = (title, description) => {
  const newFeedElement = document.createElement('div');
  newFeedElement.classList.add('border');
  newFeedElement.classList.add('rounded');
  col.append(newFeedElement);
  const feedName = document.createElement('h3');
  feedName.textContent = `${title} — ${description}`;
  newFeedElement.append(feedName);
};

export default (state) => {
  watch(state.form, 'sbmtButton', () => {
    if (state.form.sbmtButton === 'active') {
      submitButton.removeAttribute('disabled');
      input.classList.remove('is-invalid');
    }
    if (state.form.sbmtButton === 'blocked') {
      submitButton.setAttribute('disabled', '');
      input.classList.add('is-invalid');
    }
    if (state.form.sbmtButton === 'waiting-blocked') {
      input.classList.remove('is-invalid');
      submitButton.setAttribute('disabled', '');
    }
  });

  watch(state.lastFeed, 'title', () => {
    form.reset();
    createFeedElement(state.lastFeed.title, state.lastFeed.description);
  });
};
