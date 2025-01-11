import {surfaceArray, Surfaces} from "./TournamentUtils";


export class Global {
    public static compactTableView: boolean = true;

    public static keyword: string = "";
    public static monthFrom: number = 0;
    public static monthTo: number = 11;
    public static selectedCategories: Set<string> = new Set<string>();
    public static selectedSurfaces: Set<Surfaces> = new Set<Surfaces>(surfaceArray);

    public static filterOnExtent: boolean = false;

    public static resetFilter(categories: Set<string>) {
        this.keyword = "";
        this.monthFrom = 0;
        this.monthTo = 11;
        this.selectedCategories = new Set<string>(categories);
        this.selectedSurfaces = new Set<Surfaces>(surfaceArray);
    }
}