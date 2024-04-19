// 连接数据库
const mysql = require("mysql");

/**
 * 数据库 xiaoshuo
 */
// var xiaoshuoDb;
// function connectionXiaoshuo() {
//   const config = {
//     database: "xiaoshuo",
//     host: "124.223.88.224",
//     user: "root",
//     password: "jinxiao116"
//   };

//   xiaoshuoDb = mysql.createConnection(config);

//   //连接错误，2秒重试
//   xiaoshuoDb.connect(function (err) {
//     if (err) {
//       console.log('间隔时间2秒，正在尝试重连...', err);
//       setTimeout(connectionXiaoshuo , 2000);
//     }
//   });

//   xiaoshuoDb.on('error', function (err) {
//       console.log('正在尝试判断数据库连接...', err);
//       // 如果是连接断开，自动重新连接
//       if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//         connectionXiaoshuo();
//       } else {
//         console.log('数据库连接错误。')
//         throw err;
//       }
//   });
// }

// connectionXiaoshuo();

// sql语句
// function xiaoshuoSql(sql, param) {
//   return new Promise((resolve, reject) => {
//     xiaoshuoDb.query(sql, param, (err, res) => {
//       if (err) {
//         resolve({status: 210, message: err.message})
//       } else {
//         resolve(res)
//       }
//     })
//   });
// }

/**
 * 数据库 zimuzu
 */
//  var zimuzuDb;
//  function connectionZimuzu() {
//    const config = {
//      database: "zimuzu",
//      host: "124.223.88.224",
//      user: "root",
//      password: "jinxiao116"
//    };

//    zimuzuDb = mysql.createConnection(config);

//    //连接错误，2秒重试
//    zimuzuDb.connect(function (err) {
//      if (err) {
//        console.log('间隔时间2秒，正在尝试重连...', err);
//        setTimeout(connectionZimuzu , 2000);
//      }
//    });

//    zimuzuDb.on('error', function (err) {
//        console.log('正在尝试判断数据库连接...', err);
//        // 如果是连接断开，自动重新连接
//        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//         connectionZimuzu();
//        } else {
//          console.log('数据库连接错误。')
//          throw err;
//        }
//    });
//  }

//  connectionZimuzu();

// sql语句
//  function zimuzuSql(sql, param) {
//    return new Promise((resolve, reject) => {
//     zimuzuDb.query(sql, param, (err, res) => {
//        if (err) {
//          resolve({status: 210, message: err.message})
//        } else {
//          resolve(res)
//        }
//      })
//    });
//  }

/**
 * blog_database
 */

var blog_database = null;

function blogDatabase() {
  const config = {
    database: "blog_database",
    host: "124.223.88.224",
    user: "jinxiao",
    password: "jinxiao116",
    debug: false,
    useConnectionPooling: true,
    multipleStatements: true,
  };

  blog_database = mysql.createConnection(config);

  //连接错误，2秒重试
  blog_database.connect(function (err) {
    console.log("-------", err);
    if (err) {
      console.log("间隔时间2秒，正在尝试重连...", err);
      setTimeout(blogDatabase, 2000);
    }
  });

  blog_database.on("error", function (err) {
    console.log("正在尝试判断数据库连接...", err);
    // 如果是连接断开，自动重新连接
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      blogDatabase();
    } else {
      console.log("数据库连接错误。");
      throw err;
    }
  });
}
blogDatabase();
// console.log(111, blog_database)

/**
 * 状态码
 */
const code = {
  success: 200,
  error: 500,
};

/**
 * blog_database sql query function
 */
function bdsql(sql, param) {
  // console.log(12345, blog_database);
  return new Promise((resolve, reject) => {
    blog_database.ping(function (err) {
      if (err) {
        console.log(err, 'ping 不通！')
        blogDatabase();
      }

      blog_database.query(sql, param, (err, res) => {
        if (err) {
          reject({ status: code.error, message: err.message, result: null });
        } else {
          resolve({ status: code.success, message: "成功", result: res });
        }
      });
    });
  });
}

module.exports = {
  // xiaoshuoSql,
  // zimuzuSql
  bdsql, // 博客sql 公共查询方法
};
