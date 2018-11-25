import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

const registerTemplate = require('../templates/register.handlebars');

export default () => {
  // add data
  // compile update
  update(compile(registerTemplate)());

  // add logic
  const buttons = document.querySelectorAll('input[type=radio]');
  const submit = document.querySelector('#register-btn');
  const db = firebase.firestore();
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

  const validateForm = () => {
    const password1 = document.querySelector('#pass').value;
    const password2 = document.querySelector('#confirmpass').value;

    return password1 === password2;
  }
  submit.addEventListener('click', (e) => {
    if (validateForm()) {
      const fname = document.querySelector('#fname').value;
      const lname = document.querySelector('#lname').value;
      const email = document.querySelector('#mail').value;
      const pass = document.querySelector('#pass').value;
      const address = document.querySelector('#address').value;
      const postcode = document.querySelector('#postcode').value;
      const city = document.querySelector('#city').value;
      const phone = document.querySelector('#phone').value;
      const type = document.querySelector('input[type=radio]:checked').value;
      let school = null;
      if (type === 'student') {
        school = document.querySelector('#school').value;
      }
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((user) => {
          user.displayName = `${fname}.${lname}`;
          const id = user.user.uid;
          db.collection('users').doc(id).set({
            address: address,
            postcode: postcode,
            city: city,
            phone: phone,
            type: type,
            school: school
          }).then(() => window.location.replace('/'))
            .catch(error => alert(error.message));
        });
    } else {
      alert('Passwords do not match');
    }
  });

  if (!firebase.auth().currentUser) {
    console.log('no user logged in');
  }
};
