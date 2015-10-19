var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Student = new Schema({
  name: String,
  phoneNumber: String
});

module.exports = mongoose.model('Student', Student);
