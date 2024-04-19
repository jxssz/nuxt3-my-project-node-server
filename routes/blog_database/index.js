var router = require("../route.config");
const { bdsql } = require("../../mysql/index.js");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");

// 获取所有文章
router.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts";
  bdsql(query)
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

// 获取特定 ID 的文章
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const updateViewQuery = "UPDATE posts SET view = view + 1 WHERE id = ?";
  await bdsql(updateViewQuery, [id]);

  const query = "SELECT * FROM posts WHERE id = ?";
  bdsql(query, [id])
    .then((data) => {
      if (data.result && Array.isArray(data.result) && data.result.length) {
        data.result = data.result[0];
      } else {
        data.result = null;
      }

      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

// 创建新文章
router.post("/save", (req, res) => {
  //   console.log(req.query, req.params, req.body);
  const { title, content, author_id, description } = req.body;
  //   res.send(req);
  //   console.log(title, content, author_id);
  const query =
    "INSERT INTO posts (title, content, author_id, description, view) VALUES (?, ?, ?, ?, 0)";
  bdsql(query, [title, content, author_id, description])
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
  //   bdsql.query(query, [title, content, author_id], (err, results) => {
  //     if (err) {
  //       return res.status(500).json({ error: err.message });
  //     }
  //     res.status(201).json({ id: results.insertId, title, content, author_id });
  //   });
});

// 更新特定 ID 的文章
router.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, author_id } = req.body;
  const query =
    "UPDATE posts SET title = ?, content = ?, author_id = ? WHERE id = ?";
  bdsql.query(query, [title, content, author_id, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "文章未找到" });
    }
    res.json({ id, title, content, author_id });
  });
});

// 删除特定 ID 的文章
router.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM posts WHERE id = ?";
  bdsql.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "文章未找到" });
    }
    res.json({ message: "文章已删除" });
  });
});

// 获取浏览人基本信息
router.get("/log", async (req, res) => {
  console.log(11);
  // 获取请求的 IP 地址
  const ip = req.ip;

  // 获取地理位置信息
  const geo = geoip.lookup(ip);
  const country = geo ? geo.country : null;
  const city = geo ? geo.city : null;

  // 获取设备信息
  const ua = req.get("User-Agent");
  const parser = new UAParser(ua);
  const deviceType = parser.getDevice().type || "Unknown";
  const browser = parser.getBrowser().name || "Unknown";
  const os = parser.getOS().name || "Unknown";
  if (ip == "::1" || ip == "::ffff:127.0.0.1") return;
  const insertQuery = `
        INSERT INTO logs (ip_address, country, city, device_type, browser, os)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  bdsql(insertQuery, [ip, country, city, deviceType, browser, os])
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

module.exports = router;
