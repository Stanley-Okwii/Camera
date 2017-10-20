import { CSSProperties, Component, createElement } from "react";
// import { Base64_img } from "base64-img";
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
    saveImage: string;
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
    Name: string;
    Contents: string;
}

export default class CameraContainer extends Component<ContainerProps> {
    constructor(props: ContainerProps) {
        super(props);
        this.formatStlye = this.formatStlye.bind(this);
        this.executeMicroflow = this.executeMicroflow.bind(this);
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
            saveImage: this.props.saveImage,
            filter: this.formatStlye(),
            onClickAction: this.executeMicroflow,
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

    private executeMicroflow(image: { src: string, id: string }, microflow: string) {
        mx.data.create({
            callback: (object) => {
                const reader = new FileReader();
                const datatouse = reader.readAsBinaryString(this.base64toBlob(image.src));
                 // const data = Base64_img.img(image.src, "", 2);
                object.set(this.props.Contents, reader.readAsDataURL(this.base64toBlob(image.src)));
                // tslint:disable-next-line:no-console
                console.log("data");
                object.set(this.props.Name, image.id);
                window.mx.ui.action(microflow, {
                    error: (error) => {
                        window.mx.ui.error(`Error while executing microflow ${microflow}: ${error.message}`);
                    },
                    params: {
                        applyto: "selection",
                        guids: [ object.getGuid() ]
                    }
                }, this);
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
}
