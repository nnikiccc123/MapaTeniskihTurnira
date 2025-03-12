const { readFileSync, writeFileSync, readdirSync  } = require('fs');
const https = require("https");
const {downloadLocations} = require("./collect_locations");
const { getDataFolder } = require('./Common.js');



collectLocationsITF = async (path) => {
    const placesSet = new Set([]);
    const files = readdirSync(path);
    for (let fn of files) {
        if (fn.startsWith("JT_") || fn.startsWith("MT_") || fn.startsWith("WT_")) {
            const data = readFileSync(`${path}/${fn}`, {encoding: 'utf8', flag: 'r'});
            const arr = JSON.parse(data);
            for (let t of arr) {
                if (t?.location) {
                    let place = t?.location.trim();
                    if (t?.hostNation) {
                        place += ", " + t?.hostNation.trim();
                    }
                    placesSet.add(place);
                }
            }
        }
    }
    let placesJSON = [];
    placesSet.forEach(v => placesJSON.push(v));
    downloadLocations(placesJSON, `${path}/locations.json`);
}

module.exports = { collectLocationsITF };
collectLocationsITF(`${getDataFolder()}itf`);

