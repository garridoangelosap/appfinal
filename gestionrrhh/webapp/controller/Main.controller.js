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
         //como no se pudo desplegar la aplicacion se reenvia a la pagina de Logali
        onCallPedidos: function(oEvent){
            Library.URLHelper.redirect("https://logaligroup.com/",true);
            
        }
    });
});