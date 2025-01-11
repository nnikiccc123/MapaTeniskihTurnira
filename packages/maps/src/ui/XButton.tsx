import React from 'react';
import {IconInfo, XIcon} from "./XIcon";
import {CSSProperties} from "react";
import {isMobile} from "../utils/CommonUtil";



interface XButtonProps {
    text?: any;
    icon?: IconInfo;
    iconPosition?: "left" | "right";
    className?: string;
    touchClassName?: string;
    selectedClassName?: string;
    onClick?: () => void;
    style?: CSSProperties;
    disabled?: boolean;
    toggle?: boolean;
}



interface XButtonState {
    text: any;
    isTouch: boolean;
    selected?: boolean;
}



export class XButton extends React.Component<XButtonProps, XButtonState> {


    constructor(props: XButtonProps, context: any) {
        super(props, context);
        this.state = {
            text: this.props.text,
            isTouch: false,
        }
    }


    private onClick = (): void => {
        if (this.props.toggle) {
            this.setState({selected: !this.state.selected});
        }
        if (this.props.onClick) {
            this.props.onClick()
        }
    };

    setText = (s: string): void => {
        this.setState({text: s});
    }

    render() {
        let leftEl = null;
        let rightEl = null;
        const iconSize = isMobile ? "3vmin" : "0.8rem";
        const iconLabelSpacing = isMobile ? "2vmin" : "0.5rem"
        if (this.props.icon) {
            if (this.props.iconPosition === "right") {
                rightEl = <XIcon icon={this.props.icon} iconSize={iconSize} style={{marginLeft: this.props.text ? iconLabelSpacing : "0"}}/>;
            } else {
                leftEl = <XIcon icon={this.props.icon} iconSize={iconSize} style={{marginRight: this.props.text ? iconLabelSpacing : "0"}}/>;
            }
        }

        let toggle = this.props.toggle;
        let disabled = this.props.disabled;

        let className = this.props.className || "";
        if (this.state.isTouch) {
            let touchClassName = this.props.touchClassName || "touched-button";
            className += " " + touchClassName;
        }
        if (toggle && this.state.selected) {
            let selectedClassName = this.props.selectedClassName || "selected-button";
            className += " " + selectedClassName;
        }
        return (
            <button className={className}
                    onClick={() => !disabled && this.onClick()}
                    onTouchStart={() => isMobile && !toggle && !disabled && this.setState({isTouch: true})}
                    onTouchEnd={() => isMobile && !toggle && !disabled && this.setState({isTouch: false})}
                    onMouseDown={() => !isMobile && !toggle && !disabled && this.setState({isTouch: true})}
                    onMouseUp={() => !isMobile && !toggle && !disabled && this.setState({isTouch: false})}
                    style={this.props.style}
                    disabled={disabled}
            >
                {leftEl}
                <span dangerouslySetInnerHTML={{ __html: this.state.text }}/>
                {rightEl}
            </button>
        );
    }

}