import {TimeUtils} from "./TimeUtils";
import {ITFFactory} from "./ITFFactory";
import {TEFactory} from "./TEFactory";
import {TennisFactory} from "./TennisFactory";
import {getBaseDataUrl} from "./CommonUtil";


const NO_CORS_PARAMS = {
    mode: 'no-cors',
    method: "get",
    headers: {"Content-Type": "application/json"}
};

export enum Surfaces {
    hard,
    clay,
    carpet,
    grass,
    other
}

export const surfaceArray = [Surfaces.hard, Surfaces.clay, Surfaces.grass, Surfaces.carpet, Surfaces.other];

// mapiranje vrednosti iz enumeracije u čitljive nazive podloga
export const getSurfaceName = (s: Surfaces): string => {
    switch (s) {
        case Surfaces.clay: return "Clay";
        case Surfaces.carpet: return "Carpet";
        case Surfaces.hard: return "Hard";
        case Surfaces.grass: return "Grass";
        default: return "Other";
    }
}

export interface TennisTourInfo {
    id: string;
    name: string;
    type: string;
    yearFrom: number;
    yearTo: number;
}


/**
 * Basic tennis tournament info.
 */
export interface TennisTournament {
    id: string;
    name: string;
    desc: string | null;
    locationId: string;
    isOutdoors: boolean;
    surfaceCode: Surfaces;
    statusCode: string;
    categoryId: string;
    importance: number;
    prizeMoney: string;
    startDate: Date;
    endDate: Date;
    url: string;
    lat: number;
    lon: number;
}


export interface TournamentInfoFactory {
    fetchCalendarData(tourCode: string, year: number): Promise<object[]>;
    createTournament: (json: object) => TennisTournament;
}


let tourInfos: TennisTourInfo[] = [];


export const loadTennisTourInfos = (onLoaded: () => void, onError: (reason) => void) => {
    tourInfos = [];
    fetch(`${ getBaseDataUrl()}tourinfo.json`).then(
        response => response.json(), onError
    ).then(json => {
        const toursArr = json?.tours;
        if (toursArr) {
            for (let tourJson of toursArr) {
                const tourInfo: TennisTourInfo = {
                    id: tourJson["id"],
                    name: tourJson["name"],
                    type: tourJson["type"],
                    yearFrom: tourJson["yearfrom"],
                    yearTo: tourJson["yearto"]
                };
                tourInfos.push(tourInfo);
            }
        }
        onLoaded();
    }, onError);
}

export const getTennisTourInfos = (): TennisTourInfo[] => {
    return tourInfos;
}


const itfFactory = new ITFFactory();
const teFactory = new TEFactory();


export const getTournamentInfoFactory = (tourCode: string): TennisFactory => {
    switch (tourCode) {
        case "TE12": case "TE14": case "TE16":
            return teFactory;
    }
    return itfFactory;
}


export class TournamentUtils {

    public static displayDataRange(t: TennisTournament): string {
        if (t && t.startDate && t.endDate) {
            const equalMonths = t.startDate.getMonth() === t.endDate.getMonth();
            return TimeUtils.format(t.startDate.getTime(), "MMM d") + " - " + TimeUtils.format(t.endDate.getTime(), equalMonths ? "d" : "MMM d");
        }
        return null;
    }

    public static isActiveTournament(t: TennisTournament): boolean {
        const now = Date.now();
        return now >= t?.startDate.getTime() && now < t?.endDate.getTime() + TimeUtils.ONE_DAY;
    }

    public static getTourLastYear(tourId: string): number {
        for (const ti of tourInfos) {
            if (ti.id === tourId) {
                return ti.yearTo;
            }
        }
    }

}
