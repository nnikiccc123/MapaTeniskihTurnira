import {Locations, TennisFactory} from "./TennisFactory";
import {Surfaces, TennisTournament} from "./TournamentUtils";
import {getBaseDataUrl} from "./CommonUtil";

export class TEFactory extends TennisFactory {

    protected loadLocationPatches(): Promise<Locations> {
        return this.loadLocationsFromUrl(`${ getBaseDataUrl()}te/location_patches.json`);
    }

    protected loadLocations(): Promise<Locations> {
        return this.loadLocationsFromUrl(`${ getBaseDataUrl()}te/locations.json`);
    }

    private getTETourCode = (json): string => {
        const age = json["age"];
        if (age) {
            if (age.startsWith("12")) {
                return "TE12";
            } else if (age.startsWith("14")) {
                return "TE14";
            } else if (age.startsWith("16")) {
                return "TE16";
            }
            const name = json["name"]?.toLowerCase();
            if (name) {
                if (name.includes("g12") || name.includes("b12")) {
                    return "TE12";
                } else if (name.includes("g14") || name.includes("b14")) {
                    return "TE14";
                } else if (name.includes("g16") || name.includes("b16")) {
                    return "TE16";
                }
            }
            return null;
        }
    }

    public fetchCalendarData = (tourCode: string, year: number): Promise<object[]> => {
        return fetch(`${ getBaseDataUrl()}te/${year}.json`).then(
            response => response.json(), reason => console.error(reason)
        ).then(json => {
            let tournaments = [];
            if (json) {
                for (let t of json) {
                    if (this.getTETourCode(t) === tourCode) {
                        tournaments.push(t);
                    }
                }
            }
            return tournaments;
        });
    }


    public createTournament = (json: object): TennisTournament => {
        let place = json["location"]?.trim();
        const coords = this.locations[place];
        const surfaceCode = json["surface"];
        let categoryId: string = json["category"];

        let importance = 1;
        const catValue = categoryId?.toLowerCase().replace("category", "")?.trim();
        if (catValue === "1") {
            importance = 7;
        } else if (catValue === "2") {
            importance = 4;
        } else if (catValue === "3") {
            importance = 1;
        } else {
            importance = 10;
        }

        let surface: Surfaces = Surfaces.other;
        switch (surfaceCode?.toLowerCase()) {
            case "acryllic": case "asphalt": case "concrete": surface = Surfaces.hard; break;
            case "clay": surface = Surfaces.clay; break;
            case "grass":  case "artificial grass": surface = Surfaces.grass; break;
            case "carpet": surface = Surfaces.carpet; break;
        }

        let id = null;
        let url = json["url"];
        if (url) {
            let idx = url.indexOf("?id=");
            if (idx > 0) {
                id = url.substring(idx + 4);
            }
        }

        const parseDate = (s: string): Date => {
            const parts = s?.split("/");
            if (parts?.length === 3) {
                let d = Number(parts[0]);
                let m = Number(parts[1]);
                let y = Number(parts[2]);
                return new Date(y, m - 1, d);
            }
            return undefined;
        }

        if (id) {
            return {
                id: id,
                name: json["name"],
                desc: null,
                locationId: place,
                isOutdoors: null,
                surfaceCode: surface,
                statusCode: null,
                categoryId: categoryId,
                importance: importance,
                prizeMoney: null,
                startDate: parseDate(json["fromdate"]),
                endDate: parseDate(json["todate"]),
                url: url,
                lat: coords && coords.length === 2 ? coords[0] : null,
                lon: coords && coords.length === 2 ? coords[1] : null
            };
        }

        return null;
    }

}