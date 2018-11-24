import { compile } from 'handlebars';
import update from '../helpers/update';

const registerTemplate = require('../templates/register.handlebars');

export default () => {
  // add data
  // compile update
  update(compile(registerTemplate)());

  // add logic
  const buttons = document.querySelectorAll('input[type=radio]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = document.querySelector('input[type=radio]:checked').value;
      if (type === 'student') {
        document.querySelector('.form__field--studentonly').classList.remove('hidden');
      } else {
        document.querySelector('.form__field--studentonly').classList.add('hidden');
      }
    });
  });
};
