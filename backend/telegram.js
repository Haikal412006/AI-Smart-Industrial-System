const axios = require('axios');

const BOT_TOKEN = "8887731882:AAFkNyWHLa8Y4BUNVh6uXpIqheYgFCPchzc";
const CHAT_ID = "7012143886";

async function sendAlert(message) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const res = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message
    });

    console.log("Telegram sent:", res.data.ok);

  } catch (err) {
    console.log("Telegram Error:", err.response?.data || err.message);
  }
}

module.exports = sendAlert;