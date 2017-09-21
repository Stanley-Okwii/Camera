import { Component, createElement } from "react";
import * as WebCam from "react-webcam";
import { Camera, filefomats } from "./Camera";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    resolutionWidth: number;
    resolutionHeight: number;
    capturingWindowWidth: number;
    capturingWindowHeight: number;
    captureButtonName: string;
    recaptureButtonName: string;
    usePictureButtonName: string;
    fileType: filefomats;
    startCameraButtonName: string;
    imageFilter: string;
}

export default class CameraContainer extends Component<ContainerProps> {
    constructor(props: ContainerProps) {
        super(props);
        this.formatStlye = this.formatStlye.bind(this);
    }

    render() {
        return createElement(Camera, {
            Width: this.props.capturingWindowWidth,
            Height: this.props.capturingWindowHeight,
            fileType: "image/".concat(this.props.fileType),
            usePictureButtonName: this.props.usePictureButtonName,
            captureButtonName: this.props.captureButtonName,
            startCameraButtonName: this.props.startCameraButtonName,
            recaptureButtonName: this.props.recaptureButtonName,
            filter: this.formatStlye(),
            imageHeight: this.props.resolutionHeight,
            imageWidth: this.props.resolutionWidth
        });
    }

    private formatStlye(): string {
        if (this.props.imageFilter === "grayscale") {
            return "grayscale(1)";
        }
        if (this.props.imageFilter === "huerotate") {
            return "hue-rotate(90deg)";
        }
        if (this.props.imageFilter === "sepia") {
            return "sepia(1)";
        }
        return "none";
    }
}
