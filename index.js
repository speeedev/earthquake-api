const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const PORT = process.env.PORT || 5000;

const server = express();
//
server.get('/earthquakes', async (req, res) => {
  try {
    const response = await axios.get('https://deprem.afad.gov.tr/last-earthquakes.html');
    const $ = cheerio.load(response.data);
    const data = $('table.content-table > tbody > tr').map((i, el) => {
      const columns = $(el).find('td');
      return {
        date: $(columns[0]).text().split(' ')[0],
        time: $(columns[0]).text().split(' ')[1],
        latitude: $(columns[1]).text(),
        longitude: $(columns[2]).text(),
        depth: $(columns[3]).text(),
        type: $(columns[4]).text(),
        magnitude: $(columns[5]).text(),
        location: $(columns[6]).text(),
        id: $(columns[7]).text(),
      };
    }).get();
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    res.send(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

server.listen(PORT, () => {
  console.log('http://localhost:5000 is listening... :)');
});
