sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/ui/model/Filter',
    'sap/ui/model/Sorter',
    "sap/m/library",
    'sap/ui/core/Fragment',
    "sap/ui/layout/SplitPane",
    "sap/ui/layout/SplitterLayoutData"
], function (Controller, JSONModel, Device, Filter, Sorter, Library, Fragment, SplitPane, SplitterLayoutData) {
    "use strict";
    var TableController = Controller.extend("Emp_Table.controller.Table", {
        onInit: function () {
            var oController = this;
            var oModel = oController.getOwnerComponent().getModel();
            var viewModel = oController.getOwnerComponent().getModel("viewModel");

            oController._mViewSettingsDialogs = {}

            this.mGroupFunctions = {
                designation: function (oContext) {
                    var name = oContext.getProperty("designation");
                    return {
                        key: name,
                        text: name
                    };
                },
            };


        },
        resetGroupDialog: function (oEvent) {
            this.groupReset = true;
        },

        getViewSettingsDialog: function (sDialogFragmentName) {
            var oController = this;
            var pDialog = oController._mViewSettingsDialogs[sDialogFragmentName];
            if (!pDialog) {
                pDialog = Fragment.load({
                    id: oController.getView().getId(),
                    name: sDialogFragmentName,
                    controller: oController
                }).then(function (oDialog) {
                    if (Device.system.desktop) {
                        oDialog.addStyleClass("sapUiSizeCompact");
                    }
                    return oDialog;
                });
                oController._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
            }
            return pDialog;
        },

        handleSortButtonPressed: function () {
            var oController = this;
            oController.getViewSettingsDialog("Emp_Table.fragments.SortDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleFilterButtonPressed: function () {
            this.getViewSettingsDialog("Emp_Table.fragments.FilterDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleGroupButtonPressed: function () {
            this.getViewSettingsDialog("Emp_Table.fragments.GroupDialog")
                .then(function (oViewSettingsDialog) {
                    oViewSettingsDialog.open();
                });
        },
        handleSortDialogConfirm: function (oEvent) {
            var oController = this
            var oTable = oController.byId("idEmpTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));

            // apply the selected sort and group settings
            oBinding.sort(aSorters);
        },
        handleFilterDialogConfirm: function (oEvent) {
            var oTable = this.byId("idEmpTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];

            mParams.filterItems.forEach(function (oItem) {
                var aSplit = oItem.getKey().split("___"),
                    sPath = aSplit[0],
                    sOperator = aSplit[1],
                    sValue1 = aSplit[2],
                    sValue2 = aSplit[3],
                    oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
                aFilters.push(oFilter);
            });

            // apply filter settings
            oBinding.filter(aFilters);

            // update filter bar
            this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
            this.byId("vsdFilterLabel").setText(mParams.filterString);
        },
        handleGroupDialogConfirm: function (oEvent) {
            var oTable = this.byId("idEmpTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                vGroup,
                aGroups = [];

            if (mParams.groupItem) {
                sPath = mParams.groupItem.getKey();
                bDescending = mParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];
                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                // apply the selected group settings
                oBinding.sort(aGroups);
            } else if (this.groupReset) {
                oBinding.sort();
                this.groupReset = false;
            }
        },

        onItemPress: function (oEvent) {
            var oController = this;
            var oModel = oController.getView().getModel();
            var viewModel = oController.getView().getModel("viewModel");

            var oSelectedItem = oEvent.getParameter('listItem')
            oSelectedItem.setSelected(true)
            
            var oContext = oSelectedItem.getBindingContext();

            viewModel.setProperty("/sPath", oContext.getPath())

            var oSplitter = oController.getView().getParent().getParent()
            if (oSplitter.getPanes() && oSplitter.getPanes()[1]) {
                oSplitter.removePane(1);
            }
            oSplitter.getPanes()[0].getLayoutData().setSize("75%");
            var oSplitterLayoutData = new SplitterLayoutData({
                size: "25%"
            });
            var oSplitPane = new SplitPane({
                layoutData: oSplitterLayoutData
            });
            var sFragmentId = this.createId("fragment_" + new Date().getTime());

            Fragment.load({
                id: sFragmentId,
                name: "Emp_Table.fragments.EditDetailsDialog",
                type: "XML",
                controller: this
            }).then(function (oFragment) {
                oSplitPane.setContent(oFragment);
                oSplitter.addPane(oSplitPane);
            }.bind(this));
            oSplitter.setModel(oModel);
            oSplitter.setBindingContext(oContext);
        },
        onGenderChange: function (oEvent) {
            var oController = this
            var oModel = oEvent.getSource().getModel();
            var viewModel = oController.getView().getModel("viewModel");

            var oSelectedItemIndex = oEvent.getParameter("selectedIndex")
            var oRadioButtons = oEvent.getSource().getButtons();
            var selectedRadioButton = oRadioButtons[oSelectedItemIndex].getText()

            var oSelectedItem = oEvent.getSource()
            var oBindingContext = oSelectedItem.getBindingContext()
            var sPath = oBindingContext.getPath()

            oModel.setProperty(sPath + '/gender', selectedRadioButton)
            oModel.setProperty(sPath + '/visible', true)
            viewModel.setProperty("/footerVisible", true)
        },

        onChange: function (oEvent) {
            var oController = this;
            var oModel = oEvent.getSource().getModel();
            var viewModel = oController.getView().getModel("viewModel");
            var sPath = viewModel.getProperty("/sPath");
            oModel.setProperty(sPath + '/visible', true)
            viewModel.setProperty("/footerVisible", true)
        },

        onClose: function (oEvent) {
            var oController = this;

            var oTable = oController.getView().byId("idEmpTable");
            oTable.getSelectedItem().setSelected(false)
            var oSplitter = oController.getView().getParent().getParent();
            oSplitter.getPanes()[0].getLayoutData().setSize("100%");
            oSplitter.removePane(1);
        }
    });
    return TableController;
});