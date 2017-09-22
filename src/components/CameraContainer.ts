import { Component, createElement } from "react";
import * as WebCam from "react-webcam";
import { CanvasToBlob } from "canvas-to-blob";
import { Camera, CameraState, filefomats } from "./Camera";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface ContainerProps extends WrapperProps {
    resolutionWidth: number;
    resolutionHeight: number;
    capturingWindowWidth: number;
    capturingWindowHeight: number;
    captureButtonName: string;
    recaptureButtonName: string;
    usePictureButtonName: string;
    fileType: filefomats;
    startCameraButtonName: string;
    imageFilter: string;
    photo: string;
    savePhotoMicroflow: string;
}

export default class CameraContainer extends Component<ContainerProps> {
    private Node: any;
    constructor(props: ContainerProps) {
        super(props);
        this.formatStlye = this.formatStlye.bind(this);
        this.savePhoto = this.savePhoto.bind(this);
        this.dataURItoBlob = this.dataURItoBlob.bind(this);
    }

    render() {
        return createElement(Camera, {
            Width: this.props.capturingWindowWidth,
            Height: this.props.capturingWindowHeight,
            fileType: "image/".concat(this.props.fileType),
            usePictureButtonName: this.props.usePictureButtonName,
            captureButtonName: this.props.captureButtonName,
            startCameraButtonName: this.props.startCameraButtonName,
            recaptureButtonName: this.props.recaptureButtonName,
            filter: this.formatStlye(),
            imageHeight: this.props.resolutionHeight,
            imageWidth: this.props.resolutionWidth,
            onClickAction: this.savePhoto
        });
    }

    private formatStlye(): string {
        if (this.props.imageFilter === "grayscale") {
            return "grayscale(1)";
        }
        if (this.props.imageFilter === "huerotate") {
            return "hue-rotate(90deg)";
        }
        if (this.props.imageFilter === "sepia") {
            return "sepia(1)";
        }
        return "none";
    }

    private savePhoto(i: string) {
        const a = this.dataURItoBlob(i);
        mx.data.create({
            callback: (object) => {
                mx.data.saveDocument(object.getGuid(),
                // tslint:disable-next-line:no-empty
                "camera.jpeg", {}, a, () => { }, (error: Error) => { });
                // tslint:disable-next-line:no-console
                console.log("saved");

            },
            entity: this.props.photo,
            error: () => {
                mx.ui.error("Could not commit object:");
            }
        });
        // alert(a);
    }

    private dataURItoBlob(dataURI: string, callback?: () => void) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataURI.split(",")[1]);
        // separate out the mime component
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        const bb = new Blob([ ab ]);
        return bb;
    }
}
