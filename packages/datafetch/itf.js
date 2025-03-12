
const puppeteer = require('puppeteer-core');
const fcb = require('find-chrome-bin');

const { writeFileSync  } = require('fs');
const { getDataFolder } = require('./Common.js');


let downloadITF = async(yearFrom, yearTo) => {

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


    const daysInMonth = (m, y) => {
        const arr = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let days = arr[m - 1];
        if (days === 0) {
            days = y % 4 === 0 ? (y % 100 === 0 ? 28 : 29) : 28;
        }
        return days;
    };
    let allTournaments = [];

    const downloadMonth = async (month, year, tourCode = "JT") => {
        const fm = month < 10 ? `0${month}` : String(month);
        const url = `https://www.itftennis.com/tennis/api/TournamentApi/GetCalendar?circuitCode=
                     ${tourCode}&searchString=&skip=0&take=100&nationCodes=&zoneCodes=&dateFrom=
                     ${year}-${fm}-01&dateTo=${year}-${fm}-${daysInMonth(month, year)}
                     &indoorOutdoor=&categories=&isOrderAscending=true&orderField=startDate&surfaceCodes=`;
        await page.goto(url);
        const json = await page.evaluate(() =>  {
            return JSON.parse(document.querySelector("body").innerText);
        });
        allTournaments = allTournaments.concat(json.items);
    };

    const tours = ["JT", "MT", "WT"];

    for (let year = yearFrom; year <= yearTo; year++) {
        for (let tour of tours) {
            allTournaments = [];
            for (let i = 1; i <= 12; i++) {
                console.log(`Downloading ${tour}, ${i}. ${year}...`)
                await downloadMonth(i, year, tour);
            }

            try {
                await writeFileSync(`${getDataFolder()}itf/${tour}_${year}.json`,
                    JSON.stringify(allTournaments), 'utf8');
                console.log('Data successfully saved to disk');
            } catch (error) {
                console.log('An error has occurred ', error);
            }
        }
    }

    await browser.close();

};

module.exports = { downloadITF };
downloadITF(2025, 2025);


