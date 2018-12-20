const bcrypt = require("bcryptjs");
const User = require("../models/user");
const News = require("../models/news");
const { uploadImage } = require("../libs/uploadImage");

module.exports = {
  getUsers: (req, res, next) => {
    /* Получение списка пользователей.
     * Возвращает список всех пользоватлей из базы данных.
     */
    User.find({})
      .then(users => {
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при выборке новостей: ${err.message}`
        });
      });
  },
  updateUser: (req, res, next) => {
    /* Обновление информации о пользователе.
     * Возвращает объект обновленного пользователя.
     */
    const data = req.body;

    getUpdateUserData(data)
      .then(checkedData => {
        User.findOneAndUpdate({ id: data.id }, checkedData).then(() => {
          User.findOne({ id: data.id }).then(user => {
            res.status(200).json(user);
          });
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });
  },
  saveUserImage: (req, res, next) => {
    /* Cохранение изображения пользователя.
     * Необходимо вернуть объект со свойством path,
     * которое хранит путь до сохраненного изображения
     */
    uploadImage(req)
      .then(path => {
        console.log("img path = ", path);
        User.findOneAndUpdate({ id: req.params.id }, { image: path }).then(
          () => {
            res.status(200).json({ path: path });
          }
        );
      })
      .catch(err => {
        console.log(`ошибка при загрузке изображения ${err.message}`);
      });
  },
  updateUserPermission: (req, res, next) => {
    /* Обновление существующей записи
     * о разрешениях конкретного пользователя.
     */
    const data = req.body;
    const id = req.params.id;
    User.findOne({ permissionId: id })
      .then(user => {
        const newPermission = {
          chat: { ...user.permission.chat, ...data.permission.chat },
          news: { ...user.permission.news, ...data.permission.news },
          setting: { ...user.permission.setting, ...data.permission.setting }
        };

        User.findOneAndUpdate(
          { permissionId: id },
          { permission: newPermission }
        ).then(() => {
          User.findOne({ permissionId: id }).then(user => {
            res.status(200).json(user.permission);
          });
        });
      })
      .catch(err => {
        return res
          .status(400)
          .json({ error: `Произошла ошибка: ${err.message}` });
      });
  },
  deleteUser: (req, res, next) => {
    //удаление пользователя
    User.findOneAndRemove({ id: req.params.id })
      .then(() => {
        /* Удаляем новости, связанные с этим пользователем,
         * иначе на фронте будет ошибка при выборке новостей,
         * если пользователь null
         */
        deleteNews(req.params.id).then(() => {
          User.find({}).then(users => {
            return res.status(200).json(users);
          });
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при удалении пользователя ${err.message}`
        });
      });
  }
};

const userUpdateData = data => {
  /* Создает новый объект
   * с данными для обновления информации о пользователе
   */
  let obj = {};
  for (let key in data) {
    if (key !== "id" && key !== "oldPassword" && key !== "password") {
      obj[key] = data[key];
    }
  }
  return obj;
};

const getUpdateUserData = async data => {
  const newData = userUpdateData(data);

  if (data.password && data.oldPassword) {
    /* Если был передан пароль, проверяем,
     * корректен ли старый пароль для текущего пользователя
     */
    const currentUser = await User.findOne({ id: data.id });

    if (!currentUser.validPassword(data.oldPassword)) {
      throw new Error(`Неправильный пароль!`);
    }
    const salt = await bcrypt.genSalt(10);
    newData.password = await bcrypt.hash(data.password, salt);
  }
  return newData;
};

const deleteNews = async userId => {
  /* Удаляет все новости, созданные пользователем
   * с id = userId
   */
  const news = await News.find({ userId: userId });
  const deleteNewsArr = news.map(el => {
    return News.findOneAndRemove({ id: el.id });
  });
  return await Promise.all(deleteNewsArr);
};
