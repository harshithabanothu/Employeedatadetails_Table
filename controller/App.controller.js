sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("Emp_Table.controller.App", {
      onInit: function () {
        var oController = this;
        var viewModel = oController.getOwnerComponent().getModel("viewModel")
        viewModel.setProperty("/footerVisible", false)
      },
      onSave: function (oEvent) {
        var oController = this;
        var oModel = oController.getView().getModel();
        var viewModel = oController.getView().getModel("viewModel");

        var sPath = viewModel.getProperty("/sPath");
        var updatedData = oModel.getProperty(sPath);

        // var previousRowData = viewModel.getProperty("/previousRowData")
        // for (const key in previousRowData) {
        //   const element = previousRowData[key];
        //   if (element != updatedData[key]) {
        //     updatedData.visible = true;
        //   }
        // }
        updatedData.visible = false;
        oModel.setProperty(sPath, updatedData);
        viewModel.setProperty("/footerVisible", false);

        var oSplitter = oController.getView().getContent()[0].getPages()[0].getContent()[0].getItems()[0].getContent()[0].getRootPaneContainer()
        oSplitter.getPanes()[0].getLayoutData().setSize("100%");
        oSplitter.removePane(1);
      },

      onCancel: function (oEvent) {
        var oController = this;
        var oModel = oController.getView().getModel();
        var viewModel = oController.getView().getModel("viewModel");

        var data = viewModel.getProperty("/previousRowData");
        var sPath = viewModel.getProperty("/sPath");
        oModel.setProperty(sPath, data);
        viewModel.setProperty("/footerVisible", false);


        var oSplitter = oController.getView().getContent()[0].getPages()[0].getContent()[0].getItems()[0].getContent()[0].getRootPaneContainer()
        oSplitter.getPanes()[0].getLayoutData().setSize("100%");
        oSplitter.removePane(1);

      }
    });
  }
);