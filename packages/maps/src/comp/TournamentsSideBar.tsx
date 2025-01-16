import React, {JSX, RefObject} from 'react';
import {getSurfaceName, getTennisTourInfos, TennisTournament, TournamentUtils} from "utils/TournamentUtils";
import {XIcon} from "../ui/XIcon";
import {LoadingState} from "MapComponent";
import {Global} from "../utils/GlobalUtils";
import {MapUtils} from "../utils/MapUtils";
import {isMobile, openUrl} from "../utils/CommonUtil";
import {TournamentsFilter} from "./TournamentsFilter";
import {Extent} from "ol/extent";
import {XButton} from "../ui/XButton";
import {SourceSelector} from "./SourceSelector";
import {createFlexSpacer} from "../utils/ReactUtils";


interface TournamentsSideBarProps {
    tourInfoLoadingState: LoadingState;
    loadingCalendarState: LoadingState;
    tournaments: TennisTournament[];
    tourCode: string;
    seasonYear: number;
    onCalendarSourceSelected: (tourCode: string, year: number) => void;
    onFilterApplied: (filteredTournaments: TennisTournament[]) => void;
    onRowClick?: (t: TennisTournament) => void;
    highlightTournament: (t: TennisTournament) => void;
    mapExtent: Extent;
}


interface TournamentsSideBarState {
    compact: boolean;
    tournaments: TennisTournament[];
    showSelection: boolean;
}


export class TournamentsSideBar extends React.Component<TournamentsSideBarProps, TournamentsSideBarState> {

    private mapExtent: Extent = null;

    private categorySet: Set<string> = new Set<string>();

    constructor(props: Readonly<TournamentsSideBarProps>) {
        super(props);

        this.mapExtent = this.props.mapExtent;

        for (let t of this.props.tournaments) {
            this.categorySet.add(t.categoryId);
        }

        this.state = {
            compact: Global.compactTableView || isMobile,
            tournaments: this.props.tournaments,
            showSelection: false
        };
    }


    setMapExtent(extent: Extent) {
        this.mapExtent = extent;
        if (Global.filterOnExtent) {
            this.filter();
        }
    }

    private heightBeforeDrag: number = -1;

    private startDrag = () => {
        const sideBar = document.getElementById("sidebar");
        if (sideBar) {
            this.heightBeforeDrag = sideBar.clientHeight;
        }
    }

    private resize = (move: number) => {
        const sideBar = document.getElementById("sidebar");
        if (sideBar) {
            const newHeight = this.heightBeforeDrag - move;
            sideBar.style.maxHeight = `min(max(${newHeight}px, 20vh), 80vh)`;
            sideBar.style.minHeight = `min(max(${newHeight}px, 20vh), 80vh)`;
        }
    }

    private filter = (): void => {
        let match = (s: string, kwd: string): boolean => s?.toLowerCase().match(kwd) != null;
        let kwd = Global.keyword.toLowerCase().trim();
        const filteredTournaments: TennisTournament[] = [];
        for (const t of this.props.tournaments) {
            if (!kwd || match(t.locationId, kwd) || match(t.name, kwd) || match(t.categoryId, kwd) || match(getSurfaceName(t.surfaceCode), kwd)) {
                const tStart = t.startDate.getMonth();
                const tEnd = t.endDate.getMonth();
                if ( (tStart >= Global.monthFrom && tStart <= Global.monthFrom) || (tEnd >= Global.monthFrom && tEnd <= Global.monthTo) ) {
                    if (Global.selectedCategories.has(t.categoryId) && Global.selectedSurfaces.has(t.surfaceCode)) {
                        let satisfy = !Global.filterOnExtent || !this.mapExtent;
                        if (!satisfy) {
                            satisfy = this.mapExtent[0] <= t.lon && this.mapExtent[2] >= t.lon && this.mapExtent[1] <= t.lat && this.mapExtent[3] >= t.lat;
                        }
                        if (satisfy) {
                            filteredTournaments.push(t);
                        }
                    }
                }
            }
        }
        this.props.onFilterApplied(filteredTournaments);
        this.setState({tournaments: filteredTournaments});
    }

    private onRowMouseEnter = (t: TennisTournament): void => {
        if (!isMobile && Global.filterOnExtent) {
            this.props.highlightTournament(t);
        }
    }

    private onRowMouseLeave = (): void => {
        if (!isMobile && Global.filterOnExtent) {
            this.props.highlightTournament(null);
        }
    }

    private selectCalendarAndSource = (show: boolean): void => {
        this.setState({showSelection: show});
    }

    private renderWideContent = (): JSX.Element => {
        const rows = [];
        let hasCourtInfo = false;
        if (this.props.tournaments != null) {
            let hasCourtInfo = false;
            for (let t of this.state.tournaments) {
                if (t.isOutdoors !== null) {
                    hasCourtInfo = true;
                    break;
                }
            }

            for (let t of this.state.tournaments) {
                let surfaceEl = <span className={`small-badge ${MapUtils.getFillClassName(t.surfaceCode)}`}>{getSurfaceName(t.surfaceCode)}</span>;
                rows.push(
                    <tr key={`row_${t.id}`} onClick={() => this.props.onRowClick && this.props.onRowClick(t)} onMouseEnter={() => this.onRowMouseEnter(t)} onMouseLeave={() => this.onRowMouseLeave()}>
                        <td className={"nowrap"}>
                            {TournamentUtils.displayDataRange(t)}
                        </td>
                        <td>
                            {t.locationId}
                        </td>
                        <td style={{display: "flex", flexDirection: "row"}}>
                            <span style={{flexGrow: 1}}>{t.name}</span>
                            {
                                !isMobile && t.url &&
                                <XIcon icon={XIcon.LINK} iconSize={10} onClick={() => {
                                    window.open(t.url, '_blank');
                                }} />
                            }
                        </td>
                        <td className={"nowrap"}>
                            {t.categoryId}
                        </td>
                        {
                            hasCourtInfo &&
                            <td>{t.isOutdoors ? "Outdoor" : "Indoor"}</td>
                        }
                        <td>
                            {surfaceEl}
                        </td>
                    </tr>
                )
            }
        }

        return (
            <table cellSpacing={0}>
                <thead>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Tournament</th>
                    <th>Category</th>
                    {
                        hasCourtInfo &&
                        <th>Court</th>
                    }
                    <th>Surface</th>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    private renderCompactContent = (): JSX.Element => {
        let rows = [];
        if (this.state.tournaments != null) {
            for (let t of this.state.tournaments) {
                rows.push(
                    <tr key={`row_${t.id}`} onClick={() => this.props.onRowClick && this.props.onRowClick(t)} onMouseEnter={() => this.onRowMouseEnter(t)} onMouseLeave={() => this.onRowMouseLeave()}>
                        <td>
                            <div className={"horizontal-flex"}>
                                <span className={"date"}>{TournamentUtils.displayDataRange(t)}</span>
                                <span className={"location"}>{t.locationId}</span>
                                {
                                    TournamentUtils.isActiveTournament(t) && <span className={"live"}>&#9679;</span>
                                }
                                <span style={{flexGrow: 1}}/>
                                {MapUtils.createTournamentBadgeElement(t)}
                            </div>
                            <div className={"horizontal-flex"}>
                                <span style={{fontWeight: "bold"}} title={t.name}>
                                    {t.name}
                                </span>
                                {
                                    !isMobile && t.url &&
                                    <span className={"link"}>
                                        <XIcon icon={XIcon.LINK} title={"Open tournament page"} iconSize={10} onClick={() => openUrl(t.url)} />
                                    </span>
                                }
                            </div>
                        </td>
                    </tr>
                )
            }
        }

        return (
            <table cellSpacing={0}>{rows}</table>
        )
    }

    private renderContent = (): JSX.Element => {
        let tennisTourInfos = getTennisTourInfos();

        const tourOptions = [];
        const tourYearOptions = [];
        let tourName = "";
        let tourId = null;
        for (let ti of tennisTourInfos) {
            tourOptions.push(<option value={ti.id}>{ti.name}</option>);
            if (ti.id === this.props.tourCode) {
                tourName = ti.name;
                tourId = ti.id;
                for (let i = ti.yearTo; i >= ti.yearFrom; i--) {
                    tourYearOptions.push(<option value={i}>{i}</option>);
                }
            }
        }

        const tCount = this.state.tournaments.length;
        return (
            <>
                <div key={`tsh_${tCount}_${this.state.compact}_${this.props.tourInfoLoadingState}`} className={"tour-selection-header"}>
                    {
                        tourId && <span className={"logo"} onClick={() => this.selectCalendarAndSource(true)}><img src={`${tourId}.png`} /></span>
                    }
                    <h1 onClick={() => this.selectCalendarAndSource(true)}>
                        <span>{tourName}</span><span className={"yearBadge"}>{this.props.seasonYear}</span>
                    </h1>
                    {createFlexSpacer()}
                    <XButton text={"Select"} onClick={() => this.selectCalendarAndSource(true)} style={{marginLeft: "0.6rem"}} />
                    {
                        this.state.showSelection &&
                        <SourceSelector
                            tourCode={this.props.tourCode}
                            year={this.props.seasonYear}
                            onSelect={(code, year) => this.props.onCalendarSourceSelected(code, year)}
                            onCancel={() => this.selectCalendarAndSource(false)}
                        />
                    }
                </div>
                {
                    this.props.loadingCalendarState ===  LoadingState.ok &&
                    <TournamentsFilter
                        tournaments={this.state.tournaments}
                        categorySet={this.categorySet}
                        filter={this.filter}
                        onDragStart={() => this.startDrag()}
                        onDrag={move => this.resize(move)}
                    />
                }
                <div key={`ttab_${Date.now()}`} className={"tour-table-container"}>
                    {
                        this.props.loadingCalendarState === LoadingState.loading &&
                        <span>Loading...</span>
                    }
                    {
                        this.props.loadingCalendarState === LoadingState.ok &&
                        (tCount ? (this.state.compact ? this.renderCompactContent() : this.renderWideContent()) : null)
                    }
                </div>
            </>
        );
    }

    render() {
        let content: JSX.Element;
        switch (this.props.tourInfoLoadingState) {
            case LoadingState.loading:
                content = <div>Loading tournament data...</div>;
                break;
            case LoadingState.error:
                content = <div>Error loading tournament data!</div>;
                break;
            default:
                content = this.renderContent();
                break;
        }

        return <div id={"sidebar"} className={this.state.compact ? "tour-sidebar tour-sidebar-compact" : "tour-sidebar"}>{content}</div>;
    }

}
