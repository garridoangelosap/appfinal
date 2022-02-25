//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/NumberFormat"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Library} Library
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.format.NumberFormat} NumberFormat
     */
    function (Controller, Library, MessageBox, History, NumberFormat) {
        "use strict";

        return Controller.extend("sapuifinal.gestionrrhh.controller.CrearEmpleado", {
//onInit se ejecuta el inicio que maneja los estados y comportamientos de los botones y los inputs de
//los formularios del wizard newemployee que tiene los datos del nuevo empleado que se creará
            onInit: function () {
                var oView = this.getView();

                this._wizard = this.getView().byId("CrearEmpleadoWizard");
                this._oNavContainer = this.getView().byId("NavContainer");
			    this._oWizardContentPage = this.getView().byId("ContentPage");

                this.oJSONModelNuevo = new sap.ui.model.json.JSONModel();
                oView.setModel(this.oJSONModelNuevo, "nuevoEmpleadoModel");
            },

            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

            backToWizardContent: function () {
			    this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },

            editPaso1: function () {
                this._handleNavigationToStep(0);
            },

            editPaso2: function () {
                this._handleNavigationToStep(1);
            },

            editPaso3: function () {
                this._handleNavigationToStep(2);
            },

            discardProgressCustom: function () {
                
                this._wizard.discardProgress(this.byId("wizardPaso1"));

                var clearContent = function (content) {
                    for (var i = 0; i < content.length; i++) {
                        if (content[i].setValue) {
                            content[i].setValue("");
                        }

                        if (content[i].getContent) {
                            clearContent(content[i].getContent());
                        }
                    }
                };

                clearContent(this._wizard.getSteps());
 
                var oUploadCollection = this.getView().byId("uploadCollection");
                oUploadCollection.removeAllItems();
                oUploadCollection.destroyItems();

                this.getView().byId("btnTipo0").setType("Default");
                this.getView().byId("btnTipo1").setType("Default");
                this.getView().byId("btnTipo2").setType("Default");

                this.oJSONModelNuevo.destroy();

                this._wizard.invalidateStep(this.getView().byId("wizardPaso1"));
            },
//cancela la operacion y vuelve al launchpad
            wizardCancel: function () {
                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("confirmWizardCancel"),
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this.discardProgressCustom();
                        }
                    }.bind(this)
                });
            },

            wizardComplete: function () {
                this._oNavContainer.to(this.byId("wizardReviewPage"));

                //mostrar adjuntos en preview
                var oReviewCollection = this.getView().byId("uploadCollectionReview");
                var oUploadCollection = this.getView().byId("uploadCollection");

                oReviewCollection.removeAllItems();
                oReviewCollection.destroyItems();

                for (let i = 0; i < oUploadCollection.getItems().length; i++) {
                    var item = new sap.m.UploadCollectionItem();
                    item.setFileName(oUploadCollection.getItems()[i].getFileName());
                    item.setVisibleDelete(false);
                    oReviewCollection.addItem(item);
                }
            },



            setTipoEmpleado: function (oEvent) {

                var tipoEmpleado;
                var oView = this.getView();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                var oDNITxt = oView.byId("inputDNITxt");
                var oSalario = oView.byId("inputSalario");
                var oSalarioTxt = oView.byId("inputSalarioTxt");
                var oSalarioReviewTxt = oView.byId("salarioReviewTxt");
                var oDniReview = oView.byId("dniReviewTxt");

                var textoSalario = oResourceBundle.getText("salario");
                var textoPrecio = oResourceBundle.getText("precio");
                var textoDNI = oResourceBundle.getText("dni");
                var textoCIF = oResourceBundle.getText("cif");

                var tipoEmpleadoTxt = oEvent.getSource().getText();
                this.oJSONModelNuevo.setProperty("/TypeTxt", tipoEmpleadoTxt);
                
                oView.byId("btnTipo0").setType("Default");
                oView.byId("btnTipo1").setType("Default");
                oView.byId("btnTipo2").setType("Default");
                
                oEvent.getSource().setType("Emphasized");
                
                switch(tipoEmpleadoTxt){
                    case oResourceBundle.getText("interno"):
                        tipoEmpleado = "0";
                        break;
                    case oResourceBundle.getText("autonomo"):
                        tipoEmpleado = "1";    
                        break;
                    case oResourceBundle.getText("gerente"):
                        tipoEmpleado = "2";    
                        break;
                };
                this.getView().getModel("nuevoEmpleadoModel").setProperty("/Type", tipoEmpleado);

                switch (tipoEmpleado) {
                    case "0": //Interno
                        oDNITxt.setText(textoDNI);
                        oDniReview.setText(textoDNI);

                        oSalarioTxt.setText(textoSalario);
                        oSalarioReviewTxt.setText(textoSalario);

                        //defecto 24000 rango 12000 y 80000
                        oSalario.setMin(12000);
                        oSalario.setMax(80000);
                        oSalario.setStep(1000);
                        oSalario.setValue(24000);
                        break;

                    case "1": //Autónomo
                        oDNITxt.setText(textoCIF);
                        oDniReview.setText(textoCIF);

                        oSalarioTxt.setText(textoPrecio);
                        oSalarioReviewTxt.setText(textoPrecio);

                        //defecto 24000 rango 12000 y 80000
                        oSalario.setMin(100);
                        oSalario.setMax(2000);
                        oSalario.setStep(100);
                        oSalario.setValue(400);
                        break;

                   case "2": //Gerente
                        oDNITxt.setText(textoDNI);
                        oDniReview.setText(textoDNI);

                        oSalarioTxt.setText(textoSalario);
                        oSalarioReviewTxt.setText(textoSalario);

                        //defecto 70000 rango 50000 y 200000
                        oSalario.setMin(50000);
                        oSalario.setMax(200000);
                        oSalario.setStep(10000);
                        oSalario.setValue(70000);
                        break;

                    default:
                        break;
                }

                this._wizard.setCurrentStep(this._wizard.getSteps()[0]);
                this._wizard.validateStep(this.byId("wizardPaso1"));
                this._wizard.nextStep();
            },

            ValidarPaso2: function () {
                var oView = this.getView();
                var tipoEmpleado = oView.getModel("nuevoEmpleadoModel").getProperty("/Type");
                var oNombre = oView.byId("inputNombre");
                var oApellidos = oView.byId("inputApellidos");
                var oDNI = oView.byId("inputDNI");
                var oFecha = oView.byId("inputFecha");

                var error = false;

                //Validando Campos
                //Nombre
                if(oNombre.getValue().length > 0 ){
                    oNombre.setValueState("None");
                }else{
                    oNombre.setValueState("Error");
                    error = true;
                };

                //Apellidos
                if(oApellidos.getValue().length > 0 ){
                    oApellidos.setValueState("None");
                }else{
                    oApellidos.setValueState("Error");
                    error = true;
                };

                //DNI - CIF
                if(tipoEmpleado === "1"){
                    //Autónomo
                    if(oDNI.getValue().length > 0 ){
                        oDNI.setValueState("None");
                    }else{
                        oDNI.setValueState("Error");
                        error = true;
                    };
                }else{
                    //Interno y Gerente
                    if(this._validarDNI(oDNI)){
                        oDNI.setValueState("None");
                    }else{
                        oDNI.setValueState("Error");
                        error = true;
                    }
                }

                //Fecha
                if(oFecha.isValidValue() && oFecha.getValue().length > 0){
                    oFecha.setValueState("None");
                }else{
                    oFecha.setValueState("Error");
                    error = true;
                };

                if(error === false){
                    this._wizard.validateStep(this.getView().byId("wizardPaso2"));
                }else{
                    this._wizard.invalidateStep(this.getView().byId("wizardPaso2"));
                };
            },

            handleLiveChange: function (oEvent) {
                var ValueState = Library.ValueState;
                var oTextArea = oEvent.getSource(),
                iValueLength = oTextArea.getValue().length,
                iMaxLength = oTextArea.getMaxLength(),
                sState = iValueLength > iMaxLength ? ValueState.Error : ValueState.None;

                oTextArea.setValueState(sState);
            },

            _validarDNI: function(oEvent){
                var dni = oEvent.getValue();
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                //Se comprueba que el formato es válido
                if(regularExp.test (dni) === true){
                    //Número
                    number = dni.substr(0,dni.length-1);
                    //Letra
                    letter = dni.substr(dni.length-1,1);
                    number = number % 23;
                    letterList="TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList=letterList.substring(number,number+1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        return false;
                    }else{
                        //Correcto
                        return true;
                    }
                }
                else{
                    //Error
                    return false;
                }
            },

            crearCancel: function(){
                var oHistory = History.getInstance();
                var sPreviosHash = oHistory.getPreviousHash();

                MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText("confirmWizardCancel"),
                {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this.discardProgressCustom();

                            if (sPreviosHash !== undefined) {
                                window.history.go(-1);
                            } else {
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteApp", true);
                            }
                        }
                    }.bind(this)
                });
            },

            wizardGuardar: function(){
                var oODataModel = this.getOwnerComponent().getModel("empleadosModel");
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                //var tempMail = this._getRandonMail();
                var eId = 0;
                this.getView().getModel("empleadosModel").read("/Users", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ",this.getOwnerComponent().SapId)
                    ],
                    success: function (res) {
                        
                        res.results.forEach(el => {
                            // Obtiene el máximo EmployeeId desde el modelo OData
                            // e incrementa en 1
                            if(parseInt(el.EmployeeId) >= eId) {
                                eId = parseInt(el.EmployeeId)+1;
                                
                           
                            }
                        });
                       
                        var body = {
                            SapId:this.getOwnerComponent().SapId,
                            
                            EmployeeId:eId.toString(),
                            Type: this.oJSONModelNuevo.getProperty("/Type").toString(),
                            FirstName: this.oJSONModelNuevo.getProperty("/FirstName").toString(),
                            LastName: this.oJSONModelNuevo.getProperty("/LastName").toString(),
                            Dni: this.oJSONModelNuevo.getProperty("/Dni").toString(),
                            CreationDate: this.oJSONModelNuevo.getProperty("/CreationDate"),
                            Comments: this.oJSONModelNuevo.getProperty("/Comments")
                        };
                        //console.log(body);
                        
                        oODataModel.create("/Users", body, {
                                success: function (data) {
                                    //console.log(data);
                                    
                                    
                                  //id empleado generado para user
                                    this.oJSONModelNuevo.setProperty("/EmployeeId",eId);
                                    this.oJSONModelNuevo.setProperty("/SapId",data.SapId);
                                    this._guardarSalario(data.EmployeeId, data.SapId);
                                    this._guardarAdjuntos();
                                    
                                    MessageBox.success(oResourceBundle.getText("saveOK"),{
                                        onClose: function(){
                                            this._retornarInicio();
                                        }.bind(this)
                                    });
                                }.bind(this),
                                error: function (e) {
                                    //console.log(e);
                                    MessageBox.error(oResourceBundle.getText("saveNoOK"));
                                }.bind(this)
                        });   

                    }.bind(this)});
                   
               
            },

            _guardarSalario: function(newEmployeeId, SapId){

                var oODataModel = this.getOwnerComponent().getModel("empleadosModel");

                var oFormatOption = {
                    minIntegerDigits: 1,
                    maxIntegerDigits: 17,
                    minFractionDigits: 2,
                    maxFractionDigits: 2,
                    groupingEnabled: false,
                    decimalSeparator: "."
                    };

                var oFloat = NumberFormat.getFloatInstance(oFormatOption); 
                
                var salario = oFloat.format(this.oJSONModelNuevo.getProperty("/Amount"));

                var bodySalario = {
                    SapId: SapId,
                    EmployeeId: newEmployeeId,
                    CreationDate: this.oJSONModelNuevo.getProperty("/CreationDate"),
                    Ammount: salario,
                    Waers: "EUR",
                    Comments: this.oJSONModelNuevo.getProperty("/Comments")
                };
                //console.log(bodySalario);

                oODataModel.create("/Salaries", bodySalario, {
                        success: function () {
                            //console.log("SalarioOK");
                        }.bind(this),
                        error: function () {
                            //console.log("SalarioNOOK");
                        }.bind(this)
                });
            },

            _guardarAdjuntos: function(EmployeeId){
                var oUploadCollection = this.getView().byId("uploadCollection");
                var cFiles = oUploadCollection.getItems().length;
                var uploadInfo = cFiles + " file(s)";

                if (cFiles > 0) {
                    oUploadCollection.upload();
                }
            },

            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();

                //Header Token CSRF
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("empleadosModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileBeforeUpload: function (oEvent) {

                let fileName = oEvent.getParameter("fileName");

                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.oJSONModelNuevo.getProperty("/SapId").toString() + ";"
                            + this.oJSONModelNuevo.getProperty("/EmployeeId").toString() + ";"
                            + fileName
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileUploadComplete: function (oEvent) {           
            },


            _retornarInicio: function(){
                var oHistory = History.getInstance();
                var sPreviosHash = oHistory.getPreviousHash();

                this._handleNavigationToStep(0);
                this.discardProgressCustom();

                if (sPreviosHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteApp", true);
                }
            }


        });
    });