var express = require("express");
// var indexRouter = require('../routes/index');
var users = require("../routes/users");
var datas = require("../routes/datas");
var movies = require("../routes/movies");
var zimuzu = require("../routes/zimuzu");
var upload = require("../routes/upload");
var juliSearch = require("../routes/juliSearch"); // https://jucili.com/ 聚磁力API

/**
 * 博客
 */
var { blogRouter, uploadDir } = require("../routes/blog_database");

const BASE = "/api";
// const BASE = ''

function Route(app) {
  // 增加限制
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use("/uploads", express.static(uploadDir));
  // console.log(__dirname + '/uploads')
  // app.use(BASE + '/', indexRouter);
  app.use(BASE, users);
  app.use(BASE, datas);
  app.use(BASE, movies);
  app.use(BASE, zimuzu);
  app.use(BASE, juliSearch);
  app.use(BASE, upload);

  /**
   * 博客
   */
  app.use(BASE, blogRouter);
}

module.exports = Route;
