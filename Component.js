sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], (UIComponent, JSONModel, ResourceModel) => {
    "use strict";
    return UIComponent.extend("Emp_Table.Component", {
        metadata: {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
            var oComponent = this;
            const oModel = new JSONModel();
            oModel.loadData('./model/Empdata.json')
            oComponent.setModel(oModel);
            var i18nModel = new ResourceModel({
                bundleName: "Emp_Table.i18n.i18n"
            });
            oComponent.setModel(i18nModel, "i18n");

            var oViewModel = new JSONModel({
                busy: true,
                modelChanged: false,
                delay: 0
            });

            oComponent.setModel(oViewModel, "viewModel");
        }
    });
});