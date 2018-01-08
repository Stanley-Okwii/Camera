import { Component, createElement } from "react";

import { Camera, CameraState } from "./components/Camera";
import { ContainerProps, ModelerProps } from "./components/CameraContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<ContainerProps, CameraState> {
    constructor(props: ContainerProps) {
        super(props);

    }

    render() {
        return createElement(Camera as any, {
            ...this.props as ModelerProps,
            filter: () => { return; },
            onClickAction: () => { return; }
        });
    }
}

export function getPreviewCss() {
    return require("./ui/Camera.scss");
}
