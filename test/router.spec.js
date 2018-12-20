process.env.BD = "testing";

const User = require("../models/user");
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../app");

chai.use(chaiHttp);

describe("Test App", () => {
  /*beforeEach(function(done) {
    User.deleteMany({}, err => {
      done();
    });
  });*/
  /*describe("Users", () => {
    it("Save New User", done => {
      chai
        .request(server)
        .post("/api/saveNewUser")
        .send({ username: "test", password: "12345" })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.property("access_token");
          res.body.access_token.should.be.a("string");
          res.body.should.property("id");
          res.body.should.property("password");
          res.body.should.property("permission");
          done();
        });
    });
  });*/

  describe("get main page", () => {
    it("test get main page", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
