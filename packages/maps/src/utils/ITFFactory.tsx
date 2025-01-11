import {Locations, TennisFactory} from "./TennisFactory";
import {Surfaces, TennisTournament} from "./TournamentUtils";
import {getBaseDataUrl} from "./CommonUtil";

export class ITFFactory extends TennisFactory {

    protected loadLocationPatches(): Promise<Locations> {
        return this.loadLocationsFromUrl(`${ getBaseDataUrl()}itf/location_patches.json`);
    }

    protected loadLocations(): Promise<Locations> {
        return this.loadLocationsFromUrl(`${ getBaseDataUrl()}itf/locations.json`);
    }

    public fetchCalendarData = (tourCode: string, year: number): Promise<object[]> => {
        return fetch(`${ getBaseDataUrl()}itf/${tourCode}_${year}.json`).then(
            response => response.json(), reason => console.error(reason)
        ).then(json => json);
    }


    public createTournament = (json: object): TennisTournament => {
        let place = json["location"]?.trim();
        if (json["hostNation"]) {
            place += ", " + json["hostNation"].trim();
        }
        const coords = this.locations[place];
        const surfaceCode = json["surfaceCode"];
        const priceMoney = json["prizeMoney"];
        let categoryId: string = json["category"]?.replace("Grade ", "G");
        if (!categoryId || categoryId.toLowerCase().startsWith("futures")) {
            categoryId = priceMoney;
        }
        let importance = 1;
        if (categoryId.startsWith("M") || categoryId.startsWith("W")) {
            let catNum = Number(categoryId.substring(1));
            if (isNaN(catNum)) {
                catNum = 10;
            }
            importance = Math.min(10, catNum / 10);
        } else if (categoryId === priceMoney) {
            let price = Number(priceMoney.replace("$", "").replaceAll(",", ""));
            importance = isNaN(price) ? 10 : Math.min(10, price / 10000);
        } else {
            switch (categoryId) {
                case "J30":
                    importance = 1;
                    break;
                case "J60":
                    importance = 2;
                    break;
                case "J100":
                    importance = 3;
                    break;
                case "J200":
                    importance = 5;
                    break;
                case "J300":
                    importance = 7;
                    break;
                case "J500":
                    importance = 8;
                    break;
                case "JGS":
                    importance = 10;
                    break;

                case "G1":
                    importance = 7;
                    break;
                case "G2":
                    importance = 5;
                    break;
                case "G3":
                    importance = 3;
                    break;
                case "G4":
                    importance = 2;
                    break;
                case "G5":
                    importance = 1;
                    break;
                case "GA":
                    importance = 10;
                    break;
                default:
                    importance = 8;
                    break;
            }
        }

        let surface: Surfaces = Surfaces.other;
        switch (surfaceCode) {
            case "C": surface = Surfaces.clay; break;
            case "A": surface = Surfaces.carpet; break;
            case "H": surface = Surfaces.hard; break;
            case "G": surface = Surfaces.grass; break;
        }

        return {
            id: json["tournamentKey"],
            name: json["tournamentName"],
            desc: null,
            locationId: place,
            isOutdoors: json["indoorOrOutDoor"] === "Outdoor",
            surfaceCode: surface,
            statusCode: json["tourStatusCode"],
            categoryId: categoryId,
            importance: importance,
            prizeMoney: priceMoney,
            startDate: new Date(json["startDate"]),
            endDate: new Date(json["endDate"]),
            url: json["tournamentLink"] ? "https://www.itftennis.com" + json["tournamentLink"] : null,
            lat: coords && coords.length === 2? coords[0] : null,
            lon: coords && coords.length === 2? coords[1] : null
        };
    }

}