const mysql = require("mysql2/promise");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const path = require('path');
const { exec } = require("child_process");


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../')));

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname,'../','index.html'));
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
  queueLimit: 0
});

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection error: " + err);
//     return;
//   }
//   console.log("Connected to MySQL database.");

//   const sql = "SELECT * FROM tblm_electrical_inv";
//   db.query(sql, (err, result) => {
//     console.log("Hasil database -> ", result);
//   });
// });

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT NOW() as time');
    console.log('Database connected! Server time:', rows[0].time);
  } catch (err) {
    console.error('Connection failed:', err);
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

  // db.query(sql, (err, result) => {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  //   res.json(result);
  // });
});

app.get("/api/data/id", (req, res) => {
  const querySql = "SELECT id FROM tblm_electrical_inv";

  db.query(querySql, (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
});

app.get("/api/datakaryawan/:nik", (req, res) => {
  const querySql = "SELECT * from tblm_data_karyawan WHERE nik = ?";
  const nik = req.params.nik;

  db.query(querySql, nik, (err, result) => {
    if (err) return res.status(500).json({error: err.message});

    res.json(result);
  });
});

app.get("/api/data/barang/:id", (req, res) => {
  const sqlQuery = "SELECT * FROM tblm_electrical_inv WHERE id = ?";
  const id = req.params.id;

  db.query(sqlQuery, id, (err, result) => {
    if(err) return res.status(500).json({error: err.message});

    res.status(200).json(result);
  })
});

app.post("/tblm_electrical_inv", (req, res) => {
  const sqlQuery =
    "INSERT INTO tblm_electrical_inv (id, nameItem, rangeItem, brandItem, typeItem, qtyItem) VALUES (?, ?, ?, ?, ?, ?)";

  const { id, nameItem, rangeItem, brandItem, typeItem, qtyItem } = req.body;

  db.query(
    sqlQuery,
    [id, nameItem, rangeItem, brandItem, typeItem, qtyItem],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Data Berhasil disimpan" });
    }
  );
});

app.put("/api/update/outitem/:id", (req, res) => {
  const sqlQuery = "UPDATE tblm_electrical_inv SET qtyItem = ? WHERE id = ?";
  const id = req.params.id;
  const {qtyItem} = req.body;

  db.query(sqlQuery, [qtyItem, id], (err, result) => {
    if (err) return res.status(500).json({error: err.message});

    if (result.affectedRows === 0) return res.status(404).json({error: "Id tidak ditemukan!!!"});

    res.status(200).json({message: "Data berhasil di Update!!!"});
  });
});

app.put("/api/update/:id", (req, res) => {
  const sqlQuery =
    "UPDATE tblm_electrical_inv SET nameItem = ?, rangeItem = ?, brandItem = ?,  typeItem = ?, qtyItem = ? WHERE id = ?";

  const { name, range, brand, type, qty } = req.body;
  const id = req.params.id;

  //   console.log(name, range, brand, type, qty, id);
  db.query(sqlQuery, [name, range, brand, type, qty, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item tidak ditemukan!!" });
    }
    res.status(201).json({ message: "Item berhasil di edit!!" });
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const sqlQuery = "DELETE from tblm_electrical_inv WHERE id = ?";

  const idItem = req.params.id;

  db.query(sqlQuery, [idItem], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows == 0) {
      return res.status(404).json({ error: "Item tidak ditemukan !!!" });
    }
    res.status(200).json({ message: "Item berhasil dihapus" });
  });
});

//Mechanical
app.get("/api/mechanical/inventory/alldata", (req, res) => {
  const sqlQuery = "SELECT * from tblm_mechanical_inv";

  db.query(sqlQuery, (err, result) => {
      if(err) return res.status(500).json({error: err.message});

      return res.status(200).json(result);
  });
});

app.get("/api/mechanical/inventory/data/id", (req, res) => {
  const sqlQuery = "SELECT id from tblm_mechanical_inv";

  db.query(sqlQuery, (err, result) => {
      if(err) return res.status(500).json({error: err.message});

      return res.status(200).json(result);
  });
});

app.get("/api/mechanical/inventory/data/by/:id", (req, res) => {
  const sqlQuery = "SELECT * FROM tblm_mechanical_inv WHERE id = ?";
  const id = req.params.id;

  db.query(sqlQuery, id, (err, result) => {
    if(err) return res.status(500).json({error: err.message});

    return res.status(200).json(result);
  })
}); 

app.post("/api/mechanical/inventory/add-new", (req, res) => {
  const sqlQuery = "INSERT INTO tblm_mechanical_inv (id, nameItem, rangeItem, brandItem, typeItem, qtyItem) VALUES (?, ? ,? ,? ,? ,?)"

  const {id, nameItem, rangeItem, brandItem, typeItem, qtyItem} = req.body;

  db.query(sqlQuery, [id, nameItem, rangeItem, brandItem, typeItem, qtyItem], (err, result) => {
    if(err) return res.status(500).json({error: err.message});

    return res.status(200).json(result);
  });
});

app.put("/api/mechanical/inventory/update/all-data/:id", (req, res) => {
  const id = req.params.id;
  const {nameItem, rangeItem, brandItem, typeItem, qtyItem} = req.body;
  const sqlQuery = "UPDATE tblm_mechanical_inv set nameItem = ?, rangeItem = ?, brandItem = ?, typeItem = ?, qtyItem = ? WHERE id = ?";

  db.query(sqlQuery, [nameItem, rangeItem, brandItem, typeItem, qtyItem, id], (err, result) => {
    if(err) return res.status(500).json({error: err.message});

    if(result.affectedRows === 0) return res.status(404).json({error: "Id tidak ditemukan"});

    return res.status(200).json({message: "Item berhasil di edit"});
  });
});

app.put("/api/mechanical/inventory/update/out-item/:id", (req, res) => {
  const id = req.params.id;
  const {qtyItem} = req.body;
  const sqlQuery = "UPDATE tblm_mechanical_inv SET qtyItem = ? WHERE id = ?";

  db.query(sqlQuery, [qtyItem, id], (err, result) => {
    if(err) return res.status(500).json({error: err.message});

    if(result.affectedRows === 0) return res.status(404).json({error: "Id tidak ditemukan"});

    return res.status(200).json(result);
  });
});


app.delete("/api/mechanical/inventory/delete/:id", (req, res) => {
  const idItems = req.params.id;
  
  const sqlQuery = "DELETE from tblm_mechanical_inv WHERE id = ?";

  db.query(sqlQuery, idItems, (err, result) => {
    if (err) return res.status(500).json({error: err.message});

    if(result.affectedRows === 0) return res.status(404).json({error: "Id tidak ditemukan"});

    return res.status(200).json(result);
  });
});

//Register
app.get("/api/register/get/all-nik", (req, res) => {
  const sqlQuery = "SELECT nik from tblm_data_karyawan";

  db.query(sqlQuery, (err, result) => {
    if (err) return res.status(500).json({error: err.message});

    return res.status(200).json(result);
  });
});

app.post("/api/register/register-employee", (req, res) => {
  const {nik, nameEmployee, departement} = req.body;

  const sqlQuery = "INSERT INTO tblm_data_karyawan (nik, name, departemen) VALUES (?, ? ,?)";

  db.query(sqlQuery, [nik, nameEmployee, departement], (err, result) => {
    if(err) return res.status(500).json({error:err.message});

    return res.status(200).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running ${PORT}`);
  // const url =` http://localhost:${PORT}/dashboard`;
  // exec(`start ${url}`);

});
