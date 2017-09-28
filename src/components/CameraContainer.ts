import { Component, createElement } from "react";
import * as WebCam from "react-webcam";
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
}

export default class CameraContainer extends Component<ContainerProps> {
    constructor(props: ContainerProps) {
        super(props);
        this.formatStlye = this.formatStlye.bind(this);
        this.savePhoto = this.savePhoto.bind(this);
        this.base64toBlob = this.base64toBlob.bind(this);
    }

    render() {
        return createElement(Camera, {
            Width: this.props.capturingWindowWidth,
            Height: this.props.capturingWindowHeight,
            fileType: this.props.fileType,
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

    private savePhoto(image: { src: string, id: string }) {
        mx.data.create({
            callback: (object) => {
                mx.data.saveDocument(
                    object.getGuid(),
                    image.id,
                    {},
                    this.base64toBlob(image.src),
                    () => { mx.ui.info("Photo saved!", false); },
                    error => { mx.ui.error(error.message, false); }
                );
            },
            entity: this.props.photo,
            error: error => {
                mx.ui.error("Could not create object: photo:" + error);
            }
        });
    }

    private base64toBlob(base64Uri: string, callback?: () => void): Blob {
        const byteString = atob(base64Uri.split(",")[1]);
        const mimeString = base64Uri.split(",")[0].split(":")[1].split(";")[0];
        const bufferArray = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(bufferArray);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([ bufferArray ]);
    }

}
