const { readFileSync, writeFileSync, readdirSync  } = require('fs');
const https = require("https");
const {downloadLocations} = require("./collect_locations");
const { getDataFolder } = require('./Common.js');




collectLocationsTE = async (path) => {
    const placesSet = new Set([]);
    const files = readdirSync(path);
    for (let fn of files) {
        const data = readFileSync(`${path}/${fn}`, { encoding: 'utf8', flag: 'r' });
        const arr = JSON.parse(data);
        for (let t of arr) {
            if (t?.location) {
                let place = t?.location.trim();
                placesSet.add(place);
            }
        }
    }

    let placesJSON = [];
    placesSet.forEach(v => placesJSON.push(v));
    downloadLocations(placesJSON, `${path}/locations.json`);
};

module.exports = { collectLocationsTE };
collectLocationsTE(`${getDataFolder()}te`);

