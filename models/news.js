const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Object, required: true },
  text: { type: String, required: true },
  theme: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: Object, default: {}, require: true }
});

module.exports = mongoose.model("News", newsSchema);
