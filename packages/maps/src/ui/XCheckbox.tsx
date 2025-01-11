import React, {CSSProperties} from 'react';
import {XIcon} from "./XIcon";
import {getSurfaceName} from "../utils/TournamentUtils";


interface XCheckboxProps {
    toggleMode?: boolean;
    label?: any;
    checked?: boolean;
    fillColor?: string;
    onChange?: (b: boolean) => void;
}


interface XCheckboxState {
    checked: boolean;
}


export class XCheckbox extends React.Component<XCheckboxProps, XCheckboxState> {

    constructor(props: XCheckboxProps) {
        super(props);
        this.state = {
            checked: this.props.checked
        }
    }

    toggle = () => {
        const newChecked = !this.state.checked;
        this.setState({
            checked: newChecked
        });
        if (this.props.onChange) {
            this.props.onChange(newChecked);
        }
    }

    render = () => {
        if (this.props.toggleMode) {
            let style: CSSProperties = {};
            if (this.props.fillColor) {
                if (this.state.checked) {
                    style.backgroundColor = this.props.fillColor;
                }
                style.borderColor = this.props.fillColor;
            }
            return (
                <span key={`cb_${this.state.checked}`}
                      className={this.state.checked ? "checkbox-toggle-selected": "checkbox-toggle"}
                      onClick={this.toggle}
                      style={style}
                >
                <span>{this.props.label}</span>
            </span>
            );
        } else {
            return (
                <span key={`cb_${this.state.checked}`} className={"checkbox"} onClick={this.toggle}>
                <XIcon icon={this.state.checked ? XIcon.CHECKED : XIcon.UNCHECKED} iconSize={16} />
                <span className={"label"}>{this.props.label}</span>
            </span>
            );
        }
    }

}
