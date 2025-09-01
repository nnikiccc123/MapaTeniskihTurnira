import React from 'react';
import {TennisTournament, TournamentUtils} from "../utils/TournamentUtils";
import {MapUtils} from "../utils/MapUtils";
import {ensureTextLen, isMobile, openUrl} from "../utils/CommonUtil";
import {XButton} from "../ui/XButton";
import {XIcon} from "../ui/XIcon";


interface TournamentsTooltipProps {
    tournaments: TennisTournament[];
    maxtoshow?: number;
}


interface TournamentsTooltipState {
}


export class TournamentsTooltip extends React.Component<TournamentsTooltipProps, TournamentsTooltipState> {

    constructor(props: Readonly<TournamentsTooltipProps>) {
        super(props);
        this.state = {};
    }

    render() {
        const tournaments = this.props.tournaments;
        let tourDivs = [];

        if (tournaments !== null && tournaments.length > 0) {
            const maxToShow = this.props.maxtoshow || 8;
            for (let i = 0; i < tournaments.length; i++) {
                const t = tournaments[i];
                const infoEl = (
                    <div className={`tournament`} onClick={() => openUrl(t.url)}>
                        <div className={"header"}>
                            <span className={"date"}>{TournamentUtils.displayDataRange(t)}</span>
                            <span className={"location"}>{t.locationId}</span>
                        </div>
                        <div className={"name-line"}>
                            <span className={"name"} title={t.name}>
                                {isMobile ? ensureTextLen(t.name, 30) : t.name}
                                {
                                    TournamentUtils.isActiveTournament(t) &&
                                    <span className={"live"}>&#9679;</span>
                                }
                            </span>
                            <span style={{flexGrow: 1}} />
                            {MapUtils.createTournamentBadgeElement(t)}
                        </div>
                    </div>
                );

                tourDivs.push(
                    infoEl
                );
            }

            return (
                <div className={"feature-tooltip"}>
                    <div className={"tournament-list"}>
                        {tourDivs}
                    </div>
                    {
                        isMobile &&
                        <div className={"bottom-info"}>Tap to open tournament page</div>
                    }
                </div>
            );
        }

        return null;
    }

}