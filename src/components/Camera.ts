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
    screenshot: string;
    pictureTaken: boolean;
    cameraDevicePosition: number;
}

export interface Webcam {
    getScreenshot: () => string;
    stream: {
        active: boolean;
        id: string;
    };
    pictureTaken: boolean;
}

export type filefomats = "jpeg" | "png" | "webp";

export class Camera extends Component<CameraProps, CameraState> {
    private webcam: any; // TODO: Add actual type for this
    private videoElement: any;
    private stream: any;
    private availableDevices: string[] = [];
    constructor(props: CameraProps) {
        super(props);
        this.state = {
            screenshot: "",
            pictureTaken: false,
            cameraDevicePosition: 0
        };
        this.setCameraReference = this.setCameraReference.bind(this);
        this.swapCameraId = this.swapCameraId.bind(this);
        this.retakePicture = this.retakePicture.bind(this);
        this.getStream = this.getStream.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.changeCamera = this.changeCamera.bind(this);
    }

    render() {
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
                        // tslint:disable-next-line:max-line-length
                        onClick: () => this.props.onClickAction({ src: this.state.screenshot, id: this.webcam.id })
                    }, this.props.usePictureButtonName)
                )
            );
        }

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
                }, this.props.captureButtonName),
                createElement("button", {
                    className: "btn mx-button btn-default",
                    onClick: this.changeCamera
                }, "Switch")
            )
        );
    }

    componentDidMount() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: any) => {
                devices.forEach((device: any) => {
                    if (device.kind === "videoinput") {
                        this.availableDevices.push(device.deviceId);
                    }
                });
                if (this.availableDevices.length >= 1) {
                    this.getStream();
                }
            })
            .catch((error: Error) => {
            // tslint:disable-next-line:no-console
            console.log(error.name + ": " + error.message);
        });
    }

    componentDidUpdate() {
        this.getStream();
    }

    private setCameraReference(webcam: any) {
        this.webcam = webcam;
    }

    private takePicture() {
        this.setState({ screenshot: this.webcam.getScreenshot(), pictureTaken: true });
    }

    private retakePicture() {
        this.setState({ pictureTaken: false });
    }

    private changeCamera() {
        if ((this.state.cameraDevicePosition + 1) <= (this.availableDevices.length - 1)) {
            this.setState({
                cameraDevicePosition: this.state.cameraDevicePosition + 1
            });
        } else {
            this.setState({
                cameraDevicePosition: 0
            });
        }
    }
    private swapCameraId(array: string[]) {
        for (let counter = 0; counter <= array.length; counter++) {
            let cameraId: string;
            cameraId = array[counter];
            return cameraId;
        }
        return "";
    }

    private getStream() {
        this.videoElement = document.querySelector("video");
        if (this.stream) {
            this.stream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }

        const constraints = {
            audio: false,
            video: { deviceId: this.availableDevices[this.state.cameraDevicePosition] }
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream: any) => {
            this.stream = stream;
            this.videoElement.srcObject = stream;
        });
    }
}
