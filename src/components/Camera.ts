import * as classNames from "classnames";
import { Component, createElement } from "react";
import * as WebCam from "react-webcam";

export interface CameraProps {
    Width: number;
    Height: number;
    captureButtonName?: string;
    recaptureButtonName?: string;
    usePictureButtonName?: string;
    startCameraButtonName?: string;
    fileType: string;
    filter?: any;
    imageWidth: number;
    imageHeight: number;
    onClickAction: any;
}

export interface CameraState {
    cameraActive: boolean;
    screenshot: string;
    pictureTaken: boolean;
}

export type filefomats = "jpeg" | "png" | "webp";

export class Camera extends Component<CameraProps, CameraState> {
    private webcam: any; // TODO: Add actual type for this

    constructor(props: CameraProps) {
        super(props);
        this.state = {
            cameraActive: false,
            screenshot: "",
            pictureTaken: false
        };
        this.setCameraReference = this.setCameraReference.bind(this);
        this.retakePicture = this.retakePicture.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.startCamera = this.startCamera.bind(this);
    }

    render() {
        if (this.state.cameraActive) {
            return createElement("div", {},
                createElement(WebCam, {
                    audio: false,
                    ref: this.setCameraReference,
                    screenshotFormat: this.props.fileType,
                    height: this.props.Height,
                    width: this.props.Width,
                    style: { filter: this.props.filter }
                }),
                createElement("div", {},
                    createElement("button", {
                        className: "btn mx-button btn-default",
                        onClick: this.takePicture
                    }, this.props.captureButtonName)
                )
            );
        }

        if (this.state.pictureTaken && this.state.screenshot) {
            return createElement("div", {},
                createElement("img", {
                    src: this.state.screenshot, style: { filter: this.props.filter },
                    width: this.props.imageWidth,
                    height: this.props.imageHeight,
                    alt: "image path could not be found!"
                }),
                createElement("div", {},
                    createElement("button", { className: "btn mx-button btn-default", onClick: this.retakePicture },
                        this.props.recaptureButtonName
                    ),
                    createElement("span", {}, " "),
                    createElement("button", {
                        className: "btn mx-button btn-default",
                        onClick: () => this.props.onClickAction(this.state.screenshot)
                    }, this.props.usePictureButtonName)
                )
            );
        }

        return createElement("button", { className: "btn mx-button btn-default", onClick: this.startCamera },
            this.props.startCameraButtonName
        );
    }

    private setCameraReference(webcam: any) {
        this.webcam = webcam;
    }

    private startCamera() {
        this.setState({ cameraActive: true });
    }

    private takePicture() {
        this.setState({ screenshot: this.webcam.getScreenshot(), pictureTaken: true, cameraActive: false });
    }

    private retakePicture() {
        this.setState({ cameraActive: true, pictureTaken: false });
    }

}
