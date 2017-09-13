import { Component, createElement } from "react";
import { Alert } from "./Alert";
import * as WebCam from "react-webcam";
import { cameraButton, BootstrapStyle } from "./Camera";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    bootstrapStyle: BootstrapStyle;
    valueAttribute: string;
    resolutionWidth: number;
    resolutionHeight: number;
}

interface ContainerState {
    cameraState: any;
    screenshot: any;
    active: boolean;

}

export default class CameraContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandles: number[];
    private webcam = WebCam;
    constructor(props: ContainerProps) {
        super(props);

        this.state = {
            screenshot: null,
            active: false,
            cameraState: null,
        };

        this.setRef = this.setRef.bind(this);
        this.startCamera = this.startCamera.bind(this);
        this.takePicture = this.takePicture.bind(this);
    }

    render() {
        let cameraElement;
        let activateButtonElement;
        let captureButton;
        let picturetaken;
        if (this.state.active) {
            cameraElement = createElement(this.webcam, {
                audio: false,
                ref: this.setRef,
                screenshotFormat: "image/jpeg",
                height: this.props.resolutionHeight,
                width: this.props.resolutionWidth
            });
            captureButton = createElement(cameraButton, {
                bootstrapStyle: "btn btn-primary",
                onClickAction: this.takePicture,
                style: CameraContainer.parseStyle(this.props.style),
                type: "button",
                value: "Take picture"
            });
            if (this.state.screenshot) {
                picturetaken = createElement("img", {
                    src: this.state.screenshot,
                    style: CameraContainer.parseStyle(this.props.style),
                    alt: "image not found"
                });
            }
        } else {
            activateButtonElement = createElement(cameraButton, {
                bootstrapStyle: "btn btn-primary",
                onClickAction: this.startCamera,
                style: CameraContainer.parseStyle(this.props.style),
                type: "button",
                value: "Activate Camera"
            });
        }

        return createElement("div", { className: "" }, activateButtonElement, cameraElement, picturetaken, captureButton);
    }
    componentWillReceiveProps(nextProps: ContainerProps) {

    }

    componentWillUnmount() {

    }
    private setRef(webcam: any) {
        this.webcam = webcam; 
    }

    private takePicture() {
        const screenshot1 = this.webcam.getScreenshot();
        this.setState({ screenshot: screenshot1 });
    }

    private startCamera() {
        this.setState({ active: !this.state.active });
    }

    public static validateProps(props: ContainerProps) {
        // to check on later
    }

    public static parseStyle(style = ""): { [key: string]: string } {
        try {
            return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            console.error("Failed to parse style", style, error);
        }

        return {};
    }
}
