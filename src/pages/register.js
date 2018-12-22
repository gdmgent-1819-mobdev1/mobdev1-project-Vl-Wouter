import { compile } from 'handlebars';
import update from '../helpers/update';
import { Student, Owner } from '../helpers/classes';
import dataHelper from '../helpers/data-functions';

const { getInstance, getDb } = require('../firebase/firebase');

const firebase = getInstance();
const db = getDb();

const registerTemplate = require('../templates/register.handlebars');

// Functions
const validateForm = () => {
  const password1 = document.querySelector('#pass').value;
  const password2 = document.querySelector('#confirmpass').value;

  return password1 === password2;
};

const getValue = (id) => {
  return document.querySelector(`#${id}`).value;
};

const fireRegister = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch(error => reject(error));
  });
};

const registerUser = () => {
  if (validateForm) {
    const firstName = getValue('fname');
    const lastName = getValue('lname');
    const email = getValue('mail');
    const password = getValue('pass');
    const address = getValue('address');
    const postcode = getValue('postcode');
    const city = getValue('city');
    const phone = getValue('phone');
    const type = document.querySelector('input[name=type]:checked').value;
    const school = getValue('school');
    let profile = null;
    fireRegister(email, password)
      .then((user) => {
        // console.log(user);
        const id = user.user.uid;
        if (type === 'student') {
          profile = new Student(id, email, firstName, lastName, address, postcode, city, phone, type, school);
        } else {
          profile = new Owner(id, email, firstName, lastName, address, postcode, city, phone, type);
        }
        db.ref(`users/${id}`).set(profile)
          .then(window.location.replace('/'))
          .catch(error => console.log(error.message));
      })
      .catch(error => console.log(error.message));
  }
};

export default () => {
  // add data
  // compile update
  dataHelper.getSchools()
    .then((schools) => {
      update(compile(registerTemplate)({ schools }));

      // add logic
      const buttons = document.querySelectorAll('input[type=radio]');
      const submit = document.querySelector('#register-btn');
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
      // rewrite logic for submit
      submit.addEventListener('click', (e) => {
        e.preventDefault();
        registerUser();
      });
    });
};
