import { Component, createElement } from "react";
import { Alert } from "./Alert";
import * as WebCam from "react-webcam";
import { CamState, Camera } from "./Camera";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    resolutionWidth: number;
    resolutionHeight: number;
}

interface ContainerState {
    screenshot: any;
}

export default class CameraContainer extends Component<ContainerProps, ContainerState> {
    constructor(props: ContainerProps) {
        super(props);
        this.state = {
            screenshot: null
        };
    }

    render() {
        return createElement(Camera);
    }
}
