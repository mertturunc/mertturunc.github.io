define([
  'jimu/shared/BaseVersionManager'
],
function(
  BaseVersionManager
  ) {
  function VersionManager(){
    this.versions = [{
      version: '1.0',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    }, {
      version: '1.2',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.bufferDefaults.addtolegend = false;
        for(var l = 0; l < newConfig.layers.length; l++){
          var lay = newConfig.layers[l];
          delete lay.showattachments;
        }
        return newConfig;
      }
    },{
      version: '1.2.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '1.2.0.2',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.exportsearchurlchecked = true;
        return newConfig;
      }
    },{
      version: '1.2.0.3',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.enablePopupsOnResultClick = true;
        return newConfig;
      }
    },{
      version: '1.2.0.4',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.graphicalsearchoptions.keepgraphicalsearchenabled = oldConfig.oldConfig;
        newConfig.graphicalsearchoptions.toleranceforpointgraphicalselection = oldConfig.toleranceforpointgraphicalselection;
        newConfig.graphicalsearchoptions.addpointtolerancechecked = oldConfig.addpointtolerancechecked;
        newConfig.graphicalsearchoptions.multipartgraphicsearchchecked = oldConfig.multipartgraphicsearchchecked;
        newConfig.graphicalsearchoptions.buffercheckedbydefaultgraphicaloption = false;
        newConfig.graphicalsearchoptions.showmultigraphicsgraphicaloption = true;
        newConfig.graphicalsearchoptions.showaddtolerancegraphicaloption = true;
        newConfig.graphicalsearchoptions.showaddsqltextgraphicaloption = true;
        newConfig.graphicalsearchoptions.showbuffergraphicaloption = true;
        return newConfig;
      }
    },{
      version: '1.2.0.5',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '1.2.0.6',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '1.3',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '1.3.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '1.3.0.2',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.disablePopups = false;
        newConfig.disableuvcache = false;
        return newConfig;
      }
    },{
      version: '2.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.0.1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.0.1.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.0.1.3',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.0.1.4',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.1.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.2.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.3',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.4',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.4.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.4.0.2',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.5',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.5.0.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.6',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.6.0.1',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.bufferDefaults.autoZoom = true;
        return newConfig;
      }
    },{
      version: '2.6.1',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.containsword = false;
        return newConfig;
      }
    },{
      version: '2.6.1.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.7',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.8',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.9',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.10',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.11',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.12',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.13',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.14',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.15',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.16',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.17',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.18',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.19',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.20',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.21',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.selectAttachmentView = 'text';
        return newConfig;
      }
    },{
      version: '2.21.1',
      upgrader: function(oldConfig){
        return oldConfig;
      }
    },{
      version: '2.23',
      upgrader: function(oldConfig){
        var newConfig = oldConfig;
        newConfig.layers.forEach(lay =>{
          var exprs = [], links = [], relates = [];
          
          lay.expressions.expression.forEach(expr => {
            var values = [];
            expr.values.value.forEach(val=>{
              values.push(val);
            })
            console.log(values);
            expr.values = values;
            exprs.push(expr);
          })
          lay.expressions = exprs;
          console.log(exprs);
          if(lay.links && lay.links.link){
            lay.links.link.forEach(link=>{
              links.push(link);
            })
            lay.links = links;
          }
          if(lay.relates && lay.relates.relate){
            lay.relates.relate.forEach(relate=>{
              relates.push(relate);
            })
            lay.relates = relates;
          }
        })

        var spatRels = [];
        newConfig.spatialrelationships.spatialrelationship.forEach(spatRel=>{
          spatRels.push(spatRel);
        })
        newConfig.spatialrelationships = spatRels;

        var buffUnits = [];
        newConfig.bufferDefaults.bufferUnits.bufferUnit.forEach(bufferUnit=>{
          buffUnits.push(bufferUnit);
        });
        newConfig.bufferDefaults.bufferUnits = buffUnits;

        console.log(newConfig);
        return newConfig;
      }
    }];
  }

  VersionManager.prototype = new BaseVersionManager();
  VersionManager.prototype.constructor = VersionManager;
  return VersionManager;
});
