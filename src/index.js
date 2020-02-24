import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = () => {
  const point = document.getElementById('point');

  const container = document.createElement('div');
  container.classList.add('container-fluid');
  point.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('justify-content-center');
  container.append(row);

  const col = document.createElement('div');
  col.classList.add('col-sm-8');
  col.classList.add('col-12');
  row.append(col);

  const jumbotron = document.createElement('div');
  jumbotron.classList.add('jumbotron');
  col.append(jumbotron);

  const form = document.createElement('form');
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
  submitButton.textContent = 'Add';
  form.append(submitButton);
};

app();
