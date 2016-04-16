var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB);
var Schema = mongoose.Schema;

module.exports = mongoose.model('Posts', new Schema({
    title: String,
    text: String,
    key_words: Array,
    is_published: Boolean
}));
