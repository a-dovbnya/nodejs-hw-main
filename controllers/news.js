const uuidv4 = require("uuid-v4");
const News = require("../models/news");
const User = require("../models/user");

module.exports = {
  getNews: (req, res, next) => {
    /* Получение списка новостей.
     * Необходимо вернуть список всех новостей из базы данных.
     */
    getAllNews()
      .then(allNews => {
        return res.status(200).json(allNews);
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при выборке новостей: ${err.message}`
        });
      });
  },
  newNews: (req, res, next) => {
    /* Cоздание новой новости.
     * Необходимо вернуть обновленный список всех новостей из базы данных.
     */
    const data = req.body;
    const newNews = new News({
      id: uuidv4(),
      date: data.date,
      text: data.text,
      theme: data.theme,
      userId: data.userId
    });
    newNews
      .save()
      .then(news => {
        getAllNews().then(allNews => {
          return res.status(200).json(allNews);
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при добавлении новости ${err.message}`
        });
      });
  },
  updateNews: (req, res, next) => {
    /* Обновление существующей новости.
     * Необходимо вернуть обновленный список всех новостей из базы данных.
     */
    const id = req.params.id;
    const data = req.body;

    News.findOneAndUpdate(
      { id: id },
      {
        text: data.text,
        theme: data.theme,
        date: data.date,
        userId: data.userId
      }
    )
      .then(() => {
        getAllNews().then(allNews => {
          return res.status(200).json(allNews);
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при обновлении новости ${err.message}`
        });
      });
  },
  deleteNews: (req, res, next) => {
    //удаление Новости
    const id = req.params.id;
    News.findOneAndRemove({ id: id })
      .then(() => {
        getAllNews().then(allNews => {
          return res.status(200).json(allNews);
        });
      })
      .catch(err => {
        return res.status(400).json({
          error: `Произошла ошибка при удалении новости ${err.message}`
        });
      });
  }
};

// helpers
const composeNews = async news => {
  const newsPromises = news.map(el => {
    return User.findOne({ id: el.userId }).then(user => {
      return {
        _id: el._id,
        id: el.id,
        data: el.date,
        text: el.text,
        theme: el.theme,
        userId: el.userId,
        user: user
      };
    });
  });

  return await Promise.all(newsPromises);
};

const getAllNews = async () => {
  return await News.find({}).then(async news => {
    return await composeNews(news);
  });
};
