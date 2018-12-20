const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const uploadDir = "upload";

module.exports.uploadImage = req =>
  new Promise((resolve, reject) => {
    const id = req.params.id;
    let form = new formidable.IncomingForm();
    let upload = path.join("./dist", uploadDir);

    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function(err, fields, files) {
      const file = files[id];
      if (err) {
        return reject(err);
      }

      if (!file.name || !file.size) {
        fs.unlinkSync(file.path);
        return reject(new Error("Некорректное изображение"));
      }

      const fileName = path.join(upload, file.name);

      fs.rename(file.path, fileName, err => {
        if (err) {
          return reject(err);
        }
        const filePath = path
          .join(uploadDir, file.name)
          .split("\\")
          .join("/");
        return resolve(filePath);
      });
    });
  });
