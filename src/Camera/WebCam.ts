import * as dojoDeclare from "dojo/_base/declare";
//import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";
import * as dojoHas from "dojo/has";
import "../ui/Camera.css";

class WebCam extends WidgetBase {
    // initializing parameters for Display category in the modeler
    userExample1: string;
    passExample1: string;
    showLabels1: false;
    userNameLabel1: string;
    emptyText1: string;
    passwordLabel1: string;
    loginText1: string;
    loginTab1: string;
    showProgress1: false;
    clearPassword1: false;
    clearUserName1: false;
    dofocus1: boolean;
    showLoginFailureWarning1: false;
    loginFailureText1: string;
    autoComplete1: false;
    autoCorrect1: false;
    autoCapitalize1: false;
    keyboardType1: string;
    convertCase1: string;
    forgetPasswordMicroflowNoContext: string;

    // Internal variables
    private contextObject: mendix.lib.MxObject;
    private indicator: number;
    private loginForm_FailedAttempts: number;
    private message: string;

    postCreate() {
        this.loginForm_FailedAttempts = 0;
        this.message = "The username or password you entered is incorrect.";
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.updateRendering();

        if (callback) {
            callback();
        }
    }
    private displayText() {
       // const NoContextHtml = require("../Template/WebCam.html");

        //domConstruct.place(domConstruct.toDom(NoContextHtml), this.domNode);
        dom.byId("LogUserName1").setAttribute("placeholder", this.userExample1);
        dom.byId("LogPassword1").setAttribute("placeholder", this.passExample1);
        dom.byId("loginButton1").setAttribute("value", this.loginText1);
    }
    focusInputEvents(inputId: string, errorNode: string) {
        dom.byId(inputId).addEventListener("focus", () => {
            dom.byId(inputId).setAttribute("style", "border: 1px solid #008CBA;");
            dom.byId(errorNode).setAttribute("style", "display:none;");
        }, false);
    }
    private updateRendering() {
        this.displayText();
        this.displayLabels();
        if (this.dofocus1 === true) {
            this.focusNode();
        }

        this.focusInputEvents("LogUserName1", "userNameError");
        this.focusInputEvents("LogPassword1", "passwordError");
        
        dom.byId("LogUserName1").addEventListener("blur", () => {
            const userNameForLogin = dom.byId("LogUserName1").value;
            if (userNameForLogin !== "") {
                dom.byId("LogUserName1").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
                dom.byId("userNameError").setAttribute("style", "display:none;");

            } else {
                dom.byId("userNameError").innerHTML = this.displayWarning1("Please enter your username");
                dom.byId("userNameError").setAttribute("style", "display:block;");
                this.styleNode1("LogUserName1");
            }
        }, false);
        dom.byId("LogPassword1").addEventListener("blur", () => {
            const passwordForLogin = dom.byId("LogPassword1").value;
            if (passwordForLogin !== "") {
                dom.byId("LogPassword1").setAttribute("style", "border: none; border-bottom: 1px solid #008CBA;");
                dom.byId("passwordError").setAttribute("style", "display: none");
            } else {
                dom.byId("passwordError").innerHTML = this.displayWarning1("Please enter your password");
                dom.byId("passwordError").setAttribute("style", "display:block;");
                this.styleNode1("LogPassword1");
            }
        }, false);
        dom.byId("loginButton1").addEventListener("click", () => {
            const loginUserNameValueNoContext = dom.byId("LogUserName1").value.trim();
            const passwordForLoginNoContext = dom.byId("LogPassword1").value;

            if (!loginUserNameValueNoContext || !passwordForLoginNoContext) {
                if (!loginUserNameValueNoContext) {
                    dom.byId("userNameError").innerHTML = this.displayWarning1("Please enter a user name");
                    this.styleNode1("LogUserName1");
                }
                if (!passwordForLoginNoContext) {
                    dom.byId("passwordError").innerHTML = this.displayWarning1("Please enter your password");
                    this.styleNode1("LogPassword1");
                }
            } else {
                this.loginMethodNoContext();
            }
        }, false);
        dom.byId("forgottenPassword").addEventListener("click", () => this.executeMicroflow(), false);
        let isUnMask = false;
        dom.byId("eyeIdNoContext").addEventListener("click", () => {
            if (isUnMask === false) {
                isUnMask = true;
                dom.byId("LogPassword1").setAttribute("type", "text");
                dom.byId("eyeIdNoContext").innerHTML = "Hide";
            } else {
                isUnMask = false;
                dom.byId("LogPassword1").setAttribute("type", "password");
                dom.byId("eyeIdNoContext").innerHTML = "Show";
            }
        }, false);

        this.setUsernameInputAttributes();
        if (this.autoComplete1) {
            dom.byId("LogUserName1").setAttribute("autocomplete", "on");
        }
        this.addMobileOptions();
    }

    private displayLabels() {
        if (this.showLabels1) {
            dom.byId("userLabel1").innerHTML = this.userNameLabel1;
            dom.byId("userPassword1").innerHTML = this.passwordLabel1;
            dom.byId("tab11").innerHTML = this.loginTab1;
        }
    }

    private addMobileOptions() {
        if (dojoHas("ios") || dojoHas("android") || dojoHas("bb")) {
            dom.byId("LogUserName1").setAttribute("type", this.keyboardType1);
        }
    }

    private styleNode1(elementId: string) {
        dom.byId(elementId).setAttribute("style", "border:1px solid red;");
    }

    private displayWarning1(WarningText: string) {
        const WarningTextSample = "<div style='color:red; display: block; margin-top:10px; margin-left:2px;'>" +
            WarningText +
            "</div>";
        return WarningTextSample;
    }

    private loginMethodNoContext() {
        const UserNameNoContext = this.changeCase(dom.byId("LogUserName1").value.trim());
        const PasswordNoContext = dom.byId("LogPassword1").value;
        if (this.showProgress1) {
            this.indicator = mx.ui.showProgress();
        }
        if ((UserNameNoContext !== "") || (PasswordNoContext !== "")) {
            mx.login(UserNameNoContext, PasswordNoContext,
                () => {
                    if (this.indicator) {
                        mx.ui.hideProgress(this.indicator);
                    }
                },
                () => {
                    if (this.showLoginFailureWarning1) {
                        if (this.loginForm_FailedAttempts === 1) {
                            this.message += "</br>" + this.loginFailureText1;
                        }
                        this.loginForm_FailedAttempts = this.loginForm_FailedAttempts + 1;
                    }
                    dom.byId("warningNodeNoContext").innerHTML = this.displayWarning1(this.message);
                    if (this.clearPassword1) {
                        dom.byId("LogUserName1").setAttribute("value", "");
                    }
                    if (this.clearUserName1) {
                        dom.byId("LogPassword1").setAttribute("value", "");
                    }
                });
        } else {
            dom.byId("userNameError").innerHTML = this.displayWarning1(this.emptyText1);
            this.styleNode1("LogUserName1");
        }
    }
    private focusNode() {
        setTimeout(() => {
            dom.byId("LogUserName1").focus();
        }, 100);
    }

    private changeCase(username: string): string {
        if (this.convertCase1 === "toUpperCase") {
            return username.toUpperCase();
        } else if (this.convertCase1 === "toLowerCase") {
            return username.toLowerCase();
        }
        return username;
    }

    private setUsernameInputAttributes() {
        if (this.autoCorrect1) {
            dom.byId("LogUserName1").setAttribute("autocorrect", "on");
        }
        if (this.autoCapitalize1 && this.convertCase1 !== "none") {
            dom.byId("LogUserName1").setAttribute("autocapitalize", "on");
        }
        if (this.autoComplete1) {
            dom.byId("LogUserName1").setAttribute("autocomplete", "on");
            dom.byId("LogPassword1").setAttribute("autocomplete", "on");
        }
        if (this.convertCase1 !== "none") {
            dom.byId("LogUserName1").setAttribute("autocapitalize", "on");
        }
        if (this.convertCase1 === "toLowerCase") {
            dom.byId("LogUserName1").setAttribute("text-transform", "lowercase");
        } else if (this.convertCase1 === "toUpperCase") {
            dom.byId("LogUserName1").setAttribute("text-transform", "uppercase");
        }
    }


    private executeMicroflow() {
        mx.ui.action(this.forgetPasswordMicroflowNoContext, {
            error: () => {
                mx.ui.error("Could not execute mircoflow");
            },
            params: {
                applyto: "none"
            }
        }, this);
    }
}
// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.WebCam", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(WebCam));
