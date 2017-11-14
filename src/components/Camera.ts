import { CSSProperties, Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as WebCam from "react-webcam";
import * as classNames from "classnames";
// import { findDOMNode, unmountComponentAtNode } from "react-dom";

import { Alert, AlertProps } from "./Alert";

import "../ui/Camera.css";

export interface CameraProps {
    captureButtonName: string;
    captureButtonIcon: string;
    captionsToUse: string;
    fileType: string;
    filter: string;
    height: number;
    heightUnit: string;
    onClickAction: (image: { src: string, id: string }, microflowName: string) => void;
    recaptureButtonName: string;
    style?: object;
    switchCameraIcon: string;
    saveImage: string;
    usePictureButtonIcon: string;
    usePictureButtonName: string;
    width: number;
    widthUnit: string;
}

export interface CameraState {
    browserSupport: boolean;
    cameraDevicePosition: number;
    screenshot: string;
    noRepeat: boolean;
    pictureTaken: boolean;
    pictureId: string;
}

export interface Webcam {
    getScreenshot: () => string;

    stream: {
         id: string;
    };
}

export type FileFormats = "jpeg" | "png" | "svg";

export class Camera extends Component<CameraProps, CameraState> {
    private webcam: Webcam;
    private videoElement: HTMLVideoElement;
    private outputStream: MediaStream;
    private availableDevices: string[];

    constructor(props: CameraProps) {
        super(props);

        this.state = {
            browserSupport: false,
            cameraDevicePosition: 0,
            noRepeat: false,
            pictureId: "",
            pictureTaken: false,
            screenshot: ""
        };

        this.availableDevices = [];
        this.setCameraReference = this.setCameraReference.bind(this);
        this.retakePicture = this.retakePicture.bind(this);
        this.getStream = this.getStream.bind(this);
        this.setStyle = this.setStyle.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.changeCamera = this.changeCamera.bind(this);
    }

    render() {
        if (this.state.browserSupport) {
            return this.renderAlert("This browser does not support the camera widget. Google-chrome is recommended.");
        }
        if (this.state.pictureTaken && this.state.screenshot) {
            return this.renderPhoto();
        }

        return this.renderWebCam();
    }

    componentWillMount() {
        if (!navigator.mediaDevices) {
            this.setState({ browserSupport: true });
        } else {
            navigator.mediaDevices.enumerateDevices()
            .then((devices: Array<{ kind: string, deviceId: string }>) => {
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
        this.setState({ noRepeat: true });
        // tslint:disable-next-line:no-console
        console.log("mounted from ts");
    }

    componentDidUpdate() {
        if (this.state.browserSupport) {
            return null;
        } else {
            this.getStream();
        }
    }

    componentWillUnmount() {
        // tslint:disable-next-line:no-console
        console.log("Unmounted from ts.");
        // this.outputStream.getTracks().forEach((mediaTrack: MediaStreamTrack) => {
        //     mediaTrack.stop();
        // });
    }

    private setCameraReference(webcam: Webcam) {
        this.webcam = webcam;
    }

    private takePicture() {
        this.setState({
            noRepeat: true,
            pictureId: `${this.webcam.stream.id}.${this.props.fileType}`,
            pictureTaken: true,
            screenshot: this.webcam.getScreenshot()
        });
    }

    private retakePicture() {
        this.setState({ pictureTaken: false });
    }

    private changeCamera() {
        const cameraDevicePosition: number = this.state.cameraDevicePosition < (this.availableDevices.length - 1)
            ? this.state.cameraDevicePosition + 1
            : 0;
        this.setState({ cameraDevicePosition , noRepeat: false });
    }

    private createSwitchCameraButton(): ReactElement<{}> {
        if (this.availableDevices.length > 1) {
            return createElement("span",
                {
                    className: classNames("switch-button"),
                    onClick: this.changeCamera
                },
                this.createIcons("Switch", this.props.switchCameraIcon)
            );
        }

        return createElement("div", {});
    }

    private renderWebCam(): ReactElement<{}> {
            return createElement("div", { className: classNames("parent") },
                createElement(WebCam, {
                    audio: false,
                    ref: this.setCameraReference,
                    screenshotFormat: `image/${this.props.fileType}`,
                    style: this.setStyle()
                }),
                createElement("span", {
                    className: classNames("picture-class"),
                    onClick: this.takePicture
                },
                    this.createIcons(this.props.captureButtonName, this.props.captureButtonIcon)
                ),
                this.createSwitchCameraButton()
            );
    }

    private renderPhoto(): ReactElement<{}> {
            return createElement("div", { className: classNames("parent") },
                createElement("img", {
                    alt: "Image could not be found!",
                    src: this.state.screenshot,
                    style: this.setStyle()
                }),
                createElement("span", {
                    className: classNames("picture-class"),
                    onClick: this.retakePicture
                },
                    this.createIcons(this.props.captureButtonName, this.props.captureButtonIcon)
                ),
                createElement("span", {
                    className: classNames("switch-button"),
                    onClick: () => this.props.onClickAction({
                        id: this.state.pictureId,
                        src: this.state.screenshot
                    }, this.props.saveImage)
                },
                    this.createIcons(this.props.usePictureButtonName, this.props.usePictureButtonIcon)
                )
            );
    }

    private createIcons(buttonLabel: string, styleName: string): ReactElement<{}> {
        return (this.props.captionsToUse === "icons")
            ? createElement("span", { className: classNames(`glyphicon glyphicon-${styleName}`) })
            : createElement("button", { className: classNames("btn btn-inverse active") }, buttonLabel);
    }

    private setStyle(): object {
        const style: CSSProperties = {
            filter: this.props.filter,
            width: this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}px`
        };

        if (this.props.heightUnit === "percentageOfWidth") {
            style.paddingBottom = `${this.props.height}%`;
        } else if (this.props.heightUnit === "pixels") {
            style.height = `${this.props.height}px`;
        } else if (this.props.heightUnit === "percentageOfParent") {
            style.height = `${this.props.height}%`;
        }

        return { ...style, ...this.props.style };
    }

    private getStream() {
        this.videoElement = findDOMNode(this).firstChild as HTMLVideoElement;
        const constraints: MediaStreamConstraints = {
            audio: false,
            video: { deviceId: this.availableDevices[this.state.cameraDevicePosition] }
        };

        if (this.outputStream && this.state.pictureTaken) {
             this.outputStream.getTracks().forEach((mediaTrack: MediaStreamTrack) => {
             mediaTrack.stop();
             });
        }

        if (this.state.noRepeat) {
            //
        } else {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream: MediaStream) => {
                    this.outputStream = stream;
                    if (this.videoElement) {
                        this.videoElement.srcObject = stream;
                    }
                })
                .catch((error: Error) => {
                    mx.ui.error(`${error.name}: ${error.message}`);
                });
        }
    }

    private renderAlert(message: string): ReactElement<AlertProps> {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "",
            message
        });
    }
}
