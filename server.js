const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/extract', async (req, res) => {
    try {
        const { url } = req.body;
        const response = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        const $ = cheerio.load(response.data);
        
        const data = {
            name: $('meta[property="og:title"]').attr('content') || "قناة غير معروفة",
            img: $('meta[property="og:image"]').attr('content') || "",
            desc: $('meta[property="og:description"]').attr('content') || "لا يوجد وصف"
        };
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "فشل سحب البيانات" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`سيرفر الجوكر يعمل على منفذ ${PORT}`));
