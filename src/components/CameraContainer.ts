import { Component, createElement } from "react";
import { Alert } from "./Alert";
import { cameraButton ,BootstrapStyle } from "./Camera";
import CanvasToBlob from "canvas-to-blob";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    readOnly: boolean;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    bootstrapStyle: BootstrapStyle;
    valueAttribute: string;
}

interface ContainerState {
    initialRate: string;
    value?: string;
}

export default class CameraContainer extends Component<ContainerProps, ContainerState> {
    private subscriptionHandles: number[];

    constructor(props: ContainerProps) {
        super(props);

        this.subscriptionHandles = [];
        // initialize state (if there's state)
        this.state = {
            // initialRate: this.props.mxObject
            initialRate: "Stanley",
            value: "badiguy"
        };
        this.subscribe(this.props.mxObject);
    }

    render() {
        return createElement(cameraButton, {
            bootstrapStyle: "danger",
            className: this.props.class,
            style: CameraContainer.parseStyle(this.props.style),
            label: "stanley",
           // type: "button",
            value: "Stanley"
        });
    }

    componentWillReceiveProps(nextProps: ContainerProps) {
        this.subscribe(nextProps.mxObject);
        this.updateRating(nextProps.mxObject);
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    private subscribe(contextObject?: mendix.lib.MxObject) {
        this.unSubscribe();

        if (contextObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.updateRating(contextObject),
                guid: contextObject.getGuid()
            }));
        }
    }
     private startCamera() {

     }
  
     private unSubscribe() {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];
    }

    private updateRating(mxObject: mendix.lib.MxObject) {
        // to check on later
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
