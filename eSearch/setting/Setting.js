///////////////////////////////////////////////////////////////////////////
// Robert Scheitlin WAB eSearch Widget
///////////////////////////////////////////////////////////////////////////
/*global define, dojo, setTimeout*/
define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/query',
  'dojo/on',
  'dojo/json',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/SimpleTable',
  './SingleSearchEdit',
  './DefaultSearchSymEdit',
  './DefaultBufferEdit',
  './SpatialRelationshipsEdit',
  './GraphicalEdit',
  './DisableTabEdit',
  './ResultFormatEdit',
  './GeneralEdit',
  'jimu/dijit/Message',
  'jimu/dijit/Popup',
  'dojo/keys',
  'dijit/form/NumberTextBox',
  'dijit/form/TextBox',
  'dijit/form/Select',
  'esri/request',
  'dojo/dom-attr',
  'jimu/ServiceDefinitionManager',
  'jimu/utils',
  'dojo/promise/all'
],
function(declare, lang, array, html, query, on,json, _WidgetsInTemplateMixin, BaseWidgetSetting,
          SimpleTable, SingleSearchEdit, DefaultSearchSymEdit, DefaultBufferEdit, SpatialRelationshipsEdit,
          GraphicalEdit, DisableTabEdit, ResultFormatEdit, GeneralEdit, Message, Popup, keys, NumberTextBox, TextBox,
          Select, esriRequest, domAttr, ServiceDefinitionManager, jimuUtils, all) {/*jshint unused: false*/
  return declare([BaseWidgetSetting,_WidgetsInTemplateMixin], {
    baseClass: 'widget-esearch-setting',
    ds: null,
    layerUniqueCache: null,
    layerInfoCache: null,
    bufferDefaults:null,
    spatialrelationships:null,
    graphicalsearchoptions:null,
    disabledTabs: null,
    generalOps: null,
    popup: null,
    popup2: null,
    popup3: null,
    popup4: null,
    popup5: null,
    popup6: null,
    popup7: null,
    popup8: null,
    popup9: null,
    popupgeneraledit: null,
    popupSRedit: null,
    popupGOedit: null,
    popupDisableTabedit: null,
    defaultBufferedit: null,
    defaultSingleSearchedit: null,
    defaultSearchSymedit: null,
    popupformatedit: null,

    postCreate:function(){
      this.inherited(arguments);
      this.sdm = ServiceDefinitionManager.getInstance();
      this.layerUniqueCache = {};
      this.layerInfoCache = {};
      this._bindEvents();
      this.setConfig(this.config);
    },

    setConfig:function(config){
      //hack the 'Learn more about this widget link'
      setTimeout(function(){
        var helpLink = dojo.query('.help-link');
        helpLink[0].href = this.configWindow.esri._appBaseUrl + 'widgets/eSearch/help/eSearch_Help.htm';
        html.setStyle(helpLink[0],'display','block');
      },600);

      this.config = config;
      this.reset();
      if(!this.config){
        return;
      }
      this.graphicalsearchoptions = this.config.graphicalsearchoptions;
      this._initSearchesTable();
      if(this.config.hasOwnProperty('disabledtabs')){
        this.disabledTabs = this.config.disabledtabs;
      }
      this.bufferDefaults = this.config.bufferDefaults;
      this.spatialrelationships = this.config.spatialrelationships;
      this.generalOps = {};
      this.generalOps.initialView = this.config.initialView;
      this.generalOps.selectAttachmentView = this.config.selectAttachmentView;
      this.generalOps.selectfilter = this.config.selectfilter;
      this.generalOps.enablePopupsOnResultClick = this.config.enablePopupsOnResultClick;
      this.generalOps.disablePopups = this.config.disablePopups;
      this.generalOps.disableuvcache = this.config.disableuvcache;
      this.generalOps.exportsearchurlchecked = this.config.exportsearchurlchecked;
      this.generalOps.limitsearch2mapextentchecked = this.config.limitsearch2mapextentchecked;
      this.generalOps.autozoomtoresults = this.config.autozoomtoresults;
      this.generalOps.mouseovergraphics = this.config.mouseovergraphics;
      this.generalOps.mouseoverlist = this.config.mouseoverlist;
      this.generalOps.datedisplayformat = this.config.datedisplayformat;
      this.generalOps.zoomFactor = this.config.zoomFactor;
      this.generalOps.containsword = this.config.containsword;
    },

    getConfig:function(){
      var config = {};
      config.layers = this._getAllLayers();
      if(this.disabledTabs && this.disabledTabs.length > 0){
        config.disabledtabs = this.disabledTabs;
      }
      config.bufferDefaults = this.bufferDefaults;
      config.spatialrelationships = this.spatialrelationships;
      console.info(config.spatialrelationships);
      config.graphicalsearchoptions = this.graphicalsearchoptions;
      config.symbols = {};
      if(this.config.symbols){
        config.symbols = lang.mixin({},this.config.symbols);
      }
      config.resultFormat = this.config.resultFormat;

      config.initialView = this.generalOps.initialView;
      config.selectAttachmentView = this.generalOps.selectAttachmentView;
      config.selectfilter = this.generalOps.selectfilter;
      config.enablePopupsOnResultClick = this.generalOps.enablePopupsOnResultClick;
      config.disablePopups = this.generalOps.disablePopups;
      config.disableuvcache = this.generalOps.disableuvcache;
      config.exportsearchurlchecked = this.generalOps.exportsearchurlchecked;
      config.limitsearch2mapextentchecked = this.generalOps.limitsearch2mapextentchecked;
      config.autozoomtoresults = this.generalOps.autozoomtoresults;
      config.mouseovergraphics = this.generalOps.mouseovergraphics;
      config.mouseoverlist = this.generalOps.mouseoverlist;
      config.datedisplayformat = this.generalOps.datedisplayformat;
      config.zoomFactor = this.generalOps.zoomFactor;
      config.containsword = this.generalOps.containsword;

      this.config = lang.mixin({},config);
      return config;
    },

    getDataSources: function(){
      var config = this.getConfig();
      if(!config || config.layers.length === 0){
        var def = new Deferred();
        def.resolve([]);
        return def;
      }else{
        //this._setUrlForConfig(config);
        var defs = array.map(config.layers, lang.hitch(this, function(singleConfig, i){
          return this._getSingleDataSource(singleConfig, i);
        }));
        return all(defs);
      }
    },

    _getSingleDataSource: function(singleConfig, index){
      return this.sdm.getServiceDefinition(singleConfig.url).then(lang.hitch(this, function(definition){
        return {
          id: index,
          type: 'Features',
          label: singleConfig.name,
          dataSchema: jimuUtils.getDataSchemaFromLayerDefinition(definition)
        };
      }));
    },

    _getAllLayers: function () {
      var trs = this.searchesTable._getNotEmptyRows();
      var allLayers = array.map(trs, lang.hitch(this, function (item) {
        return item.singleSearch;
      }));
      return allLayers;
    },

    _onGeneralEditOk: function() {
      this.generalOps = this.popupgeneraledit.getConfig();

      this.popup9.close();
      this.popupState = '';
    },

    _onGeneralEditClose: function() {
      this.popupgeneraledit = null;
      this.popup9 = null;
    },

    _openGeneralEdit: function(title) {
      this.popupgeneraledit = new GeneralEdit({
        nls: this.nls,
        config: this.config || {}
      });

      this.popup9 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.popupgeneraledit,
        container: 'main-page',
        width: 960,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onGeneralEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onGeneralEditClose')
      });
      html.addClass(this.popup9.domNode, 'widget-setting-format');
      this.popupgeneraledit.startup();
    },

    _onFormatEditOk: function() {
      this.config.resultFormat = this.popupformatedit.getConfig().format;
      this.popup8.close();
      this.popupState = '';
    },

    _onFormatEditClose: function() {
      this.popupfromatedit = null;
      this.popup8 = null;
    },

    _openFormatEdit: function(title) {
      this.popupformatedit = new ResultFormatEdit({
        nls: this.nls,
        config: this.config || {}
      });

      this.popup8 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.popupformatedit,
        container: 'main-page',
        width: 540,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onFormatEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onFormatEditClose')
      });
      html.addClass(this.popup8.domNode, 'widget-setting-format');
      this.popupformatedit.startup();
    },

    _onSREditOk: function() {
      var SRs = this.popupSRedit.getConfig();
      console.info(SRs);
      if (SRs.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }
      this.spatialrelationships = SRs;
      this.popup2.close();
    },

    _onSREditClose: function() {
      this.popupSRedit = null;
      this.popup2 = null;
    },

    _openSREdit: function(title, spatrels) {
      this.popupSRedit = new SpatialRelationshipsEdit({
        nls: this.nls,
        config: spatrels || {}
      });

      this.popup2 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.popupSRedit,
        container: 'main-page',
        width: 640,
        height: 485,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onSREditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onSREditClose')
      });
      html.addClass(this.popup2.domNode, 'widget-setting-popup');
      this.popupSRedit.startup();
    },

    _onGOEditOk: function() {
      var config = this.popupGOedit.getConfig();

      if (config.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }
      this.graphicalsearchoptions = config;
      this.popup5.close();
    },

    _onGOEditClose: function() {
      this.popupGOedit = null;
      this.popup5 = null;
    },

    _openGOEdit: function(title, config) {
      this.popupGOedit = new GraphicalEdit({
        nls: this.nls,
        config: config || {}
      });

      this.popup5 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.popupGOedit,
        container: 'main-page',
        width: 960,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onGOEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onGOEditClose')
      });
      html.addClass(this.popup5.domNode, 'widget-setting-popup');
      this.popupGOedit.startup();
    },

    _onDTEditOk: function() {
      var DTs = this.popupDisableTabedit.getConfig();

      if (DTs.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }
      this.disabledTabs = DTs;
      this.popup7.close();
    },

    _onDTEditClose: function() {
      this.popupDisableTabedit = null;
      this.popup7 = null;
    },

    _openDTEdit: function(title, disTabs) {
      this.popupDisableTabedit = new DisableTabEdit({
        nls: this.nls,
        config: disTabs || {}
      });

      this.popup7 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.popupDisableTabedit,
        container: 'main-page',
        width: 640,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onDTEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onDTEditClose')
      });
      html.addClass(this.popup7.domNode, 'widget-setting-popup');
      this.popupDisableTabedit.startup();
    },

    _onBufferEditOk: function() {
      var bConfig = this.defaultBufferedit.getConfig();

      if (bConfig.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }
      this.config.bufferDefaults = bConfig;
      this.popup3.close();
    },

    _onBufferEditClose: function() {
      this.defaultBufferedit = null;
      this.popup3 = null;
    },

    _openBufferEdit: function(title, dBuffer) {
      this.defaultBufferedit = new DefaultBufferEdit({
        nls: this.nls,
        config: dBuffer || {}
      });

      this.popup3 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.defaultBufferedit,
        container: 'main-page',
        height: 525,
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onBufferEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onBufferEditClose')
      });
      html.addClass(this.popup3.domNode, 'widget-setting-popup');
      this.defaultBufferedit.startup();
    },

    _onSymbolEditOk: function() {
      var sConfig = this.defaultSearchSymedit.getConfig();

      if (sConfig.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }
      this.config.symbols = sConfig;
      this.popup4.close();
    },

    _onSymbolEditClose: function() {
      this.defaultSearchSymedit = null;
      this.popup4 = null;
    },

    _openSymbolEdit: function(title, dSym) {
      this.defaultSearchSymedit = new DefaultSearchSymEdit({
        nls: this.nls,
        config: dSym || {},
        widget:  this
      });

      this.popup4 = new Popup({
        titleLabel: title,
        autoHeight: true,
        content: this.defaultSearchSymedit,
        container: 'main-page',
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onSymbolEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onSymbolEditClose')
      });
      html.addClass(this.popup4.domNode, 'widget-setting-popup');
      this.defaultSearchSymedit.startup();
    },

    _onSingleSearchEditOk: function() {
      var sConfig = this.defaultSingleSearchedit.getConfig();

      if (sConfig.length < 0) {
        new Message({
          message: this.nls.warning
        });
        return;
      }

      if(this.popupState === 'ADD'){
        this.searchesTable.editRow(this.defaultSingleSearchedit.tr, {
          name: sConfig.name
        });
        this.defaultSingleSearchedit.tr.singleSearch = sConfig;
        this.popupState = '';
      }else{
        this.searchesTable.editRow(this.defaultSingleSearchedit.tr, {
          name: sConfig.name
        });
        this.defaultSingleSearchedit.tr.singleSearch = sConfig;
      }

      this.popup6.close();
      this.popupState = '';
    },

    _onSingleSearchEditClose: function() {
      if(this.popupState === 'ADD'){
        this.searchesTable.deleteRow(this.defaultSingleSearchedit.tr);
      }
      this.defaultSearchSymedit = null;
      this.popup6 = null;
    },

    _openSingleSearchEdit: function(title, tr) {
//      console.info(tr.singleSearch);
      this.defaultSingleSearchedit = new SingleSearchEdit({
        nls: this.nls,
        config: tr.singleSearch || {},
        searchSetting: this,
        layerUniqueCache: this.layerUniqueCache,
        layerInfoCache: this.layerInfoCache,
        tr: tr,
        disableuvcache: this.config.disableuvcache,
        mainConfig: this.config
      });

      this.popup6 = new Popup({
        titleLabel: title,
        autoHeight: false,
        content: this.defaultSingleSearchedit,
        container: 'main-page',
        buttons: [{
          label: this.nls.ok,
          key: keys.ENTER,
          onClick: lang.hitch(this, '_onSingleSearchEditOk')
        }, {
          label: this.nls.cancel,
          key: keys.ESCAPE
        }],
        onClose: lang.hitch(this, '_onSingleSearchEditClose')
      });
      html.addClass(this.popup6.domNode, 'widget-setting-popup');
      this.defaultSingleSearchedit.startup();
    },

    _need2ChkPopups: function() {
      if(this.disablePopupsCbx.getValue()){
        this.enablePopupsCbx.setValue(false);
        this.mouseOverGraphicsCbx.setValue(false);
        this.enablePopupsCbx.setStatus(false);
        this.mouseOverGraphicsCbx.setStatus(false);
      }else{
        this.enablePopupsCbx.setStatus(true);
        this.mouseOverGraphicsCbx.setStatus(true);
      }
    },

    _bindEvents:function(){
      // this.disablePopupsCbx.onChange = lang.hitch(this, this._need2ChkPopups);
      this.own(on(this.btnAddSearch,'click',lang.hitch(this,function(){
        var args = {
          config:null
        };
        this.popupState = 'ADD';
        var tr = this._createSingleSearch(args);
        if(tr){
          this._showSingleSearchEdit(tr);
        }
      })));
      this.own(on(this.btnSymSearch,'click',lang.hitch(this,function(){
        this._openSymbolEdit(this.nls.editDefaultSym, this.config);
      })));
      this.own(on(this.btnBufferSearch,'click',lang.hitch(this,function(){
        this._openBufferEdit(this.nls.updateBuffer, this.config);
      })));
      this.own(on(this.btnSpatialSearch,'click',lang.hitch(this,function(){
        this._openSREdit(this.nls.addspatalrelationships, this.spatialrelationships);
      })));
      this.own(on(this.btnGraphicalSearch,'click',lang.hitch(this,function(){
        this._openGOEdit(this.nls.addgraphicalsearchoptions, this.graphicalsearchoptions);
      })));
      this.own(on(this.btnDisableTabs,'click',lang.hitch(this,function(){
        this._openDTEdit(this.nls.editdisabledtaboptions, this.disabledTabs);
      })));
      this.own(on(this.searchesTable,'actions-edit',lang.hitch(this,function(tr){
        this.popupState = 'EDIT';
        this._showSingleSearchEdit(tr);
      })));
      this.own(on(this.searchesTable,'row-delete',lang.hitch(this,function(tr){
        delete tr.singleSearch;
      })));
      this.own(on(this.btnFormatResults,'click',lang.hitch(this,function(){
        this._openFormatEdit(this.nls.editResultFormat);
      })));
      this.own(on(this.btnGeneral,'click',lang.hitch(this,function(){
        this._openGeneralEdit(this.nls.editGeneraloptions);
      })));
    },

    reset:function(){
      this.searchesTable.clear();
    },

    _showSingleSearchEdit: function (tr) {
      this._openSingleSearchEdit(this.nls.updateSearch, tr);
    },

    _initSearchesTable:function(){
      this.searchesTable.clear();
      var layers = this.config && this.config.layers;
      array.forEach(layers, lang.hitch(this, function(layerConfig, index) {
        this._createSingleSearch(layerConfig);
      }));
    },

    _createSingleSearch:function(args){
      var rowData = {
        name: (args && args.name)||''
      };
      var result = this.searchesTable.addRow(rowData);
      if(!result.success){
        return null;
      }
      result.tr.singleSearch = args;
      return result.tr;
    }
  });
});
