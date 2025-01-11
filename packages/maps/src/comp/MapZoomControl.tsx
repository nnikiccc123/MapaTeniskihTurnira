import React, {JSX} from 'react';
import {XIcon} from "../ui/XIcon";
import {isMobile} from "../utils/CommonUtil";


interface MapZoomControlProps {
    onZoom: (isZoomIn: boolean) => void;
}


interface MapZoomControlState {
    isTouch: boolean;
}


export class MapZoomControl extends React.Component<MapZoomControlProps, MapZoomControlState> {

    constructor(props: Readonly<MapZoomControlProps>) {
        super(props);
        this.state = {
            isTouch: false
        }
    }

    private renderZoomButton = (isZoomIn: boolean) => {
        return (
            <XIcon
                icon={isZoomIn ? XIcon.PLUS: XIcon. MINUS}
                iconSize={32}
                className={"zoom-button"}
                onClick={() => this.props.onZoom(isZoomIn)}
            />
        )
    }

    render() {
        return (
            <div className={"zoom-control"}>
                {this.renderZoomButton(true)}
                {this.renderZoomButton(false)}
            </div>
        );
    }

}