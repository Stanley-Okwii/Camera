import * as classNames from "classnames";
import { SFC, createElement } from "react";
import * as WebCam from "react-webcam";

export interface CameraProps {
    defaultValue?: string;
    className?: string;
    style?: object;
    value?: string;
    bootstrapStyle?: BootstrapStyle;
    clickable?: boolean;
    onClickAction?: () => void;
    getRef?: (node: HTMLElement) => void;
    label?: string;
    type?: string;
    constraints?:{};
}

export type BootstrapStyle = "default" | "info" | "inverse" | "btn btn-primary" | "danger" | "success" | "warning";

export const cameraButton: SFC<CameraProps> = (props) => createElement("input",
    {
        className: classNames("widget-badge", {
            [`label-${props.bootstrapStyle}`]: !!props.bootstrapStyle,
            "widget-badge-clickable": props.clickable
        }),
        onClick: props.onClickAction,
        style: props.style,
        type: props.type,
        value: props.value
    });
