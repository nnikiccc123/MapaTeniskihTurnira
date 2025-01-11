import React, {RefObject} from 'react';
import {getSurfaceName, surfaceArray, Surfaces, TennisTournament} from "../utils/TournamentUtils";
import {Global} from "../utils/GlobalUtils";
import {isMobile} from "../utils/CommonUtil";
import {XIcon} from "../ui/XIcon";
import {MonthRangeChooser} from "./MonthRangeChooser";
import {MapUtils} from "../utils/MapUtils";
import {createFlexSpacer, createHorSpacer} from "../utils/ReactUtils";
import {XButton} from "../ui/XButton";
import {TimeUtils} from "../utils/TimeUtils";
import {XCheckbox} from "../ui/XCheckbox";


interface TournamentFilterProps {
    categorySet: Set<string>;
    tournaments: TennisTournament[];
    filter: () => void;
    onDragStart?: () => void;
    onDrag?: (move: number) => void;
}


interface TournamentFilterState {
    hidden: boolean;
}


export class TournamentsFilter extends React.Component<TournamentFilterProps, TournamentFilterState> {
    private kwdInputRef: RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();

    constructor(props: Readonly<TournamentFilterProps>) {
        super(props);
        Global.resetFilter(this.props.categorySet);
        this.state = {hidden: false};
    }

    componentDidMount() {
       this.props.filter();
    }

    private resetFilter = () => {
        Global.resetFilter(this.props.categorySet);
        this.props.filter();
        if (this.kwdInputRef.current) {
            this.kwdInputRef.current.value = "";
            this.kwdInputRef.current.focus();
        }
        this.forceUpdate();
    }

    private toggleCategory = (cat: string): void => {
        if (Global.selectedCategories.has(cat)) {
            Global.selectedCategories.delete(cat);
        } else {
            Global.selectedCategories.add(cat);
        }
        this.props.filter();
        this.forceUpdate();
    }

    private toggleSurface = (sur: Surfaces): void => {
        if (Global.selectedSurfaces.has(sur)) {
            Global.selectedSurfaces.delete(sur);
        } else {
            Global.selectedSurfaces.add(sur);
        }
        this.props.filter();
        this.forceUpdate();
    }

    private toggleFilterOnExtent= (): void => {
        Global.filterOnExtent = !Global.filterOnExtent;
        this.props.filter();
        this.forceUpdate();
    }

    private toggleFilter = (): void => {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    private dragStartPos = -1;

    private onDragStart = e => {
        if (this.props.onDragStart && e.targetTouches != null && e.targetTouches.length === 1) {
            this.dragStartPos = e.targetTouches[0].screenY;
            this.props.onDragStart();
        }
    }

    private onDragEnd = e => {
        this.dragStartPos = -1;
    }

    private onDrag = e => {
        if (this.props.onDrag && e.targetTouches != null && e.targetTouches.length === 1) {
            this.props.onDrag(e.targetTouches[0].screenY - this.dragStartPos);
        }
    }

    render() {
        const kwdInput =
            <input ref={this.kwdInputRef}
                   type={"text"}
                   size={25}
                   placeholder={Global.compactTableView ? "Keyword" : ""}
                   defaultValue={Global.keyword}
                   onChange={e => {
                       Global.keyword = e.target.value;
                        this.props.filter();
                   }}
            />;
        const monthRangeChooser =
            <MonthRangeChooser
                key={`mc_${Global.monthFrom}_${Global.monthTo}`}
                monthFrom={Global.monthFrom}
                monthTo={Global.monthTo}
                onSelect={(from, to) => {
                    Global.monthFrom = from;
                    Global.monthTo = to;
                    this.props.filter()
                }}
            />;
        const cats = [];
        this.props.categorySet.forEach(v => {
            cats.push(
                <div style={{margin: "0.2rem 0.4rem 0.2rem 0"}}>
                    <XCheckbox
                        key={`catcb_${v}_${Global.selectedCategories.has(v)}`}
                        toggleMode={true}
                        label={MapUtils.createCategoryBadgeElement(v)}
                        checked={Global.selectedCategories.has(v)}
                        onChange={b => this.toggleCategory(v)}
                    />
                </div>
            );
        });
        const surfaces = [];
        surfaceArray.forEach(v => {
            surfaces.push(
                <div style={{marginRight: "0.4rem"}}>
                    <XCheckbox
                        key={`surcb_${v}_${Global.selectedSurfaces.has(v)}`}
                        toggleMode={true}
                        label={getSurfaceName(v)}
                        fillColor={MapUtils.getSurfaceColor(v)}
                        checked={Global.selectedSurfaces.has(v)}
                        onChange={b => this.toggleSurface(v)}
                    />
                </div>
            );
        })
        const filterOnExtent = (
            <XCheckbox
                key={`foecb_${Global.filterOnExtent}}`}
                label={"Filter by current map view"}
                checked={Global.filterOnExtent}
                onChange={b => this.toggleFilterOnExtent()}
            />
        )

        const tCount = this.props.tournaments.length;

        const bodyContent = <div>
            {
                <div className={"controls-row"}>
                    {!Global.compactTableView && <label>Keyword</label>}
                    {kwdInput}
                </div>
            }
            <div className={"controls-row"}>
                {!Global.compactTableView && <label>Dates</label>}
                {monthRangeChooser}
            </div>
            <div className={"controls-row"}>
                {!Global.compactTableView && <label>Categories</label>}
                <div className={"horizontal-flex-wrapped"}>{cats}</div>
            </div>
            {
                !isMobile &&
                <div className={"controls-row"}>
                    {!Global.compactTableView && <label>Surfaces</label>}
                    {surfaces}
                </div>
            }
            <div className={"controls-row special"}>
                {filterOnExtent}
            </div>
        </div>;

        let monthRangeStr = TimeUtils.MONTH_NAMES_SHORT[Global.monthFrom];
        if (Global.monthTo > Global.monthFrom) {
            monthRangeStr += ` - ${TimeUtils.MONTH_NAMES_SHORT[Global.monthTo]}`;
        }

        let countLabel = tCount === 0 ?
            `No tournaments` :
            `${tCount} ${tCount === 1 ? "tournament" : "tournaments"}`;
        if (Global.filterOnExtent) {
            countLabel += " on map";
        }
        return (
            <div key={`f_${this.state.hidden}`} className={"tour-filter"}>
                <div className={"header"}>
                    <div className={"resizer"} onTouchStart={this.onDragStart} onTouchEnd={this.onDragEnd} onTouchMove={this.onDrag}>
                        <XIcon icon={XIcon.SMALL_ARROW_UP} iconSize={12} className={"arrup"}/>
                        <XIcon icon={XIcon.SMALL_ARROW_DOWN} iconSize={12} className={"arrdown"}/>
                    </div>
                    <div className={"horizontal-flex"}>
                        <div className={"title-date-range"}>
                            {monthRangeStr}
                        </div>
                        <div>
                            {countLabel}
                        </div>
                    </div>
                    <div style={{flexGrow: 1}} />
                    <XButton text={"Reset"} onClick={this.resetFilter}/>
                    {createHorSpacer("0.5rem")}
                    <XButton icon={XIcon.FILTER} text={this.state.hidden ? "Show Filter" : "Hide Filter"}
                             onClick={() => this.toggleFilter()}/>
                </div>
                <div className={`filter-body`}>
                    {!this.state.hidden && bodyContent}
                </div>
            </div>
        )
    }
}
