const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid-v4");
const jwts = require("jwt-simple");
const passport = require("passport");
const User = require("../models/user");
const secret = require("../config/config.json").secret;

module.exports = {
  saveNewUser: (req, res) => {
    /* Cоздание нового пользователя (регистрация).
     * Возвращает объект созданного пользователя.
     */

    const data = req.body;

    if (!data.username || !data.password) {
      return res
        .status(401)
        .json({ error: "Для регистрации должны быть указаны логин и пароль" });
    }
    User.findOne({ username: data.username }).then(async user => {
      if (user) {
        return res
          .status(409)
          .json({ error: "Такой пользователь уже существует" });
      }
      /* Если данные введены корректно,
       * то создаём пользователя
       */
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.password, salt);
      const date = new Date();
      const id = uuidv4();
      const newUser = new User({
        id: id,
        username: data.username,
        password: hash,
        firstName: data.firstName,
        surName: data.surName,
        middleName: data.middleName,
        permission: data.permission,
        permissionId: id,
        createdAt: date,
        updatedAt: date,
        access_token: jwts.encode({ id: id }, secret)
      });

      newUser
        .save()
        .then(user => {
          return res.status(201).json(user);
        })
        .catch(err => {
          return res
            .status(400)
            .json({ error: `Произошла ошибка: ${err.message}` });
        });
    });
  },
  login: (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          error: `Неправильный логин или пароль`
        });
      }
      if (user) {
        if (req.body.remembered) {
          res.cookie("access_token", user.access_token, {
            httpOnly: false,
            expires: new Date(Date.now() + 60 * 24 * 1000),
            path: "/"
          });
        }
        /* В любом случае ставим пользователю куку
         * с токеном для jwt авторизации
         */
        res.cookie("jwt", user.access_token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 24 * 1000),
          path: "/"
        });
        return res.status(200).json(user);
      }
    })(req, res, next);
  },
  authFromToken: (req, res, next) => {
    passport.authenticate("jwt", { session: false }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({
          error: `Пользователь с таким токеном не найден`
        });
      }
      if (user) {
        res.status(200).json(user);
      }
    })(req, res, next);
  }
};
