//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sapuifinal.gestionrrhh.controller.ListaEmpleados", {
            onBeforeRendering: function () {
                this._detailEmpleadosView = this.getView().byId("detailEmpleadosView");
            },

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmpleado", this.showEmpleadoDetalles, this);
                this._bus.subscribe("flexible", "eliminarEmpleado", this.elimimarEmpleado, this);
            },

            showEmpleadoDetalles: function (category, nameEvent, path) {
                var detailView = this.getView().byId("detailEmpleadosView");
                detailView.bindElement("empleadosModel>" + path);

                //icono 
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                
                switch (this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().Type) {
                    case "0":
                        detailView.byId("oHeader").setIcon("sap-icon://employee-pane");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("interno"));                        
                        break;
                    case "1":
                        detailView.byId("oHeader").setIcon("sap-icon://employee");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("autonomo"));
                        break;
                    case "2":
                        detailView.byId("oHeader").setIcon("sap-icon://leads");
                        detailView.byId("tipoEmpleado").setText(oResourceBundle.getText("gerente"));
                        break;
                    default:
                        detailView.byId("oHeader").setIcon("sap-icon://add-employee");
                        break;
                };

                this._detailEmpleadosView.byId("boxMensaje").setVisible(false);
                this._detailEmpleadosView.byId("datosEmpleado").setVisible(true);

                this.onReadODataEmpleado(this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().EmployeeId,
                this._detailEmpleadosView.getBindingContext("empleadosModel").getObject().SapId);
            },

            onReadODataEmpleado: function (EmployeeId, SapId) {
             //SapId= "garridoangelosap@gmail.com";
                var detailView = this.getView().byId("detailEmpleadosView");

                this.getView().getModel("empleadosModel").read("/Users", {
                    filters: [
                       // new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId)
                        new sap.ui.model.Filter("SapId", "EQ", SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId.toString())
                    ],
                    success: function (data) {
                    }.bind(this),
                    
                    error: function (e) {
                    }.bind(this)
                });

                

                //Bind Files
                this._detailEmpleadosView.byId("uploadCollection").bindAggregation("items", {
                    path: "empleadosModel>/Attachments",
                    filters: [
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId),
                        new sap.ui.model.Filter("SapId", "EQ", SapId),
                    ],
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{empleadosModel>AttId}",
                        fileName: "{empleadosModel>DocName}",
                        visibleEdit: false
                    }).attachPress(this.downloadFile)
                });

                //Bind Salary
                this._detailEmpleadosView.byId("idTimeLine").bindAggregation("content", {
                    path: "empleadosModel>/Salaries",
                    filters: [
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId),
                        new sap.ui.model.Filter("SapId", "EQ", SapId),
                    ],
                    template: new sap.suite.ui.commons.TimelineItem({
                        dateTime: "{empleadosModel>CreationDate}",
                        text: "{empleadosModel>Comments}",
                        userName:"{empleadosModel>Ammount}"
                    })
                });

            },

            elimimarEmpleado: function(category, nameEvent, path){
                                
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();             
                
                this.getView().getModel("empleadosModel").remove("/Users(EmployeeId='" + path.EmployeeId +
                                                                        "',SapId='" + path.SapId + "')",
                {
                    success: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("empleadoDeleteOK"));

                        this._detailEmpleadosView.byId("boxMensaje").setVisible(true);
                        this._detailEmpleadosView.byId("datosEmpleado").setVisible(false);

                        this.getView().byId("masterEmpleadosView").byId("standardList").getBinding("items").refresh();                        

                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("empleadoDeleteKO"));
                    }.bind(this)
                });
            },

            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("empleadosModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            }

		});
	});