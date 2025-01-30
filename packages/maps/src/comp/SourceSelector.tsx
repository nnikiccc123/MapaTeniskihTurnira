import React, {RefObject} from 'react';
import {getTennisTourInfos, TournamentUtils} from "../utils/TournamentUtils";
import {XButton} from "../ui/XButton";
import {createFlexSpacer} from "../utils/ReactUtils";
import {XIcon} from "../ui/XIcon";
import {EventUtils} from "../utils/EventUtils";


interface SelectionRowProps {
    content: any;
    selected: boolean;
    onSelect: () => void;
}


class SelectionRow extends React.Component<SelectionRowProps, null> {
    render() {
        return (
            <div className={`source-select-row${this.props.selected ? " selected": ""}`} onClick={this.props.onSelect}>
                {this.props.content}
            </div>
        )
    }
}


interface SourceSelectorProps {
    tourCode: string;
    year: number;
    onSelect: (tourCode: string, year: number) => void;
    onCancel: () => void;
}


interface SourceSelectorState {
    tourCode: string;
    year: number;
}


export class SourceSelector extends React.Component<SourceSelectorProps, SourceSelectorState> {

    constructor(props: Readonly<SourceSelectorProps>) {
        super(props);
        this.state = {
            tourCode: this.props.tourCode,
            year: this.props.year
        };
    }


    onClick = (e) => {
        if (e.target.className === "modal-dialog-wrapper") {
            this.props.onCancel();
        }
    }


    render() {
        let tennisTourInfos = getTennisTourInfos();

        const tours = [];
        const years = [];

        for (const tti of tennisTourInfos) {
            const logoAndName = (
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <span className={"logo"}><img src={`${tti.id}.png`} /></span>
                    <span>{tti.name}</span>
                </div>
            );
            tours.push(
                <SelectionRow content={logoAndName} selected={this.state.tourCode === tti.id} onSelect={
                    () => this.setState({tourCode: tti.id, year: TournamentUtils.getTourLastYear(tti.id)})
                }/>
            )
            if (tti.id === this.state.tourCode) {
                for (let y = tti.yearTo; y >= tti.yearFrom; y--) {
                    years.push(<SelectionRow content={y} selected={this.state.year === y} onSelect={() => this.setState({year: y})} />);
                }
            }
        }


        return (
            <div className={"modal-dialog-wrapper"} onClick={this.onClick}>
                <div key={`k_${this.props.tourCode}_${this.props.year}`} className={"source-selector"}>
                    <div className={"source-selector-header"}>
                        <span>Tour / Season</span>
                        {createFlexSpacer()}
                        <XIcon icon={XIcon.CLOSE} onClick={() => this.props.onCancel()} iconSize={"1rem"} />
                    </div>
                    <div className={"touryearlists"}>
                        <div className={"source-select-list"}>
                            {tours}
                        </div>
                        <div className={"source-select-list"} style={{borderLeft: "solid 1px rgba(0, 0, 0, 0.2)"}}>
                            {years}
                        </div>
                    </div>
                    <div style={{display: "flex", alignContent: "center", justifyContent: "center", padding: "0.5rem"}}>
                        <XButton text={"Select"} style={{fontSize: "1rem", cursor: "pointer", padding: "1rem 2rem"}} onClick={() => this.props.onSelect(this.state.tourCode, this.state.year)} />
                    </div>
                </div>
            </div>
        );
    }

}