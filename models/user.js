const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bCrypt = require("bcryptjs");

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: [true, "Укажите login"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Укажите пароль"]
  },
  firstName: {
    type: String,
    default: ""
  },
  surName: {
    type: String,
    default: ""
  },
  access_token: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: String,
    default: ""
  },
  createdAt: {
    type: String,
    default: ""
  },
  permissionId: {
    type: String,
    unique: true
  },
  middleName: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  permission: {
    chat: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: true, required: true },
      U: { type: Boolean, default: true, required: true }
    },
    news: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: true, required: true },
      U: { type: Boolean, default: false, required: true }
    },
    setting: {
      C: { type: Boolean, default: false, required: true },
      D: { type: Boolean, default: false, required: true },
      R: { type: Boolean, default: false, required: true },
      U: { type: Boolean, default: false, required: true }
    }
  }
});

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
