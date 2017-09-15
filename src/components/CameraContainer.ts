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
    captureButtonClassName: string;
    recaptureButtonClassName: string;
    usePictureButtonClassName: string;
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
        this.retakePicture = this.retakePicture.bind(this);
    }
    componentDidMount(){
       let activateButtonElement = createElement(cameraButton, {
            bootstrapStyle: "wx-mxwx-button-extra",
            onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: "Start Camera"
        });
        this.setState({buttonState: activateButtonElement});
    }
    render() {

        


        // cameraNode = createElement("div", { className: "" }, cameraElement, buttonNode);
        if (this.state.active) {
            this.state.cameraState;
            if (this.state.screenshot) {
                this.state.cameraState;
            }
        } else {
            this.state.buttonState;

        }
        return createElement("div", { className: "" }, this.state.buttonState, this.state.cameraState);
    }

    private setRef(webcam: any) {
        this.webcam = webcam;
    }

    private takePicture() {
        let picturetaken;
        let buttonNode2;
        let retakePictureButton;
        let usePictureButton;
        let cameraNode2;

        buttonNode2 = createElement("div", {
            className: ""
        }, retakePictureButton, usePictureButton);

        retakePictureButton = createElement(cameraButton, {
            bootstrapStyle: "btn btn-primary",
            onClickAction: this.retakePicture,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: this.props.recaptureButtonClassName
        });

        usePictureButton = createElement(cameraButton, {
            bootstrapStyle: "btn btn-primary",
            //onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: this.props.usePictureButtonClassName
        });

        picturetaken = createElement("img", {
            src: this.state.screenshot,
            style: CameraContainer.parseStyle(this.props.style),
            alt: "image not found"
        });

        buttonNode2 = createElement("div", { className: "" }, retakePictureButton, usePictureButton);
        const screenshot1 = this.webcam.getScreenshot();
        this.setState({ screenshot: screenshot1 });
        cameraNode2 = createElement("div", { className: "" }, picturetaken, buttonNode2);
        this.setState({ cameraState: cameraNode2 });

        
    }

    private startCamera() {
        let cameraNode;
        let cameraElement;
        let buttonNode;
        let captureButton;

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
            value: this.props.captureButtonClassName
        });
        buttonNode = createElement("div", {
            className: ""
        }, captureButton);

        cameraNode = createElement("div", { className: "" }, cameraElement, buttonNode);
        this.setState({ active: !this.state.active });
        this.setState({ cameraState: cameraNode });
        this.setState({buttonState: null});
    }

    private retakePicture() {
        this.setState({ active: !this.state.active });
        //this.setState({ cameraState: cameraNode });
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
