const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const filePath = 'output.json';

app.use(
  cors({
    origin: '*',
  })
);

const getCurrentTime = (time) => {
  const istDateTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(time);

  return istDateTime;
};

cron.schedule('*/10 * * * *', () => {
  const run = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.goto('https://jobs.e-next.in/course/udemy');
        let urls = await page.evaluate(() => {
          let results = [];

          let items = document.getElementsByClassName('h6');
          let resultArray = [...items];

          resultArray.forEach((item) => {
            results.push({
              text: item.innerText,
            });
          });

          let lresults = [];
          let litems = document.querySelectorAll('.btn-secondary');
          litems.forEach((item) => {
            lresults.push({
              url: item.getAttribute('href'),
            });
          });
          return [results, lresults];
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        console.log(e);
      }
    });
  };

  run()
    .then((data) => {
      const convertDataToString = JSON.stringify(data, null, 2);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Time: ${getCurrentTime(new Date())} - Failed to delete file: `, err);
        } else {
          console.log(`Time: ${getCurrentTime(new Date())} - File deleted successfully!`);
        }
      });

      fs.writeFile(filePath, convertDataToString, 'utf-8', (err) => {
        if (err) {
          console.log(`Time: ${getCurrentTime(new Date())} - Failed to write data in file`);
        } else {
          console.log(`Time: ${getCurrentTime(new Date())} - File create and data added`);
        }
      });
    })
    .catch((error) => {
      console.log(
        `Time: ${getCurrentTime(new Date())} - Failed to get data through chromium browser`,
        error
      );
    });
});

app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(`Time: ${getCurrentTime(new Date())} - `, err);
    } else {
      console.log(`Time: ${getCurrentTime(new Date())} - Received a get API call`);
      res.send(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running sucessfull on port number ${port}`);
});
