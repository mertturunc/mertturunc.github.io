/** @jsx jsx */
/**
Experience Builder Print widget.
Creator: Robert Scheitlin
License: http://www.apache.org/licenses/LICENSE-2.0
*/
import { React, AllWidgetProps, jsx, IMState, polished } from 'jimu-core';
import { Button, Select, Icon, TextInput, Label, WidgetPlaceholder, Radio } from 'jimu-ui';
import { IMConfig } from '../config';
import defaultMessages from './translations/default';
import { JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import { getStyle } from './lib/style';
import print from "esri/rest/print";
import PrintParameters from "esri/rest/support/PrintParameters";
import SpatialReference from "esri/geometry/SpatialReference"
import PrintTemplate from "esri/rest/support/PrintTemplate";
import esriRequest from "esri/request";
import MapView from "esri/views/MapView";
import { DownOutlined } from 'jimu-icons/outlined/directional/down'
import { RightOutlined } from 'jimu-icons/outlined/directional/right'
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning'
const spatialRefs = require('./cs.json')

const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right-8.svg');
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down-8.svg');
const printIcon = require('./assets/icons/icon.svg');

interface ExtraProps{
  pSearchData: any
}

interface State {
  jimuMapView: JimuMapView,
  printTitle: string,
  layoutChoiceList: [],
  formatChoiceList: [],
  selectedLayout: "map-only"|"a3-landscape"|"a3-portrait"|"a4-landscape"|"a4-portrait"|"letter-ansi-a-landscape"|"letter-ansi-a-portrait"|"tabloid-ansi-b-landscape"|"tabloid-ansi-b-portrait",
  selectedFormat: "pdf"|"png32"|"png8"|"jpg"|"gif"|"eps"|"svg"|"svgz",
  author: string,
  copyright: string,
  advPrintOptsOpen: boolean,
  showTitle: boolean,
  resultListCnt: number,
  printRequestComplete: boolean,
  showClearPrints: boolean,
  preserveMapScale: boolean,
  preserveMapExtent: boolean,
  forceScale: boolean,
  forceScaleValue: string,
  outputWKID: number,
  validWKID: boolean,
  cName: string,
  SBUnit: "Miles" | "Kilometers" | "Meters" | "Feet"
}

export default class Widget extends React.PureComponent<AllWidgetProps<IMConfig> & ExtraProps, State>{
  static mapExtraStateProps = (state: IMState, ownProps: AllWidgetProps<IMConfig>): ExtraProps => {
    let wId: string;
    for (const [key, value] of Object.entries(state.widgetsState)) {
      if(value.pSearchData){
        wId = key;
      }
    }
    return {
      pSearchData: state.widgetsState[wId]?.pSearchData
    }
  }

  printDivRef: React.RefObject<HTMLDivElement> = React.createRef();
  printparams: PrintParameters;
  fileHandle;
  resultListRecords = [];
  constructor(props) {
    super(props);
    const {config} = this.props;
    this.state = {
      jimuMapView: undefined,
      printTitle: config.defaultTitle,
      layoutChoiceList: [],
      formatChoiceList: [],
      selectedLayout: config.defaultLayout,
      selectedFormat: config.defaultFormat,
      author: config.defaultAuthor,
      copyright: config.defaultCopyright,
      advPrintOptsOpen: false,
      showTitle: true,
      resultListCnt: 0,
      printRequestComplete: false,
      showClearPrints: false,
      preserveMapExtent: true,
      preserveMapScale: false,
      forceScale: false,
      forceScaleValue: null,
      outputWKID: null,
      validWKID: true,
      cName: '',
      SBUnit: 'Miles'
    };
    this.printparams = new PrintParameters();
    this.resultListRecords = [];
  }

  nls = (id: string) => {
    return this.props.intl ? this.props.intl.formatMessage({ id: id, defaultMessage: defaultMessages[id] }) : id;
  }

  activeViewChangeHandler = (jimuMapView: JimuMapView) => {
    //Async errors
    if (null === jimuMapView || undefined === jimuMapView) {
      this.setState({ jimuMapView: null });
      return; //skip null
    }
    this.setState({
      jimuMapView: jimuMapView,
      outputWKID: jimuMapView.view.spatialReference.wkid,
      cName: this.getSRLabel(jimuMapView.view.spatialReference.wkid)
    });
    jimuMapView.whenJimuMapViewLoaded().then(()=>{
      this.printparams.view = jimuMapView.view as MapView;
      this.printparams.outSpatialReference = this.state.jimuMapView.view.spatialReference;
    });
  }

  componentDidMount() {
    const {config} = this.props;
    esriRequest(config.serviceURL, {
      responseType: "json",
      query: {
        f: 'json'
      },
      timeout: 10000,
      useProxy: false}
    ).then(results=>{
      let printJSON = results.data;
      printJSON.parameters.map(param=>{
        if(param.name === 'Format'){
          this.setState({formatChoiceList: param.choiceList})
        }
        if(param.name === 'Layout_Template'){
          this.setState({layoutChoiceList: param.choiceList})
        }
      });
    });
  }

  mapTitleChange = (evt) => {
    const value = evt?.target?.value
    this.setState({printTitle: value});
  }

  handleOnLayoutChange = (evt) => {
    const value = evt?.target?.value
    if(value === 'MAP_ONLY'){
      this.setState({showTitle: false, selectedLayout: value});
    }else{
      this.setState({showTitle: true, selectedLayout: value});
    }
  }

  handleOnFormatChange = (evt) => {
    const value = evt?.target?.value
    this.setState({selectedFormat: value});
  }

  getLayoutOptions = (): JSX.Element[] => {
    const optionsArray = [];
    this.state.layoutChoiceList.map((val, index) =>{
      optionsArray.push(<option key={index} value={val}>{val}</option>);
    });
    return optionsArray;
  }

  getFormatOptions = (): JSX.Element[] => {
    const optionsArray = [];
    this.state.formatChoiceList.map((val, index) =>{
      optionsArray.push(<option key={index} value={val}>{val}</option>);
    });
    return optionsArray;
  }

  getSBUnitOptions = (): JSX.Element[] => {
    const optionsArray = [];
    optionsArray.push(<option key="0" value='Miles'>{'Miles'}</option>);
    optionsArray.push(<option key="1" value='Kilometers'>{'Kilometers'}</option>);
    optionsArray.push(<option key="2" value='Meters'>{'Meters'}</option>);
    optionsArray.push(<option key="3" value='Feet'>{'Feet'}</option>);
    return optionsArray;
  }

  printClick = (evt) => {
    const {config} = this.props;
    this.setState({printRequestComplete: false});
    const {selectedLayout, selectedFormat, printTitle, author, copyright} = this.state;
    var template = new PrintTemplate();
    template.format = selectedFormat;
    template.layout = selectedLayout;
    template.scalePreserved = this.state.preserveMapScale || this.state.forceScale;
    template.attributionVisible = false;
    template.layoutOptions = {
      titleText: printTitle,
      authorText: author,
      copyrightText: copyright,
      customTextElements: this.props.pSearchData,
      scalebarUnit: this.state.SBUnit
    }
    if(this.state.forceScale){
      template.outScale = parseFloat(this.state.forceScaleValue);
    }
    this.printparams.template = template;
    this.printparams.outSpatialReference = undefined;
    if (this.isValidWkid(this.state.outputWKID) && this.state.outputWKID !== this.state.jimuMapView.view.spatialReference.wkid) {
      this.printparams.outSpatialReference = new SpatialReference({wkid:this.state.outputWKID});
    }
    this.fileHandle = print.execute(config.serviceURL, this.printparams,{useProxy: false});
    this.resultListRecords.push({
      format: template.format,
      title: printTitle,
      url: '',
      error: false,
      alttitle: printTitle
    });
    this.setState({resultListCnt: this.state.resultListCnt + 1}, ()=>{
      if(this.state.resultListCnt > 0){
        this.setState({showClearPrints: true});
      }
    });
    this.fileHandle.then(result=>{
      this.resultListRecords[this.state.resultListCnt - 1].url = result.url;
      this.setState({printRequestComplete: true});
    }, error=>{
      this.resultListRecords[this.state.resultListCnt - 1].error = true;
      this.setState({printRequestComplete: true});
    });
  }

  authorChanged = (evt) => {
    const value = evt?.target?.value
    this.setState({author: value});
  }

  copyrightChanged = (evt) => {
    const value = evt?.target?.value
    this.setState({copyright: value});
  }

  openAdvPrintOpts = () => {
    this.setState({advPrintOptsOpen: !this.state.advPrintOptsOpen});
  }

  clearPrintsHandler = (evt) => {
    evt.preventDefault();
    this.resultListRecords = [];
    this.setState({showClearPrints: false});
    this.setState({resultListCnt: 0});
  }

  updateFileNames = (arr) => {
    var arr1 = new Array();
    for (var r in arr){
      if(arr1.find(t => t.title === arr[r].title) !== undefined){
        var ind=1;
        while(arr1.find(t => t.title === arr[r].title + '(' + ind + ')') !== undefined){
          ind++;
        }
        var str = arr[r].title + '(' + ind + ')';
        arr[r].title = str;
        arr1.push(arr[r]);
      }else{
        arr1.push(arr[r]);
      }
    }
    return arr1;
  }

  getPrintResults = (): JSX.Element[] => {
    const resultsArray = [];
    this.resultListRecords = this.updateFileNames(this.resultListRecords);
    this.resultListRecords.map((r, i)=>{
      let rFileExt:string = '';
      switch (r.format) {
        case 'PDF':
          rFileExt = 'pdf'
          break;
        case 'PNG32', 'PNG8':
          rFileExt = 'png'
          break;
        case 'JPG':
          rFileExt = 'jpg'
          break;
        case 'GIF':
          rFileExt = 'gif'
          break;
        case 'EPS':
          rFileExt = 'eps'
          break;
        case 'SVG':
          rFileExt = 'svg'
          break;
        case 'SVGZ':
          rFileExt = 'svgz'
          break;
        case 'AIX':
          rFileExt = 'aix'
          break;
        default:
          rFileExt = 'pdf'
      }
      let rFileName:string = r.title + "." + rFileExt;
      
      let iconClassName: string;
      if(r.url===''){
        iconClassName = 'esri-icon-loading-indicator esri-rotating';
      }else{
        iconClassName = 'esri-icon-launch-link-external';
      }
      if(r.error){
        iconClassName = 'esri-icon-error esri-print__exported-file--error';
      }
      
      resultsArray.push(
        <div aria-label="Open this" className="esri-print__exported-file" title={r.error?this.nls('printError'):''}>
          <a aria-label={rFileName + ". Open in new window."} download={rFileName} rel="noreferrer" target="_blank"
            className={`esri-widget__anchor esri-print__exported-file-link${r.url===''?' esri-widget__anchor--disabled':''}`} href={r.url}>
            <span className={iconClassName}></span>
            <span className={`esri-print__exported-file-link-title${r.error?' esri-print__exported-file--error':''}`}>{rFileName}</span>
          </a>
        </div>
      );
    });
    if(resultsArray.length === 0){
      resultsArray.push(
        <div>{this.nls('printMessage')}</div>
      );
    }
    return resultsArray;
  }

  onRadioChange = (which:string) => {
    if(which === 'scale'){
      this.setState({preserveMapScale: true, preserveMapExtent: false, forceScale: false})
    }else if(which === 'extent'){
      this.setState({preserveMapScale: false, preserveMapExtent: true, forceScale: false})
    }else{
      this.setState({preserveMapScale: false, preserveMapExtent: false, forceScale: true})
    }
  }

  forceScaleChanged = (evt) => {
    const value = evt?.target?.value
    this.setState({preserveMapScale: false, preserveMapExtent: false, forceScale: true, forceScaleValue: value})
  }

  SBUnitChanged = (evt) => {
    const value = evt?.target?.value
    this.setState({SBUnit: value});
  }

  getCurrentMapScale = (evt) => {
    evt?.preventDefault();
    this.setState({
      forceScale: true, preserveMapScale: false, preserveMapExtent: false,
      forceScaleValue: this.state.jimuMapView.view.scale.toFixed(3)
    })
  }

  getSRLabel = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var i = this.indexOfWkid(wkid);
      return spatialRefs.labels[i].toString().replace(/_/g, ' ');
    }
  }

  indexOfWkid = function(wkid) {
    return spatialRefs.wkids.indexOf(wkid);
  }

  isGeographicCS = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var pos = this.indexOfWkid(wkid);
      return !spatialRefs.projSR[pos];
    }
    return false;
  }

  isProjectedCS = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var pos = this.indexOfWkid(wkid);
      return spatialRefs.projSR[pos];
    }
    return false;
  }

  wkidChange = (event) => {
    const value = event.target.value
    let isValid:boolean = true
    let cName:string = this.state.cName
    const newWkid = parseInt(value, 10)
    if(value !== '' && value.toString().length >= 4){
      isValid = this.isValidWkid(newWkid)
      if(isValid){
        cName = this.getSRLabel(newWkid)
      }
    }
    this.setState({
      outputWKID: value,
      validWKID: isValid,
      cName: cName
    })
  }

  isValidWkid = function(wkid) {
    return this.indexOfWkid(wkid) > -1;
  }

  wkidAccept = (value) => {
    value = value?.trim()
    value = value || ''
    const newWkid = parseInt(value, 10)
    if (value !== this.state.outputWKID) {
      this.setState({ outputWKID: value })
    }
  }

  render(){
    let content = null;
    const useMapWidget = this.props.useMapWidgetIds &&
                        this.props.useMapWidgetIds[0]
    const {advPrintOptsOpen, outputWKID, showTitle, selectedLayout, selectedFormat, validWKID, cName} = this.state;
    const {config} = this.props;

    if (!useMapWidget) {
      content = (
        <div className='widget-print'>
          <WidgetPlaceholder icon={printIcon} autoFlip message={this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: defaultMessages._widgetLabel })} widgetId={this.props.id} />
        </div>
      )
    } else {
      content = (
      <div className='widget-print'>
        {useMapWidget && (
            <JimuMapViewComponent
              useMapWidgetId={this.props.useMapWidgetIds?.[0]}
              onActiveViewChange={this.activeViewChangeHandler}
            />
        )}
        {showTitle &&
          <div className='d-flex align-items-center m-2' style={{columnGap:'10px'}}>
            <div style={{flex: '0 0 auto'}}>{this.nls('printTitle')+': '}</div>
            <TextInput style={{flex: '1 1 auto'}} value={this.state.printTitle} onChange={this.mapTitleChange}></TextInput>
          </div>
        }
        <div className='d-flex align-items-center m-2' style={{columnGap:'10px'}}>
          <div style={{flex: '0 0 auto'}}>{this.nls('layout')+': '}</div>
          <Select style={{display:'inline-block', width:'calc(100% -70px)'}} onChange={this.handleOnLayoutChange}
            className="top-drop" value={selectedLayout}>
            {this.getLayoutOptions()}
          </Select>
        </div>
        <div className='d-flex align-items-center m-2' style={{columnGap:'10px'}}>
          <div style={{flex: '0 0 auto'}}>{this.nls('format')+': '}</div>
          <Select style={{display:'inline-block', width:'calc(100% -70px)'}} onChange={this.handleOnFormatChange}
            className="top-drop" value={selectedFormat}>
            {this.getFormatOptions()}
          </Select>
        </div>
        <div className={'d-flex m-2 flex-column'}>
          <Button style={{textAlign: 'left'}} type='secondary' onClick={this.openAdvPrintOpts}>
            {advPrintOptsOpen ? <RightOutlined autoFlip size='m' /> : <DownOutlined autoFlip size='m' />}
            {this.nls('advPrintOptions')}
          </Button>
        </div>
        {advPrintOptsOpen &&
          <div className={'m-4'}>
            <div style={{fontWeight: 'bold'}}>{this.nls('scaleextent')}</div>
            <div className='align-items-center d-flex my-1'>
              <span className='mr-4'>{this.nls('preserve')+':'}</span>
              <div>
                <div className='d-flex align-items-center'>
                  <Radio id='scale'
                    style={{ cursor: 'pointer' }} checked={this.state.preserveMapScale}
                    onChange={e => this.onRadioChange('scale')}
                  />
                  <Label className='m-0 ml-2 content-title' style={{ cursor: 'pointer' }} for='scale'>{this.nls('mapscale')}</Label>
                </div>
                <div className='d-flex align-items-center'>
                  <Radio id='extent'
                    style={{ cursor: 'pointer' }} checked={this.state.preserveMapExtent}
                    onChange={e => this.onRadioChange('extent')}
                  />
                  <Label className='m-0 ml-2 content-title' style={{ cursor: 'pointer' }} for='extent'>{this.nls('mapextent')}</Label>
                </div>
              </div>
            </div>
            <div className='align-items-center d-flex my-1'>
              <span className='mr-4'>{this.nls('forcescale')+':'}</span>
              <div>
                <div className='d-flex align-items-center' style={{columnGap:'10px'}}>
                  <Radio id='force'
                    style={{ cursor: 'pointer' }} checked={this.state.forceScale}
                    onChange={e => this.onRadioChange('force')}
                  />
                  <TextInput value={this.state.forceScaleValue} onChange={this.forceScaleChanged}></TextInput>
                  <div className='d-flex justify-content-end flex-grow-1'>
                    <a onClick={this.getCurrentMapScale} href="#">{this.nls('current')}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-2' style={{fontWeight: 'bold'}}>{this.nls('outSR')+':'}</div>
            <div>
              <TextInput
                  size='sm'
                  type='text' className='w-100'
                  value={outputWKID}
                  onChange={this.wkidChange}
                  onAcceptValue={this.wkidAccept}
                  aria-label={this.nls('wkid')}
                />
                {validWKID &&
                  <div className='text-break'>
                    <i style={{ fontSize: polished.rem(10), color: this.props.theme.colors?.palette?.dark[500] }}>{cName}</i>
                  </div>
                }
                {!validWKID &&
                  <div className='d-flex w-100 align-items-center justify-content-between mt-1'>
                    <WarningOutlined size={16} color={this.props.theme.colors?.palette?.danger[500]}/>
                    <div
                      style={{
                        width: 'calc(100% - 20px)',
                        margin: '0 4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: this.props.theme.colors?.palette?.danger[500],
                        fontWeight: 'bold'
                      }}>
                      {this.nls('invalidWKID')}
                    </div>
                  </div>
                }
            </div>
            <div className='mt-2' style={{fontWeight: 'bold'}}>{this.nls('layoutmeta')+':'}</div>
            <div className='d-flex align-items-center mt-2' style={{columnGap:'10px'}}>
              <div style={{flex:'0 0 auto'}}>{this.nls('author')+':'}</div>
              <TextInput style={{flex:'1 1 auto'}} value={this.state.author} onChange={this.authorChanged}></TextInput>
            </div>
            <div className='d-flex align-items-center mt-2' style={{columnGap:'10px'}}>
              <div style={{flex:'0 0 auto'}}>{this.nls('copyright')+':'}</div>
              <TextInput style={{flex:'1 1 auto'}} value={this.state.copyright} onChange={this.copyrightChanged}></TextInput>
            </div>
            <div className='d-flex align-items-center mt-2' style={{columnGap:'10px'}}>
              <div style={{flex:'0 0 auto'}}>{this.nls('Scale bar unit')+':'}</div>
              <Select className="top-drop" onChange={this.SBUnitChanged} useFirstOption={true}>
                {this.getSBUnitOptions()}
              </Select>
            </div>
          </div>
        }
        <div className={'d-flex m-2'}>
          <div style={{flexGrow: 1}}></div>
          <div>
            <Button type="primary" onClick={e=>{this.printClick(e)}}><Icon icon={printIcon} color={'#ffffff'}></Icon>{this.nls('print')}</Button>
          </div>
        </div>
        <div className="esri-print__export-panel-container m-2" style={{position: 'relative'}}>
          <h3 className="esri-print__export-title esri-widget__heading">Printed files</h3>
          <a style={{position:'absolute', top:'14px', right: '10px', display: this.state.showClearPrints ? "block" : "none"}}
            onClick={(e) => this.clearPrintsHandler(e)}
            href="#">{this.nls('clear')}</a>
          {this.getPrintResults()}
        </div>
      </div>
      )
    }
    return <div className="widget-print jimu-widget" css={getStyle(this.props.theme, config)}>
      {content}
    </div>
  }
}
