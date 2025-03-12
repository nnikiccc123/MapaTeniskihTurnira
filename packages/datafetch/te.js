
const puppeteer = require('puppeteer-core');
const fcb = require('find-chrome-bin');

const { writeFileSync  } = require('fs');
const { getDataFolder } = require('./Common.js');


const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const downloadTE = async (yearFrom, yearTo) => {

    const chromeInfo = await fcb.findChrome({});
    const browser = await puppeteer.launch({
        executablePath: chromeInfo?.executablePath,
        defaultViewport: null,
        headless: true,
        args: [`--window-size=1200,700`, `--ignore-certificate-errors`]
    });

    let allPages = await browser.pages().catch(error => console.error(error));
    const page = allPages[0];
    await page.setDefaultNavigationTimeout(0);

    let allTournaments = [];

    const downloadYear = async (year) => {
        const url = `https://te.tournamentsoftware.com/find?DateFilterType=0&StartDate=${year}-01-01&EndDate=${year}-12-31&page=100`;
        await page.goto(url);
        await delay(7000);
        const json = await page.evaluate(() => {
            const tournamentRows = document.querySelectorAll("div[class='media__content']");
            const arr = [];
            for (let row of tournamentRows) {
                let title = row?.querySelector("h4").innerText;
                if (title) {
                    let t = {
                        "name": title
                    };
                    let url = row?.querySelector("h4 a").href;
                    if (url) {
                        t["url"] = url.trim();
                    }
                    let clubAndLocation = row?.querySelector("span[class='nav-link']:has(svg[class='icon-marker nav-link__prefix'])")?.innerText;
                    if (clubAndLocation) {
                        let parts = clubAndLocation.split("|");
                        if (parts) {
                            if (parts.length > 0) {
                                t["club"] = parts[0].trim();
                            }
                            if (parts.length > 1) {
                                t["location"] = parts[1].trim();
                            }
                        }
                    }
                    let datesStr = row?.querySelector("span[class='nav-link']:has(svg[class='icon-calendar nav-link__prefix'])")?.innerText;
                    if (datesStr) {
                        let parts = datesStr.split(' to ');
                        if (parts.length === 2) {
                            t["fromdate"] = parts[0].trim();
                            t["todate"] = parts[1].trim();
                        }
                    }
                    let surface = row?.querySelector("span[class='nav-link']:has(svg[class='icon-court nav-link__prefix'])")?.innerText;
                    if (surface) {
                        t["surface"] = surface.trim();
                    }
                    let category = row?.querySelector("span[class='tag tag--soft']")?.innerText;
                    if (category) {
                        t["category"] = category.trim();
                    }
                    let age = row?.querySelector("span[class='tag']")?.innerText;
                    if (age) {
                        t["age"] = age.trim();
                    }
                    arr.push(t);
                }
            }
            return arr;
        });
        try {
            let fileName = `${getDataFolder()}te/${year}.json`;
            await writeFileSync(fileName, JSON.stringify(json), 'utf8');
                console.log(`File ${fileName} successfully saved to disk`);
        } catch (error) {
            console.log('An error has occurred ', error);
        }
    };

    const url = `https://te.tournamentsoftware.com/`;
    await page.goto(url);
    await delay(4000);
    let acceptButton = await page.$("button[type='submit']");
    if (acceptButton) {
        await acceptButton.click();
    }
    await delay(4000);

    for (let i = yearFrom; i <= yearTo; i++) {
        await downloadYear(i);
    }

    await browser.close();
};

module.exports = { downloadTE };
downloadTE(2015, 2025);



