const mysql = require("mysql2/promise");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../")));

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "index.html"));
});

const PORT = process.env.MYSQLPORT;

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  port: PORT,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function testConnection() {
  try {
    const [rows] = await db.query("SELECT NOW() as time");
    console.log("Database connected! Server time:", rows[0].time);
  } catch (err) {
    console.error("Connection failed:", err);
    testConnection();
  }
}

testConnection();

//Electrical

app.get("/api/data", async (req, res) => {
  const sql = "SELECT * FROM tblm_electrical_inv";

  try {
    const [result] = await db.query(sql);
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/data/id", async (req, res) => {
  const querySql = "SELECT id FROM tblm_electrical_inv";

  try {
    const [result] = await db.query(querySql);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/datakaryawan/:nik", async (req, res) => {
  const querySql = "SELECT * from tblm_data_karyawan WHERE nik = ?";
  const nik = req.params.nik;

  try {
    const [result] = await db.query(querySql, nik);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/data/barang/:id", async (req, res) => {
  const sqlQuery = "SELECT * FROM tblm_electrical_inv WHERE id = ?";
  const id = req.params.id;

  try {
    const [result] = await db.query(sqlQuery, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/tblm_electrical_inv", async (req, res) => {
  const sqlQuery =
    "INSERT INTO tblm_electrical_inv (id, nameItem, rangeItem, brandItem, typeItem, qtyItem) VALUES (?, ?, ?, ?, ?, ?)";

  const { id, nameItem, rangeItem, brandItem, typeItem, qtyItem } = req.body;
  try {
    const [result] = await db.query(sqlQuery, [
      id,
      nameItem,
      rangeItem,
      brandItem,
      typeItem,
      qtyItem,
    ]);
    res.status(200).json({ message: "Data Berhasil di simpan" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/update/outitem/:id", async (req, res) => {
  const sqlQuery = "UPDATE tblm_electrical_inv SET qtyItem = ? WHERE id = ?";
  const id = req.params.id;
  const { qtyItem } = req.body;

  try {
    const [result] = await db.query(sqlQuery, [qtyItem, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Id tidak ditemukan!!!" });

    res.status(200).json({ message: "Data berhasil di Update!!!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/update/:id", async (req, res) => {
  const sqlQuery =
    "UPDATE tblm_electrical_inv SET nameItem = ?, rangeItem = ?, brandItem = ?,  typeItem = ?, qtyItem = ? WHERE id = ?";

  const { name, range, brand, type, qty } = req.body;
  const id = req.params.id;

  try {
    const [result] = await db.query(sqlQuery, [
      name,
      range,
      brand,
      type,
      qty,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item tidak ditemukan!!" });
    }
    res.status(200).json({ message: "Item berhasil di edit" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  const sqlQuery = "DELETE from tblm_electrical_inv WHERE id = ?";

  const idItem = req.params.id;

  try {
    const [result] = await db.query(sqlQuery, [idItem]);
    if (result.affectedRows == 0) {
      return res.status(404).json({ error: "Item tidak ditemukan !!!" });
    }
    res.status(200).json({ message: "Item berhasil dihapus" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//Mechanical
app.get("/api/mechanical/inventory/alldata", async (req, res) => {
  const sqlQuery = "SELECT * from tblm_mechanical_inv";

  try {
    const [result] = await db.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/mechanical/inventory/data/id", async (req, res) => {
  const sqlQuery = "SELECT id from tblm_mechanical_inv";

  try {
    const [result] = await db.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/mechanical/inventory/data/by/:id", async (req, res) => {
  const sqlQuery = "SELECT * FROM tblm_mechanical_inv WHERE id = ?";
  const id = req.params.id;

  try {
    const [result] = await db.query(sqlQuery, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/mechanical/inventory/add-new", async (req, res) => {
  const sqlQuery =
    "INSERT INTO tblm_mechanical_inv (id, nameItem, rangeItem, brandItem, typeItem, qtyItem) VALUES (?, ? ,? ,? ,? ,?)";

  const { id, nameItem, rangeItem, brandItem, typeItem, qtyItem } = req.body;

  try {
    const [result] = await db.query(sqlQuery, [
      id,
      nameItem,
      rangeItem,
      brandItem,
      typeItem,
      qtyItem,
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/mechanical/inventory/update/all-data/:id", async (req, res) => {
  const id = req.params.id;
  const { nameItem, rangeItem, brandItem, typeItem, qtyItem } = req.body;
  const sqlQuery =
    "UPDATE tblm_mechanical_inv set nameItem = ?, rangeItem = ?, brandItem = ?, typeItem = ?, qtyItem = ? WHERE id = ?";

  try {
    const [result] = await db.query(sqlQuery, [
      nameItem,
      rangeItem,
      brandItem,
      typeItem,
      qtyItem,
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Id tidak ditemukan" });

    res.status(200).json({ message: "Item berhasil di edit" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/mechanical/inventory/update/out-item/:id", async (req, res) => {
  const id = req.params.id;
  const { qtyItem } = req.body;
  const sqlQuery = "UPDATE tblm_mechanical_inv SET qtyItem = ? WHERE id = ?";

  try {
    const [result] = await db.query(sqlQuery, [qtyItem, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Id tidak ditemukan" });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/mechanical/inventory/delete/:id", async (req, res) => {
  const idItems = req.params.id;

  const sqlQuery = "DELETE from tblm_mechanical_inv WHERE id = ?";

  try {
    const [result] = await db.query(sqlQuery, idItems);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Id tidak ditemukan" });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Register
app.get("/api/register/get/all-nik", async (req, res) => {
  const sqlQuery = "SELECT nik from tblm_data_karyawan";

  try {
    const [result] = await db.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/register/register-employee", async (req, res) => {
  const { nik, nameEmployee, departement } = req.body;

  const sqlQuery =
    "INSERT INTO tblm_data_karyawan (nik, name, departemen) VALUES (?, ? ,?)";

    try {
      const [result] = await db.query(sqlQuery, [nik, nameEmployee, departement]);
      return res.status(200).json(result);

    } catch (error) {
      res.status(500).json(error);
    }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running ${PORT}`);
  const url = ` http://localhost:${PORT}/dashboard`;
  exec(`start ${url}`);
});
