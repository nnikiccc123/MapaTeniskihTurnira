let https = require('https');
let fs = require('fs');


let allPlacesWithLocations = [];

const downloadLocations = (places, locationsFilePath) => {

    const placeSet = new Set();

    if (fs.existsSync(locationsFilePath)) {
        const data = fs.readFileSync(locationsFilePath);
        allPlacesWithLocations = JSON.parse(data);
        for (let p of allPlacesWithLocations) {
            if (p?.place) {
                placeSet.add(p?.place);
            }
        }
        console.log(`Already has ${placeSet.size} places.`);
    }

    const downloadSingleLocation = () => {
        if (places.length > 0) {
            let place = places.pop();
            // only if not already located
            if (!placeSet.has(place)) {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(place)}.json?limit=1&access_token=pk.eyJ1Ijoidm5pa2ljIiwiYSI6ImNqaWxwazV4czA3cXgzcWs3OTdsNmd4cmgifQ.M2a6z4CUSfG1sM0qX2QdeA`
                https.get(url, resp => {
                    let data = "";
                    resp.on("data", chunk => data += chunk);
                    resp.on("end", () => {
                        let json = JSON.parse(data);
                        let foundLocation = false;
                        if (json?.features && json.features.length > 0) {
                            let center = json.features[0]?.center;
                            if (center && center.length === 2) {
                                allPlacesWithLocations.push({
                                    "place": place,
                                    "lon": center[0],
                                    "lat": center[1],
                                });
                                foundLocation = true;
                                console.log(`OK: ${place} [${center[1]}, ${center[0]}], len = ${allPlacesWithLocations.length}`);
                            }
                        }
                        if (!foundLocation) {
                            console.error(`NOT FOUND: ${place}`);
                        }
                        downloadSingleLocation();
                    });
                }).on("error", err => {
                    console.log("Error: " + err.message);
                });
            } else {
                downloadSingleLocation();
            }
        } else {
            fs.writeFileSync(locationsFilePath, JSON.stringify(allPlacesWithLocations));
        }
    }

    downloadSingleLocation();
}


module.exports = { downloadLocations };