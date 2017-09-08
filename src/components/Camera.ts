import * as classNames from "classnames";
import { SFC, createElement } from "react";

export interface CameraProps {
    defaultValue?: string;
    className?: string;
    style?: object;
    value?: string;
    bootstrapStyle?: BootstrapStyle;
    clickable?: boolean;
    onClickAction?: () => void;
    getRef?: (node: HTMLElement) => void;
    label: string;
    type?: string
}

export type BootstrapStyle = "default" | "info" | "inverse" | "primary" | "danger" | "success" | "warning";

export const cameraButton: SFC<CameraProps> = (props) => createElement("button",
    {
        className: classNames("widget-badge", {
            [`label-${props.bootstrapStyle}`]: !!props.bootstrapStyle,
            "widget-badge-clickable": props.clickable
        }),
        onClick: props.onClickAction,
        style: props.style,
        label: props.label,
        value: props.value
    });

