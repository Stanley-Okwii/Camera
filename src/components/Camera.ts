import { CSSProperties, Component, createElement } from "react";
import * as DOM from "react-dom";
import * as WebCam from "react-webcam";
import * as classNames from "classnames";

import "../ui/Camera.css";

export interface CameraProps {
    width: number;
    height: number;
    widthUnit: string;
    heightUnit: string;
    captureButtonName: string;
    recaptureButtonName: string;
    usePictureButtonName: string;
    fileType: string;
    filter: string;
    onClickAction: ({ }, microflowName: string) => void;
    style?: object;
    captureButtonIcon: string;
    switchCameraIcon: string;
    usePictureButtonIcon: string;
    captionsToUse: string;
    saveImage: string;
}

export interface CameraState {
    screenshot: string;
    pictureTaken: boolean;
    cameraDevicePosition: number;
    pictureId: string;
}

export interface Webcam {
    getScreenshot: () => string;
    stream: {
        id: string;
    };
}

export type fileFormats = "jpeg" | "png" | "svg";

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
        this.createStyle = this.createStyle.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.changeCamera = this.changeCamera.bind(this);
        this.createIcons = this.createIcons.bind(this);
    }

    render() {
        if (this.state.pictureTaken && this.state.screenshot) {
            return createElement("div", { className: classNames("parent") },
                createElement("img", {
                    src: this.state.screenshot,
                    style: this.createStyle(),
                    alt: "Image could not be found!"
                }),
                createElement("span", {
                    className: classNames("picture-class"),
                    onClick: this.retakePicture
                },
                this.createIcons(this.props.captureButtonName, `glyphicon glyphicon-${this.props.captureButtonIcon}`)),
                createElement("span", {
                    className: classNames("buttonSwitch"),
                    onClick: () => this.props.onClickAction({
                        src: this.state.screenshot,
                        id: this.state.pictureId
                    }, this.props.saveImage)
                }, this.createIcons(this.props.usePictureButtonName,
                    `glyphicon glyphicon-${this.props.usePictureButtonIcon}`)
                )
            );
        }

        return createElement("div", { className: classNames("parent") },
            createElement(WebCam, {
                audio: false,
                ref: this.setCameraReference,
                screenshotFormat: `image/${this.props.fileType}`,
                style: this.createStyle()
            }),
            createElement("span", {
                className: classNames("picture-class"),
                onClick: this.takePicture
            }, this.createIcons(this.props.captureButtonName, `glyphicon glyphicon-${this.props.captureButtonIcon}`)),
            this.createSwitchCameraButton()

        );
    }

    componentWillMount() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices: {}[]) => {
                devices.filter((device: { kind: string, deviceId: string }) => {
                    if (device.kind === "videoinput") {
                        this.availableDevices.push(device.deviceId);
                    }
                });
            })
            .catch((error: Error) => {
                mx.ui.error(`${error.name}: ${error.message}`);
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
            pictureId: `${this.webcam.stream.id}.${this.props.fileType}`
        });
        // tslint:disable-next-line:no-console
        console.log(DOM.unmountComponentAtNode(WebCam));
    }

    private retakePicture() {
        this.setState({ pictureTaken: false });
    }

    private changeCamera() {
        const cameraDevicePosition = this.state.cameraDevicePosition < (this.availableDevices.length - 1)
            ? this.state.cameraDevicePosition + 1
            : 0;
        this.setState({ cameraDevicePosition });
    }

    private createSwitchCameraButton() {
        if (this.availableDevices.length > 1) {
            return createElement("span",
                {
                    className: classNames("buttonSwitch"),
                    onClick: this.changeCamera
                },
                this.createIcons(" Switch", `glyphicon glyphicon-${this.props.switchCameraIcon}`)
            );
        }
        return null;
    }

    private createIcons(buttonLabel: string, styleName: string) {
        return (this.props.captionsToUse === "icons")
            ? createElement("span", { className: classNames(styleName) })
            : createElement("button", { className: classNames("btn btn-inverse active") }, buttonLabel);
    }

    private createStyle(): object {
        const style: CSSProperties = {
            width: this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}px`,
            filter: this.props.filter
        };

        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.paddingBottom = `${this.props.height}px`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.height}%`;
        }
        return { ...style, ...this.props.style };
    }

    private getStream() {
        this.videoElement = DOM.findDOMNode(this).firstChild as HTMLVideoElement;
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

    componentWillUnMount() {
        // tslint:disable-next-line:no-console
        console.log("unmounted");
    }
}
