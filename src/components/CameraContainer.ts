import { Component, createElement } from "react";
import { Alert } from "./Alert";
import * as WebCam from "react-webcam";
import * as ReactDOM from  "react-dom";
import { cameraButton, BootstrapStyle } from "./Camera";
//var ReactDOM = require('react-dom');
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
    buttonState: any;

}

export default class CameraContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandles: number[];
    private webcam: any;
    constructor(props: ContainerProps) {
        super(props);

        this.state = {
            screenshot: null,
            active: false,
            cameraState: null,
            buttonState: null
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
        let cameraNode;
        let buttonNode;
        let buttonNode2;
        let retakePictureButton;
        let usePictureButton;
        let cameraNode2;
        cameraElement = createElement(WebCam, {
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
        buttonNode2 = createElement("div", {
            className: ""
        }, retakePictureButton, usePictureButton
        );
        retakePictureButton = createElement(cameraButton, {
            bootstrapStyle: "btn btn-primary",
            onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: "Retake"
        });
         usePictureButton = createElement(cameraButton, {
            bootstrapStyle: "btn btn-primary",
            //onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: "Use Picture"
        });

        picturetaken = createElement("img", {
            src: this.state.screenshot,
            style: CameraContainer.parseStyle(this.props.style),
            alt: "image not found"
        });
        buttonNode = createElement("div", {
            className: ""
        }, captureButton);
        buttonNode2 = createElement("div", { className: "" }, retakePictureButton, usePictureButton);
        cameraNode = createElement("div", { className: "" }, cameraElement, buttonNode);
        cameraNode2 = createElement("div", { className: "" }, picturetaken, buttonNode2);

        if (this.state.active) {
            this.setState({ cameraState: cameraNode });
            if (this.state.screenshot) {
                this.setState({ cameraState: cameraNode2 });
                //this.setState({buttonState: null});
            }
        } else {
           // this.setState({ buttonState: activateButtonElement });
           activateButtonElement = createElement(cameraButton, {
            bootstrapStyle: "btn btn-primary",
            onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: "Activate Camera"
        });
        }
        return createElement("div", { className: "" }, activateButtonElement, this.state.cameraState);
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
        //this.setState({ active:false });
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
