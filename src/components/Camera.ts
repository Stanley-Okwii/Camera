import * as classNames from "classnames";
import { CSSProperties, Component, createElement } from "react";
import * as WebCam from "react-webcam";

export interface CameraProps {
    Width: number;
    Height: number;
    widthUnit: string;
    heightUnit: string;
    captureButtonName?: string;
    recaptureButtonName?: string;
    usePictureButtonName?: string;
    fileType: string;
    filter?: string;
    onClickAction: ({ }) => void;
    style?: object;
    captureButtonIcon: ImageData;
    switchCameraIcon: ImageData;
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

export type filefomats = "jpeg" | "png" | "svg";

export class Camera extends Component<CameraProps, CameraState> {
    private webcam: Webcam;
    private resolutionWidth: string;
    private resolutionHeight: string;
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
        this.createStyle = this.createStyle.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.changeCamera = this.changeCamera.bind(this);
    }

    render() {
        if (this.state.pictureTaken && this.state.screenshot) {
            return createElement("div", {},
                createElement("img", {
                    src: this.state.screenshot,
                    style: this.createStyle(),
                    alt: "Image path could not be found!"
                }),
                createElement("div", {},
                    createElement("span", { className: "glyphicon glyphicon-repeat", onClick: this.retakePicture }),
                    createElement("span", {}, "  "),
                    createElement("span", {
                        className: "glyphicon glyphicon-download-alt",
                        onClick: () => this.props.onClickAction({
                            src: this.state.screenshot,
                            id: this.state.pictureId
                        })
                    })
                )
            );
        }

        return createElement("div", {},
            createElement(WebCam, {
                audio: false,
                ref: this.setCameraReference,
                screenshotFormat: "image/".concat(this.props.fileType),
                style: this.createStyle()
            }),
            createElement("div", {},
                createElement("button", {
                    className: "btn btn-info active",
                    onClick: this.takePicture
                }, createElement("img", { src: this.props.captureButtonIcon, style: {} }),
                   this.props.captureButtonName),
                createElement("span", {}, "  "),
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
                className: "btn btn-info active",
                onClick: this.changeCamera
            }, createElement("img", { src: this.props.switchCameraIcon, style: {} }), "Switch");
        }
        return null;
    }

    private createStyle(): object {
        const style: CSSProperties = {
            width: this.props.widthUnit === "percentage" ? `${this.props.Width}%` : `${this.props.Width}px`,
            filter: this.props.filter
        };

        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.Height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.paddingBottom = `${this.props.Height}px`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.Height}%`;
        }

        return { ...style, ... this.props.style };
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
