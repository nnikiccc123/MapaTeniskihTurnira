const {downloadITF}= require('./itf')
const {downloadTE}= require('./te')
const {collectLocationsITF}= require('./ITFGetLocations')
const {collectLocationsTE} = require("./TEGetLocations");
const { getDataFolder } = require('./Common.js');


let collectData= async (yearFrom, yearTo) => {
    downloadITF(yearFrom, yearTo);
    downloadTE(yearFrom, yearTo);
    collectLocationsITF(`${getDataFolder()}itf`);
    collectLocationsTE(`${getDataFolder()}te`);

};

const year = 2025;
collectData(year, year);

