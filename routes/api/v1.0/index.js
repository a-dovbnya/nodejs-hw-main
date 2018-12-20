const express = require("express");
const router = express.Router();
const authControllers = require("../../../controllers/auth.js");
const userControllers = require("../../../controllers/user.js");
const newsControllers = require("../../../controllers/news.js");

const passport = require("passport");
const authJwt = passport.authenticate("jwt", { session: false });

// На все get-запросы отдавать index.html
router.get("/", (req, res) => {
  res.render("dist");
});

// Регистрация и авторизация
router.post("/api/saveNewUser", authControllers.saveNewUser);
router.post("/api/login", authControllers.login);
router.post("/api/authFromToken", authControllers.authFromToken);

// Действия с пользователями
router.get("/api/getUsers", authJwt, userControllers.getUsers);
router.put("/api/updateUser/:id", authJwt, userControllers.updateUser);
router.post("/api/saveUserImage/:id", authJwt, userControllers.saveUserImage);
router.put(
  "/api/updateUserPermission/:id",
  authJwt,
  userControllers.updateUserPermission
);
router.delete("/api/deleteUser/:id", authJwt, userControllers.deleteUser);

// Новости
router.get("/api/getNews", authJwt, newsControllers.getNews);
router.post("/api/newNews", authJwt, newsControllers.newNews);
router.put("/api/updateNews/:id", authJwt, newsControllers.updateNews);
router.delete("/api/deleteNews/:id", authJwt, newsControllers.deleteNews);

module.exports = router;
