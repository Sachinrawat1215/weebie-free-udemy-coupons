const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

app.use(cors({
    origin: "*"
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
                await page.goto('https://e-next.in/e/udemycoupons.php');
                let urls = await page.evaluate(() => {
                    let results = [];

                    // // Wrong Code

                    // let items = document.querySelectorAll('.p2');
                    // // let items = document.getElementsByClassName("col-8");
                    // items.forEach((item) => {
                    //     results.push({
                    //         text: item.innerText
                    //     })
                    // });
                    // console.log(results);


                    // Correct Code

                    let items = document.getElementsByClassName("col-8");
                    let resultArray = [...items];

                    // let items = document.getElementsByClassName("col-8");
                    resultArray.forEach((item) => {
                        results.push({
                            text: item.innerText
                        })
                    })


                    let lresults = [];
                    let litems = document.querySelectorAll('.btn-primary');
                    litems.forEach((item) => {
                        lresults.push({
                            url: item.getAttribute("href")
                        })    
                    });
                    console.log(lresults.length)
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