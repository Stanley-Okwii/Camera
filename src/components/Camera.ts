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
    filter?: string;
    imageWidth: number;
    imageHeight: number;
    onClickAction: ({ }) => void;
}

export interface CameraState {
    screenshot: string;
    pictureTaken: boolean;
    cameraDevicePosition: number;
    pictureId?: string;
}

export interface Webcam {
    getScreenshot: () => string;
    stream: {
        id: string;
    };
}

export interface VideoElement {
    srcObject: MediaStream;
}

export type filefomats = "jpeg" | "png" | "webp";

export class Camera extends Component<CameraProps, CameraState> {
    private webcam: Webcam;
    private videoElement: HTMLVideoElement | null;
    private outputStream: MediaStream;
    private availableDevices: string[] = [];
    constructor(props: CameraProps) {
        super(props);
        this.state = {
            screenshot: "",
            pictureTaken: false,
            cameraDevicePosition: 0,
            pictureId: ""
        };
        this.setCameraReference = this.setCameraReference.bind(this);
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
                        onClick: () => this.props.onClickAction({ src: this.state.screenshot, id: this.state.pictureId })
                    }, this.props.usePictureButtonName)
                )
            );
        }

        return createElement("div", {},
            createElement(WebCam, {
                audio: false,
                ref: this.setCameraReference,
                screenshotFormat: "image/".concat(this.props.fileType),
                height: this.props.Height,
                width: this.props.Width,
                style: { filter: this.props.filter }
            }),
            createElement("div", {},
                createElement("button", {
                    className: "btn mx-button btn-default",
                    onClick: this.takePicture
                }, this.props.captureButtonName),
                createElement("span", {}, " "),
                this.createSwitchCameraButton()
            )
        );
    }

    componentWillMount() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: {}[]) => {
                devices.forEach((device: { kind: string, deviceId: string }) => {
                    if (device.kind === "videoinput") {
                        this.availableDevices.push(device.deviceId);
                    }
                });
                if (this.availableDevices.length >= 1) {
                    this.setState({ cameraDevicePosition: this.availableDevices.length - 1 });
                    this.getStream();
                }
            })
            .catch((error: Error) => {
                mx.ui.error(error.name + ": " + error.message);
            });
    }

    componentDidUpdate() {
        this.getStream();
    }

    private setCameraReference(webcam: Webcam) {
        this.webcam = webcam;
    }

    private takePicture() {
        this.setState({
            screenshot: this.webcam.getScreenshot(),
            pictureTaken: true,
            pictureId: this.webcam.stream.id.concat("." + this.props.fileType)
        });
    }

    private retakePicture() {
        this.setState({ pictureTaken: false });
    }

    private changeCamera() {
        if ((this.state.cameraDevicePosition) < (this.availableDevices.length - 1)) {
            this.setState({
                cameraDevicePosition: this.state.cameraDevicePosition + 1
            });
        } else {
            this.setState({
                cameraDevicePosition: 0
            });

        }
    }

    private createSwitchCameraButton() {
        if (this.availableDevices.length > 1) {
            return createElement("button", {
                className: "btn mx-button btn-default",
                onClick: this.changeCamera
            }, "Switch");
        }
        return null;
    }

    private getStream() {
        this.videoElement = document.querySelector("video");
        const constraints = {
            audio: false,
            video: { deviceId: this.availableDevices[this.state.cameraDevicePosition] }
        };

        if (this.outputStream) {
            this.outputStream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop();
            });
        }

        navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {
            this.outputStream = stream;
            if (this.videoElement) {
                this.videoElement.srcObject = stream;
            }
        });
    }
}
