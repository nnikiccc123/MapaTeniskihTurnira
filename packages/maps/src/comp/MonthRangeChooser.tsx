import React from 'react';
import {TimeUtils} from "../utils/TimeUtils";
import {isMobile} from "../utils/CommonUtil";


interface MonthRangeChooserProps {
    monthFrom?: number;
    monthTo?: number;
    onSelect: (from: number, to: number) => void;
    compact?: boolean;
}


interface MonthRangeChooserState {
    monthFrom: number;
    monthTo: number;
}


export class MonthRangeChooser extends React.Component<MonthRangeChooserProps, MonthRangeChooserState> {

    constructor(props: Readonly<MonthRangeChooserProps>) {
        super(props);
        this.state = {
            monthFrom: this.props.monthFrom??0,
            monthTo: this.props.monthTo??11
        };
    }

    render() {
        const monthElements = [];

        for (let i = 0; i < TimeUtils.MONTH_NAMES_SHORT.length; i++) {
            let className = isMobile ? "month-mobile" : "month";
            if (i >= this.state.monthFrom && i <= this.state.monthTo) {
                className += " selected";
            }
            let monthName = TimeUtils.MONTH_NAMES_SHORT[i];
            let tooltip = undefined;

            monthElements.push(
                <div key={`m_${i}`} className={className} onClick={() => this.selectMonth(i)} title={tooltip}>{monthName}</div>
            )
        }

        return (
           <div className={"month-range-chooser"}>{monthElements}</div>
        );
    }

    private selectMonth(month: number) {
        let isSingleSelected = this.state.monthFrom === this.state.monthTo;
        let from: number;
        let to: number;
        if (isSingleSelected) {
            from = Math.min(month, this.state.monthFrom);
            to = Math.max(month, this.state.monthTo);
        } else {
            from = month;
            to = month;
        }
        this.setState({monthFrom: from, monthTo: to});
        this.props.onSelect(from, to);
    }

}