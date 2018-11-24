import { compile } from 'handlebars';
import update from '../helpers/update';
 

const loginTemplate = require('../templates/login.handlebars');

export default () => {
  update(compile(loginTemplate)());
}