const  { error, success, warning } = require('../common/chalk');

console.log(error('This is an error message !!!\n'), success('hello world!!!\n'), warning('You get a warning message!!!'))