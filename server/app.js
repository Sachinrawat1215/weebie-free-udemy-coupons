const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

app.use(cors({
    origin: "https://weebie.netlify.app/"
}));
app.get("/", (req, res) => {
    const run = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const browser = await puppeteer.launch(
                    {
                        headless: true,
                        args: ["--no-sandbox"]
                    }
                );
                const page = await browser.newPage();
                await page.goto('https://jobs.e-next.in/course/udemy');
                let urls = await page.evaluate(() => {
                    let results = [];

                    let items = document.getElementsByClassName("h6");
                    let resultArray = [...items];

                    resultArray.forEach((item) => {
                        results.push({
                            text: item.innerText
                        })
                    })


                    let lresults = [];
                    let litems = document.querySelectorAll('.btn-secondary');
                    litems.forEach((item) => {
                        lresults.push({
                            url: item.getAttribute("href")
                        })
                    });
                    return [results, lresults];
                })
                browser.close();
                return resolve(urls);
            } catch (e) {
                console.log(e);
            }
        });
    };

    run().then((data) => {
        res.send(data)
    }).catch(() => {
        res.send("Error to fetch data...")
    });
});

app.listen(port, () => {
    console.log(`Server is running sucessfull on port number ${port}`);
});