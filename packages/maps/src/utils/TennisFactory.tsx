import {TennisTournament} from "./TournamentUtils";


export type Locations = {
    [key: string]: [number, number];
}


export abstract class TennisFactory {

    protected locations: Locations = null;

    protected loadLocationsFromUrl = (url: string): Promise<Locations> => {
        return fetch(url).then(
            response => response.json()
        ).then(json => {
            let locations: Locations = {};
            for (let loc of json) {
                if (loc?.place && loc?.lat && loc?.lon) {
                    locations[loc?.place] = [loc?.lat, loc?.lon];
                }
            }
            return locations;
        });
    }

    protected abstract loadLocations(): Promise<Locations>;

    protected abstract loadLocationPatches(): Promise<Locations>;

    protected abstract fetchCalendarData(tourCode: string, year: number): Promise<object[]>;

    protected abstract createTournament: (json: object) => TennisTournament;

    private loadTournaments = (tourCode: string, year: number): Promise<TennisTournament[]> => {
        return this.fetchCalendarData(tourCode, year).then(
            tDefs => {
                const tournaments: TennisTournament[] = [];
                const idSet: Set<string> = new Set<string>();
                for (let t of tDefs) {
                    const tournament = this.createTournament(t);
                    if (tournament && !idSet.has(tournament.id)) {
                        idSet.add(tournament.id);
                        tournaments.push(tournament);
                    }
                }
                return tournaments;
            }
        );
    }

    public load = (tourCode: string, year: number): Promise<TennisTournament[]> => {
        if (!this.locations) {
            return this.loadLocations().
                then(locations => this.locations = locations).
                then(() => this.loadLocationPatches()).
                then(patches => this.locations = {...this.locations, ...patches}).
                then(() => this.loadTournaments(tourCode, year));
        } else {
            return this.loadTournaments(tourCode, year);
        }
    }

}