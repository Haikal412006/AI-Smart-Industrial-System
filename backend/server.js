const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
require('./mqtt');
const sendAlert = require('./telegram');
const multer = require('multer');
const path = require('path');

const app = express();

let cctvLogs = [];

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('AI Smart Industrial Monitoring Backend Running');
    res.json(cctvLogs);
});

app.post('/api/sensor', async (req, res) => {

    try {

        const { temperature, humidity, gas } = req.body;

        let status = 'NORMAL';

        if (temperature > 70 || gas > 30) {
            status = 'DANGER';
        }

        const result = await pool.query(
            `INSERT INTO sensor_data
            (temperature, humidity, gas, status)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [temperature, humidity, gas, status]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.log(err.message);
    }

});

app.get('/api/sensor', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 20'
        );

        res.json(result.rows);

    } catch (err) {
        console.log(err.message);
    }

});

app.post('/api/cctv', (req, res) => {

  const data = {
    ...req.body,
    time: new Date().toISOString()
  };

  console.log("CCTV DATA:", data);

  if (data.status === "DANGER") {
    sendAlert(`🚨 DANGER ALERT!
Object: ${data.object}
Status: ${data.status}`);
  }

  cctvLogs.unshift(data);

  res.json({ success: true });

});

app.post('/api/chat', (req, res) => {

  const { message, latestData } = req.body;

  let reply = "";

  if (!latestData) {
    return res.json({ reply: "Data belum tersedia" });
  }

  const { temperature, humidity, gas, status } = latestData;

  if (message.toLowerCase().includes("alarm")) {

    reply = status === "DANGER"
      ? "🚨 Alarm aktif! Terdeteksi kondisi berbahaya pada sensor."
      : "✅ Sistem aman, tidak ada alarm aktif.";

  } 
  else if (message.toLowerCase().includes("status")) {

    reply = `Status sistem: ${status}`;

  }
  else if (message.toLowerCase().includes("suhu")) {

    reply = `Suhu saat ini ${temperature}°C`;

  }
  else if (message.toLowerCase().includes("gas")) {

    reply = `Level gas: ${gas}`;

  }
  else {

    reply = "Saya tidak mengerti pertanyaan. Coba tanya status / alarm / suhu / gas.";

  }

  res.json({ reply });

});

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({ storage });

let latestImage = "";

app.post('/api/upload', upload.single('image'), (req, res) => {

  latestImage = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    success: true,
    image: latestImage
  });

});

app.get('/api/camera', (req, res) => {

  res.json({
    image: latestImage
  });

});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});