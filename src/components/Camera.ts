import * as classNames from "classnames";
import { Component, createElement } from "react";
import * as WebCam from "react-webcam";

export interface CameraProps {
    className?: string;
    style?: object;
    audio: boolean;
    height: number;
    width: number;
    screenshotFormat: string;
    ref: string;
    resolutionWidth: number;
    resolutionHeight: number;
    onClick?: () => void;
}
export interface CamState {
    cameraActive: boolean;
    screenShot: string;
    pictureTaken: boolean;
}

export class Camera extends Component<CameraProps, CamState> {
    private webcam: any;
    constructor(props: CameraProps) {
        super(props);
        this.state = {
            cameraActive: false,
            screenShot: "",
            pictureTaken: false
        };
        this.setReference = this.setReference.bind(this);
        this.retakePicture = this.retakePicture.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.startCamera = this.startCamera.bind(this);
    }
    render() {
        if (this.state.cameraActive) {
            return createElement("div", {},
                createElement(WebCam, {
                    audio: false,
                    ref: this.setReference,
                    screenshotFormat: "image/jpeg",
                    height: this.props.resolutionHeight,
                    width: this.props.resolutionWidth
                }), createElement("button", {
                    className: "btn mx-button btn-default",
                    onClick: this.takePicture
                }, "Take photo"
                ));

        } else if (this.state.pictureTaken) {
            return createElement("div", { className: "" },
                createElement("img", {
                    src: this.state.screenShot,
                    style: {},
                    alt: "image path could not be found!"
                }),
                createElement("div", {
                    className: ""
                }, createElement("button", {
                    className: "btn mx-button btn-default",
                    onClick: this.retakePicture
                }, "Retake Photo"),
                    createElement("span", {
                        className: ""
                    }, " "),
                    createElement("button", {
                        className: "btn mx-button btn-default"
                    }, "Use Photo")
                )
            );
        } else {
            return createElement("button", {
                className: "btn mx-button btn-default",
                onClick: this.startCamera
            }, "Start Camera");
        }
    }

    private setReference(webcam: any) {
        this.webcam = webcam;
    }

    private startCamera() {
        this.setState({ cameraActive: !this.state.cameraActive });
    }

    private takePicture() {
        this.setState({ screenShot: this.webcam.getScreenshot() });
        this.setState({ pictureTaken: !this.state.pictureTaken });
        this.setState({ cameraActive: !this.state.cameraActive });
    }

    private retakePicture() {
        this.setState({ cameraActive: !this.state.cameraActive });
        this.setState({ pictureTaken: !this.state.pictureTaken });
    }
}
