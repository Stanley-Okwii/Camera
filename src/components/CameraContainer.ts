import { CSSProperties, Component, createElement } from "react";
import * as WebCam from "react-webcam";
import { Camera, filefomats } from "./Camera";

interface WrapperProps {
    class: string;
    mxObject: mendix.lib.MxObject;
    style: object;
}

export interface ContainerProps extends WrapperProps {
    captureButtonName: string;
    recaptureButtonName: string;
    usePictureButtonName: string;
    fileType: filefomats;
    imageFilter: string;
    photo: string;
    widthUnit: string;
    heightUnit: string;
    width: number;
    height: number;
    captureButtonIcon: string;
    switchCameraIcon: string;
    usePictureButtonIcon: string;
    captionsToUse: string;
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
            Width: this.props.width,
            Height: this.props.height,
            widthUnit: this.props.widthUnit,
            heightUnit: this.props.heightUnit,
            fileType: this.props.fileType,
            usePictureButtonName: this.props.usePictureButtonName,
            captureButtonName: this.props.captureButtonName,
            recaptureButtonName: this.props.recaptureButtonName,
            filter: this.formatStlye(),
            onClickAction: this.savePhoto,
            captureButtonIcon: this.props.captureButtonIcon,
            switchCameraIcon: this.props.switchCameraIcon,
            usePictureButtonIcon: this.props.usePictureButtonIcon,
            captionsToUse: this.props.captionsToUse
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
                mx.ui.error("Could not create object: " + error);
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

    private setStyle() {
        const width = this.props.widthUnit === "percentage" ? `${this.props.width}%` : `${this.props.width}px`;
    }
}
