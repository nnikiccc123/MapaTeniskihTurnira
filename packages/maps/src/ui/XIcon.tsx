import React from 'react';
import {CSSProperties} from "react";


export class IconInfo {
    public path: string;
    public viewbox: number = 24;

    constructor(path: string, viewbox: number) {
        this.path = path;
        this.viewbox = viewbox;
    }
}


interface XIconProps {
    id?: string,
    icon: IconInfo,
    iconSize?: string | number,
    className?: string,
    style?: CSSProperties,
    color?: string,
    fill?: string,
    title?: string,
    onClick?: (e) => void,
    onMouseEnter?: (e) => void,
    onMouseLeave?: (e) => void,
}


interface XIconState {

}


export class XIcon extends React.Component<XIconProps, XIconState> {

    public static CLOSE: IconInfo = new IconInfo("M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z", 24);
    public static LAYERS: IconInfo = new IconInfo("M21.698 10.658l2.302 1.342-12.002 7-11.998-7 2.301-1.342 9.697 5.658 9.7-5.658zm-9.7 10.657l-9.697-5.658-2.301 1.343 11.998 7 12.002-7-2.302-1.342-9.7 5.657zm12.002-14.315l-12.002-7-11.998 7 11.998 7 12.002-7z", 24);
    public static SEARCH: IconInfo = new IconInfo("M23.111 20.058l-4.977-4.977c.965-1.52 1.523-3.322 1.523-5.251 0-5.42-4.409-9.83-9.829-9.83-5.42 0-9.828 4.41-9.828 9.83s4.408 9.83 9.829 9.83c1.834 0 3.552-.505 5.022-1.383l5.021 5.021c2.144 2.141 5.384-1.096 3.239-3.24zm-20.064-10.228c0-3.739 3.043-6.782 6.782-6.782s6.782 3.042 6.782 6.782-3.043 6.782-6.782 6.782-6.782-3.043-6.782-6.782zm2.01-1.764c1.984-4.599 8.664-4.066 9.922.749-2.534-2.974-6.993-3.294-9.922-.749z", 24);
    public static BACKSPACE: IconInfo = new IconInfo("M7 5h17v16h-17l-7-7.972 7-8.028zm7 6.586l-2.586-2.586-1.414 1.414 2.586 2.586-2.586 2.586 1.414 1.414 2.586-2.586 2.586 2.586 1.414-1.414-2.586-2.586 2.586-2.586-1.414-1.414-2.586 2.586z", 24);
    public static LOCATION: IconInfo = new IconInfo("M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z", 24);
    public static PIN1: IconInfo = new IconInfo("M18 6c0-3.314-2.687-6-6-6s-6 2.686-6 6c0 2.972 2.164 5.433 5 5.91v12.09l2-2v-10.09c2.836-.477 5-2.938 5-5.91zm-8.66-1.159c-.53-.467-.516-1.372.034-2.023.548-.65 1.422-.799 1.952-.333s.515 1.372-.033 2.021c-.549.652-1.423.801-1.953.335z", 24);
    public static PIN2: IconInfo = new IconInfo("M14.24 4.559c1.705 2.816-1.52 5.378-3.858 3.539 1.902.49 4.171-1.303 3.858-3.539zm-1.24 7.351v10.09l-2 2v-12.09c-2.836-.477-5-2.938-5-5.91 0-3.314 2.687-6 6-6s6 2.687 6 6c0 2.972-2.164 5.433-5 5.91zm3-5.91c0-2.206-1.794-4-4-4s-4 1.794-4 4 1.794 4 4 4 4-1.794 4-4z", 24);
    public static LINK: IconInfo = new IconInfo("M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z", 24);
    public static FILTER: IconInfo = new IconInfo("M1 0h22l-9 14.094v9.906l-4-2v-7.906z", 24);
    public static TENNIS: IconInfo = new IconInfo("M23.769 14.359c-1.097 5.495-5.952 9.641-11.768 9.641-6.623 0-12-5.377-12-12s5.377-12 12-12c2.68 0 5.656 1.047 7.598 2.774-2.604-.958-5.138-.87-6.553-.626-3.951.757-6.731 3.32-7.972 6.232-2.447 5.743 1.359 10.347 5.599 10.343 2.746 0 5.152-1.853 6.583-4.202 1.099-1.802 2.308-2.388 3.187-2.357 1.259.044 2.089.566 3.326 2.195zm.231-2.541c-.981-.94-2.085-1.612-3.535-1.662-1.903-.065-3.726 1.37-4.916 3.323-1.007 1.652-2.444 2.795-3.941 3.136-3.359.765-6.683-2.785-4.694-7.451 3.461-8.121 13.861-4.826 14.826-3.618.798.999 2.219 3.515 2.26 6.272z", 24);
    public static TO_WIDE: IconInfo = new IconInfo("m4 2.999c-.478 0-1 .379-1 1v16c0 .62.519 1 1 1h16c.621 0 1-.52 1-1v-16c0-.478-.379-1-1-1zm.5 16.5v-15h9.5v15zm3.658-11.321c-.137-.124-.299-.179-.458-.179-.358 0-.7.284-.7.705v6.59c0 .422.342.705.7.705.159 0 .321-.055.458-.178 1.089-.982 2.684-2.417 3.576-3.22.17-.153.266-.371.266-.601 0-.229-.096-.448-.265-.601-.893-.803-2.487-2.239-3.577-3.221z", 24);
    public static TO_COMPACT = new IconInfo("m4 3c-.478 0-1 .379-1 1v16c0 .62.519 1 1 1h16c.621 0 1-.52 1-1v-16c0-.478-.379-1-1-1zm.5 16.5v-15h9.5v15zm6.342-3.679c.137.124.299.179.458.179.358 0 .7-.284.7-.705v-6.59c0-.422-.342-.705-.7-.705-.159 0-.321.055-.458.178-1.089.982-2.684 2.417-3.576 3.22-.17.153-.266.371-.266.601 0 .229.096.448.265.601.893.803 2.487 2.239 3.577 3.221z", 24);
    public static COLLAPSE = new IconInfo("m11.998 21.995c5.517 0 9.997-4.48 9.997-9.997 0-5.518-4.48-9.998-9.997-9.998-5.518 0-9.998 4.48-9.998 9.998 0 5.517 4.48 9.997 9.998 9.997zm4.843-8.211c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291z", 24);
    public static EXPAND = new IconInfo("m11.998 2c5.517 0 9.997 4.48 9.997 9.998 0 5.517-4.48 9.997-9.997 9.997-5.518 0-9.998-4.48-9.998-9.997 0-5.518 4.48-9.998 9.998-9.998zm4.843 8.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291z", 24);
    public static UNCHECKED = new IconInfo("M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z", 24);
    public static CHECKED = new IconInfo("M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z", 24);
    public static MINUS = new IconInfo("M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z", 24);
    public static PLUS = new IconInfo("M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z", 24);
    public static RESIZE_UP_DOWN = new IconInfo("M11 6h-4l5-6 5 6h-4v3h-2v-3zm2 9h-2v3h-4l5 6 5-6h-4v-3zm6-4h-14v2h14v-2z", 24);
    public static SMALL_ARROW_DOWN = new IconInfo("m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z", 24);
    public static SMALL_ARROW_UP = new IconInfo("m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z", 24);


    constructor(props: XIconProps) {
        super(props);
    }

    render(): React.ReactNode {
        if (this.props.icon) {
            let vb = this.props.icon.viewbox;
            let size = this.props.iconSize || 24;
            let className: string = "";
            if (this.props.className) {
                className = `${this.props.className}`;
            } else if (this.props.onClick) {
                className = "pointer";
            }
            let style = this.props.style || {};
            style["display"] = "block";
            if (this.props.fill) {
                style["fill"] = this.props.fill;
            }
            if (size) {
                style["width"] = size;
                style["height"] = size;
            }

            return (
                <svg
                    id={this.props.id}
                    className={className}
                    viewBox={`0 0 ${vb} ${vb}`}
                    style={style}
                    onClick={this.props.onClick}
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}
                >
                    <title>{this.props.title}</title>
                    <path className={className} d={this.props.icon.path} fillRule="evenodd" style={style} />
                </svg>
            );
        }
    }

}
