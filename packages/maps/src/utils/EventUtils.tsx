import React from 'react';
import {TimeUtils} from "./TimeUtils";


export class EventUtils {

    static readonly keyShift = 16;
    static readonly keyCtrl = 17;
    static readonly keyEscape = 27;
    static readonly keyLeftArrow = 37;
    static readonly keyRightArrow = 39;
    static readonly keyHome = 36;
    static readonly keyEnd = 35;
    static readonly keySpace = 32;
    static readonly keyUpArrow = 38;
    static readonly keyDownArrow = 40;
    static readonly keyPageUp = 33;
    static readonly keyPageDown = 34;

    private static dragInProgress: boolean = false;
    private static lastDragEndTime: number = -1;

    static isDragInProgress(): boolean {
        return EventUtils.dragInProgress;
    }

    static dragJustFinished(): boolean {
        return TimeUtils.now() - EventUtils.lastDragEndTime < 500;
    }

    static consumeEvent(event: any): void {
        if (event) {
            event.consumed = true;
        }
    }

    static isEventConsumed(event: any): boolean {
        return event && event.consumed;
    }

    static handleMouseDrag(mouseDownEvent: React.MouseEvent|MouseEvent, mouseDownHandler, mouseMoveHandler, mouseUpHandler = null) {
        let e: MouseEvent = mouseDownEvent instanceof MouseEvent ? mouseDownEvent : mouseDownEvent.nativeEvent;

        EventUtils.consumeEvent(e);

        // call handler for initial mouse down event which initiated dragging
        if (mouseDownHandler) {
            mouseDownHandler(e);
            EventUtils.dragInProgress = true;
        }

        // add mouse move and mouse up handlers on document level while drag is in progress
        if (mouseMoveHandler) {
            document.addEventListener("mousemove", mouseMoveHandler);
        }
        document.addEventListener("mouseup", e => {
            if (mouseUpHandler) {
                mouseUpHandler(e);
            }
            if (mouseMoveHandler) {
                document.removeEventListener("mousemove", mouseMoveHandler);
            }
            EventUtils.dragInProgress = false;
            EventUtils.lastDragEndTime = TimeUtils.now();
        }, {once: true});
    }

    static getMouseX(e): number {
        let x = e.pageX;
        if (e?.currentTarget?.getBoundingClientRect) {
            x -= e.currentTarget?.getBoundingClientRect()?.left;
        }
        return x;
    }

    static getMouseY(e): number {
        let y = e.pageY;
        if (e?.currentTarget?.getBoundingClientRect) {
            y -= e.currentTarget?.getBoundingClientRect()?.top;
        }
        return y;
    }

    static addGlobalListener(event: string, listener): void {
        document.addEventListener(event, listener, false);
    }

    static removeGlobalListener(event: string, listener): void {
        document.removeEventListener(event, listener);
    }

    static addGlobalMouseDown(listener: (e: any) => void): void {
        EventUtils.addGlobalListener("mousedown", listener);
    }

    static removeGlobalMouseDown(listener: (e: any) => void): void {
        EventUtils.removeGlobalListener("mousedown", listener);
    }

    static addGlobalKeyDown(listener): void {
        EventUtils.addGlobalListener("keydown", listener);
    }

    static removeGlobalKeyDown(listener): void {
        EventUtils.removeGlobalListener("keydown", listener);
    }

    static addGlobalKeyUp(listener): void {
        EventUtils.addGlobalListener("keyup", listener);
    }

    static removeGlobalKeyUp(listener): void {
        EventUtils.removeGlobalListener("keyup", listener);
    }

}