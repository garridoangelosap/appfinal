//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/library'
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 * @param {typeof sap.m.library} Library
 */
function (Controller, Library) {
    "use strict";

    return Controller.extend("sapuifinal.gestionrrhh.controller.Main", {
                    
        onInit: function () {
        },
        
        onCallCrearEmpleado: function(oEvent){
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CrearEmpleado");
        },

        onCallVerEmpleados: function(){
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("ListaEmpleados");
        },
         //PRIMERA PARTE DEL MASTER
        onCallPedidos: function(oEvent){
            Library.URLHelper.redirect("https://workspaces-ws-lrmhr-app3.us10.trial.applicationstudio.cloud.sap/index.html",true);
            //window.open("https://workspaces-ws-lrmhr-app3.us10.trial.applicationstudio.cloud.sap/index.html","_blank");
        }
    });
});