import { Component, createElement } from "react";
import { Alert } from "./Alert";
import * as WebCam from "react-webcam";
import { cameraButton, BootstrapStyle } from "./Camera";
import CanvasToBlob from "canvas-to-blob";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    bootstrapStyle: BootstrapStyle;
    valueAttribute: string;

}

interface ContainerState {
    //value?: string;
    screenshot: any;
}

export default class CameraContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandles: number[];
    constructor(props: ContainerProps) {
        super(props);

        this.state = {
            screenshot: null
        };

        // this.handleStartClick = this.handleStartClick.bind(this);  
        this.takePicture = this.takePicture.bind(this);
        //this.clearPhoto = this.clearPhoto.bind(this);
    }

    render() {
        const cameraElement = createElement(WebCam, {
            audio: false,
            height: 350,
            width: 350,
            style: "display: none"
        });
        const activateButtonElement = createElement(cameraButton, {
            //bootstrapStyle: "btn btn-primary",
            className: "btn btn-primary",
            // label: this.props.label,
            onClickAction: this.startCamera,
            style: CameraContainer.parseStyle(this.props.style),
            type: "button",
            value: "Activate Camera"
        });
        return createElement("span",{className:"container-fluid"},activateButtonElement,cameraElement);
    }

    componentWillReceiveProps(nextProps: ContainerProps) {

    }

    componentWillUnmount() {

    }

    private takePicture() {

    }

    private startCamera() {
        //.getElementsByTagName("WebCam")
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
