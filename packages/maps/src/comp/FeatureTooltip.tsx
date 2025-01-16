// import React from 'react';
// import {TennisTournament, TournamentUtils} from "../utils/TournamentUtils";
// import {MapUtils} from "../utils/MapUtils";
//
//
// interface FeatureTooltipProps {
// }
//
//
// interface FeatureTooltipState {
//     tournaments: TennisTournament[];
//     x: number;
//     y: number;
// }
//
//
// export class FeatureTooltip extends React.Component<FeatureTooltipProps, FeatureTooltipState> {
//
//     constructor(props: Readonly<FeatureTooltipProps>) {
//         super(props);
//         this.state = {
//             tournaments: null,
//             x: 0,
//             y: 0
//         };
//     }
//
//     public setTournaments = (tournaments:  TennisTournament[], x: number, y: number): void => {
//         tournaments.sort((t1, t2) => {
//             const time1 = t1.startDate.getTime();
//             const time2 = t2.startDate.getTime();
//             return time1 < time2 ? -1 : (time1 > time2 ? 1 : 0);
//         });
//         this.setState({tournaments: tournaments, x: x, y: y});
//     }
//
//     public isEmpty = (): boolean => {
//         return !this.state.tournaments || this.state.tournaments.length === 0;
//     }
//
//     render() {
//         const tournaments = this.state.tournaments;
//         let tourDivs = [];
//
//         if (tournaments !== null && tournaments.length > 0) {
//             for (let i = 0; i < Math.min(8, tournaments.length); i++) {
//                 const t = tournaments[i];
//                 tourDivs.push(
//                     <div className={`tournament`}>
//                         <div className={"header"}>
//                             <span className={"date"}>{TournamentUtils.displayDataRange(t)}</span>
//                             <span className={"location"}>{t.locationId}</span>
//                         </div>
//                         <div className={"name"}>
//                             <span>{t.name}&nbsp;</span>
//                             <span style={{flexGrow: 1}} />
//                             {MapUtils.createTournamentBadgeElement(t)}
//                         </div>
//                     </div>
//                 );
//             }
//
//             const remains = Math.max(0, tournaments.length - 8);
//
//             return (
//                 <div className={"feature-tooltip"} style={{left: `${this.state.x}px`, top: `${this.state.y}px`}}>
//                     {tourDivs}
//                     {
//                         remains > 0 &&
//                         <div className={"bottom-info"}>And {remains} more</div>
//                     }
//                 </div>
//             );
//         }
//
//         return null;
//     }
//
// }
export {}