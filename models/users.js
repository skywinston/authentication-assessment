var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  email: String,
  passwordDigest: String
});

module.exports = mongoose.model('User', User);
