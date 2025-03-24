import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserBase} from '../application-user.base.model';
import { Directive, EventEmitter, Input, Output, SecurityContext, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChangeLogsComponent } from '@libsrc/change-logs/change-logs.component';

import { ApplicationUserApiConstants } from '@baseapp/application-user/application-user/application-user.api-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@libsrc/confirmation/confirmation-popup.component';
import { FormControl, FormGroup, Validators, AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { GridComponent } from '@libsrc/grid/grid.component';
import { environment } from '@env/environment';
import { distinctUntilChanged, switchMap, Observable, Subject, debounceTime, fromEvent, catchError, combineLatest, of, Observer, forkJoin, Subscription, map } from 'rxjs';
import { Location } from '@angular/common';
import { Filter } from '@baseapp/vs-models/filter.model';
import { BaseService } from '@baseapp/base.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService, DynamicDialogConfig]
}
)
export class ApplicationUserListBaseComponent{
	
	showGrid:boolean = true;



	isSearchFocused:boolean = false;
showBreadcrumb = AppConstants.showBreadcrumb;
mappedFiltersDisplay:any ={};
tooltipText:string =''


		
showAdvancedSearch: boolean = false;
typingDelay = 1500; 
isSearchActive = false; 
typingTimer: any; 
advancedSearchValue: any; 

tableSearchFieldConfig:any = {};
@ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;
 filtersApplied:boolean = false;


	quickFilter: any;
hiddenFields:any = {};
quickFilterFieldConfig:any={}

		  selectedValues: any[] = [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
params: any;
isMobile: boolean = AppConstants.isMobile;
combinedActionConfig:any =[];

  gridData: ApplicationUserBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
 multiSortMeta:any =[];
 selectedColumns:any =[];
subHeader: any;
  autoSuggest: any;
  query: any;

rightFreezeColums:any;
total:number =0;
inValidFields:any = {};
selectedItems:any ={};
scrollTop:number =0;
isRowSelected: boolean = false;
isPrototype = environment.prototype;
  workFlowEnabled = false;
isList = true;
isPageLoading:boolean = false;
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
localStorageStateKey = "application-user-list";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
filterActions: any = {
  hideActions: []
}
isRCWorkflowChosen: boolean = false;

actionBarConfig:any =[];
first: number =0;
rows: number = 0;
updatedRecords:ApplicationUserBase[] = [];
showPaginationOnTop = AppConstants.showPaginationonTop;
 showPaginationOnBottom = AppConstants.showPaginationonBottom;
 tableFieldConfig:any ={};
dateFormat: string = AppConstants.calDateFormat;
selectedRowId: any = '';
 showWorkflowSimulator:boolean = false;
 gridConfig: any = {};
  @ViewChild(GridComponent)
  public gridComponent: any = GridComponent;
separator = "__";
timeFormatPrimeNG: string = AppConstants.timeFormatPrimeNG;
dateFormatPrimeNG: string = AppConstants.dateFormatPrimeNG ;
minFraction = AppConstants.minFraction;
maxFraction = AppConstants.maxFraction;
currency = AppConstants.currency;
currencyDisplay = AppConstants.currencyDisplay;
 responseData:any =[];
defaultActions= ['save','cancel','delete','activate','deactivate','refresh','back','changelog','workflowhistory','import','export','new'];
queryViewList:boolean = false; // dynamic Variable has to be updated here
showonFilter:boolean = false;
selectedRows:any =[];
@Input() filters:any ={};
@Input() componentId:string ='';
@Input() mapData:any ={};
@Input() dynamicDialogConfigFromDetailPage: any = {};
priorGridParams:any ={};
queryViewFiltersApplied: boolean = false;
 gridEmptyMsg: string = '';
holdFilters:string[] =[];
defaultFilters:string[]=[];
defaultFilterSettings:any={};
@Input() mapConfig:any = {};
filtersFromParent:any ={};
hasMappedParameters:boolean = false;
@Input() existingFormDataFromParent:any = {};
@Input() existingFormId:string ='';
@Input() fromDetailPage:boolean = false;
@Output() onBeforeValidationEmitter: EventEmitter<any> = new EventEmitter();
globalStorageKey:string ="";
currentPaginationStart:any;
@Input() standardGrid:boolean = false;
@Input() pageIdentifier:string ="";
restorefilters:boolean = false;
currentUserInfo:any;
@Input() metaData?:any ={};

	isChildPage:boolean = false;
	queryViewNotAllowedActions:any = [];
	componentMapping: { [key: string]: any } = {
	};
	
	leftActionBarConfig : any = {
  "children" : [ {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-arrow-left",
        "value" : "fas fa-arrow-left"
      }
    },
    "confirmationText" : "confirm",
    "label" : "BACK",
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_on_left",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "BackbuttonId0",
    "buttonEnabled" : "yes",
    "action" : "back",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "confirmationText" : "confirm",
    "label" : "NEW",
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_on_left",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "NewbuttonId1",
    "buttonEnabled" : "yes",
    "action" : "new",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-trash-alt",
        "value" : "fas fa-trash-alt"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "DELETE",
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_only",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "DeletebuttonId2",
    "buttonEnabled" : "yes",
    "action" : "delete",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  }, {
    "visibility" : "show",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-sync",
        "value" : "fas fa-sync"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "confirmationText" : "confirm",
    "label" : "REFRESH",
    "type" : "button",
    "beforeAction" : "none",
    "detailPagePopupWidth" : 70,
    "outline" : false,
    "buttonType" : "icon_only",
    "showOn" : "both",
    "enableOnlyIfRecordSelected" : false,
    "buttonId" : "RefreshbuttonId3",
    "buttonEnabled" : "yes",
    "action" : "refresh",
    "confirmationTitle" : "confirmation",
    "fields" : [ ],
    "confirmationButtonText" : "yes",
    "cancelButtonText" : "no"
  } ],
  "type" : "actionBar"
}
	rightActionBarConfig : any = {
  "type" : "actionBar"
}
	tableSearchConfig : any = {
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ {
    "fieldName" : "email",
    "data" : "",
    "field" : "email",
    "name" : "email",
    "uiType" : "email",
    "isQueryView" : false,
    "isPrimaryKey" : true,
    "label" : "EMAIL",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "fieldName" : "firstName",
    "data" : "",
    "field" : "firstName",
    "name" : "firstName",
    "uiType" : "text",
    "isQueryView" : false,
    "isPrimaryKey" : false,
    "label" : "FIRST_NAME",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "fieldName" : "lastName",
    "data" : "",
    "field" : "lastName",
    "name" : "lastName",
    "uiType" : "text",
    "isQueryView" : false,
    "isPrimaryKey" : false,
    "label" : "LAST_NAME",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "lastName"
  } ],
  "columns" : "1",
  "type" : "tableSearch",
  "showAdvancedSearch" : true,
  "queryViewMapping" : { }
}
	quickFilterConfig : any = {
  "detailPagePopupWidth" : 70,
  "outline" : false,
  "disabledFieldsByLookup" : [ ],
  "children" : [ ],
  "type" : "quickFilter",
  "queryViewMapping" : { }
}
	defaultFilterConfig : any = {
  "children" : [ ]
}
	customRenderConfig : any = {
  "children" : [
     ]
}
	tableConfig : any = {
  "rightFreezeFromColumn" : "0",
  "columnReorder" : false,
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "rowGroup" : "no",
  "outline" : false,
  "children" : [ {
    "fieldName" : "email",
    "data" : "",
    "formatDisplay" : false,
    "isQueryView" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : true,
    "label" : "EMAIL",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "NEW",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "email",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "email",
    "uiType" : "email",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "fieldName" : "firstName",
    "data" : "",
    "formatDisplay" : false,
    "isQueryView" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "FIRST_NAME",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "NEW",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "firstName",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "firstName",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "fieldName" : "lastName",
    "data" : "",
    "formatDisplay" : false,
    "isQueryView" : false,
    "enableRecordCreation" : false,
    "showOnMobile" : false,
    "isPrimaryKey" : false,
    "label" : "LAST_NAME",
    "showDetailPageAs" : "as_a_popup",
    "type" : "gridColumn",
    "createButtonLabel" : "NEW",
    "showLabel" : false,
    "detailPagePopupWidth" : 70,
    "field" : "lastName",
    "labelPosition" : "top",
    "tooltipMessage" : "",
    "name" : "lastName",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "lastName"
  } ],
  "toggleColumns" : false,
  "sorting" : "single_column",
  "rowSpacing" : "medium",
  "rowHeight" : "medium",
  "striped" : true,
  "recordSelection" : "multiple_records",
  "inlineEditing" : false,
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_2",
  "detailPagePopupWidth" : 70,
  "pageLimit" : "50",
  "leftFreezeUptoColumn" : "0",
  "runtimeWorkflowEnabled" : false,
  "rememberLastTableSettings" : false,
  "columnResize" : false,
  "showGridlines" : false,
  "sortOrder" : "asc",
  "detailPageNavigation" : "click_of_the_row",
  "tableId" : "0e796219-12ba-45ab-91c8-f1fef279f6b2"
}
	pageViewTitle: string = 'APPLICATION_USER_LIST';
	
	public applicationUserService = inject(ApplicationUserService);
public appUtilBaseService = inject(AppUtilBaseService);
public translateService = inject(TranslateService);
public messageService = inject(MessageService);
public confirmationService = inject(ConfirmationService);
public dialogService = inject(DialogService);
public domSanitizer = inject(DomSanitizer);
public activatedRoute = inject(ActivatedRoute);
public renderer2 = inject(Renderer2);
public router = inject(Router);
public appGlobalService = inject(AppGlobalService);
public baseService = inject(BaseService);
public location = inject(Location);
		tableSearchControls : UntypedFormGroup = new UntypedFormGroup({
	lastName: new UntypedFormControl('',[]),
	firstName: new UntypedFormControl('',[]),
	email: new UntypedFormControl('',[]),
});

		quickFilterControls : UntypedFormGroup = new UntypedFormGroup({
});


	actionBarAction(btn: any) {
    let methodName: any = btn.methodName ? btn.methodName : (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
   const config = this.getButtonConfig(btn);
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
else if(this.defaultActions.includes(btn.action) && typeof this[action] === "function"){
      this[action]();
    }
    else if (typeof this[action] === "function" && (btn.beforeAction ==='show_confirmation' || btn.beforeAction === 'get_additional_info')) {
      this.showConfirmationPopup(config,btn);
    }
    else if (typeof this[action] === "function"){
      this[action]();
    }
  }

  showConfirmationPopup(config: any, btn: any) {
     const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
    const confirmationReference = this.dialogService.open(ConfirmationPopupComponent, {
      header: config.confirmationTitle,
      width: '30%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      styleClass: "confirm-popup-modal",
      showHeader: true,
      closable: true,
      data: {
        config: config,
      }
    });
    confirmationReference.onClose.subscribe((result: any) => {
      if (result) {
        if (typeof this[action] === "function") {
          this[action](result);
        }
      }
    })
  }
	onRefresh(fromDelete?:boolean,fromFilters?:boolean): void {
    const fromDel = fromDelete || false;
    const params = this.assignTableParams();
    this.toShowRecords(params);
    if(this.mapConfig[this.componentId]?.length > 0){
      const NeedRefresh = this.hasMappedParameters || fromFilters;
       if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel,NeedRefresh);
      }
    }
    else{
       if (this.gridComponent && 'refreshGrid' in this.gridComponent) {
        this.gridComponent.refreshGrid(params, fromDel);
      }
    }
    this.selectedValues =[];
    this.priorGridParams.search = params.search;
    this.priorGridParams.mapper = params.mapper;
  }
	onBack(){
this.location.back();
}
	enableChildOptions(){
	}
	quickFilterApplied: boolean = false;

	filterSearch() {
    this.quickFilterControls.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      if (!this.appUtilBaseService.isEqualIgnoreCase(this.quickFilterControls.getRawValue(), this.filter.quickFilter, [], true)) {
        let filterVals = { ...this.quickFilterControls.getRawValue() };

        const hasDates = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
        );

        if (hasDates.length > 0) {
          this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue());
        }

        const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
        );

        if (hasNumbers.length > 0) {
          this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
        }

        this.filter.quickFilter = filterVals;
        this.quickFilterApplied = this.appUtilBaseService.hasAtleastOneValidValue(filterVals);

        //if(this.quickFilterControls.dirty)
        this.onRefresh(false,true);
      }
    });
  }

handleDateFields(hasDates: any[], filterVals: any, value: any, fromDefault?:boolean) {
    hasDates.forEach((f: any) => {
      const field = fromDefault ? f?.listField : f.name;
      const dateVal = fromDefault ? value[f?.detailField] : value[field];
      let val: any = {};

      if (!dateVal) {
        delete filterVals[field];
        return;
      }

      const findUiType = (field: any) => {
        const found = hasDates.find(item => item.listField === field && item.uiType =='date');
        return found ? found.uiType : null;
      };

      if (Array.isArray(dateVal)) {
        val = this.getDateRangeVal(field, dateVal);
        filterVals[field] = val;

        if (dateVal[0] == null && dateVal[1] == null) {
          delete filterVals[field];
        }
      } else if (typeof dateVal === 'object') {
        if (this.quickFilterFieldConfig[field]?.uiType === 'date' || findUiType(field)) {
          let tempDate1 = null;
          let tempDate2 = null;
          const createDate = (dateValue: any, isEndOfDay: boolean) => {
            if (dateValue !== undefined && dateValue !== null) {
              const tempDate = new Date(dateValue);
              if (isEndOfDay) {
                tempDate.setHours(23, 59, 59, 999); // Set to end of day
              } else {
                tempDate.setHours(0, 0, 0, 0); // Set to midnight
              }
              return tempDate;
            }
            return null;
          };
          tempDate1 = createDate(dateVal.hasOwnProperty('min') ? dateVal.min : dateVal, false);
          tempDate2 = createDate(dateVal.hasOwnProperty('max') ? dateVal.max : dateVal, true);
          if(this.queryViewList){
            if (dateVal !== undefined && dateVal !== null) { 
              const convertedDate1 = this.convertDateToString(dateVal);
              val = convertedDate1
            }
          }
          else{
            val = {
              lLimit: tempDate1 ? tempDate1.getTime() : null,
              uLimit: tempDate2 ? tempDate2.getTime() : null,
              type: "Date"
            };
          }
        } else {
          if(fromDefault){
            val = { lLimit: null, uLimit: dateVal ? new Date(dateVal).getTime() : null, type: "Date" };
            if(this.queryViewList){
              val = new Date(dateVal).getTime();
            }
          }
          else{
            val = { lLimit: new Date(dateVal.min).getTime(), uLimit: dateVal.max ? new Date(dateVal.max).getTime() : null, type: "Date" };
            if(this.queryViewList){
              val = new Date(dateVal).getTime();
            }
          }
        }
        if (val.lLimit || val.uLimit || this.queryViewList) {
          filterVals[field] = val;
        }
        if (!val.lLimit && !val.uLimit && !this.queryViewList) {
          delete filterVals[field];
        }
      }
    });
  }

handleNumberFields(hasNumbers: any[], filterVals: any, value: any) {
  hasNumbers.forEach((f: any) => {
     const field = f.name || f?.detailField;
      const numberValue = value[field];

      if (numberValue && typeof numberValue === 'object' && !Array.isArray(numberValue)) {
          filterVals[field] = {
              lLimit: numberValue.min,
              uLimit: numberValue.max,
              type: "Number"
          };

          if (numberValue.min == null && numberValue.max == null) {
              delete filterVals[field];
          }
      }
  });
}

getDateRangeVal(field: any, dateVal: any[]): any {
  const tempDate1 = new Date(dateVal[0]);
  const tempDate2 = new Date(dateVal[1]);
  const convertedDate1 = this.convertDateToString(tempDate1);
  const convertedDate2 = this.convertDateToString(tempDate2);

  return this.quickFilterFieldConfig[field].uiType === 'date'
      ? { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: dateVal[1] ? new Date(convertedDate2).getTime() : null, type: "Date" }
      : { lLimit: new Date(dateVal[0]).getTime(), uLimit: dateVal[1] ? new Date(dateVal[1]).getTime() : dateVal[1], type: "Date" };
}

 convertDateToString(date: Date): string {
  return date.getFullYear() + '-' + this.leftPad((date.getMonth() + 1), 2) + '-' + this.leftPad(date.getDate(), 2);
}
  addCustomFilters(){}

scrollFilterFieldsList(position: any, event: any) {
    if (position == 'right') {
      event.target.offsetParent?.children[1]?.scrollBy(200, 0)
    } else {
      event.target.offsetParent?.children[1]?.scrollBy(-200, 0)
    }
  }

checkIfScrollbarVisible() {
    const element: any = document.getElementById(this.localStorageStateKey);
    if (element) {
      const isScrollable = element.scrollWidth > element.clientWidth;
      if (!isScrollable) { return false }
    }; 
    return true;
  }

  manipulateDefaultFilters(){
    this.defaultFilterConfig.children.forEach((ele:any)=>{
      this.defaultFilters.push(ele.field);
      ele.holdFilterValue ? this.holdFilters.push(ele.field):'';
    })
    this.defaultFilterSettings = this.appUtilBaseService.getControlsFromFormConfig(this.defaultFilterConfig);
    this.quickFilterConfig = this.appUtilBaseService.mergeConfigs(this.quickFilterConfig,this.defaultFilterConfig);
  }

         initFilterForm(fromResetQuickFilter: Boolean = false) {
    this.manipulateDefaultFilters();
    this.quickFilterFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.addCustomFilters();
    if(!fromResetQuickFilter) {
      this.filterSearch();
    }
    for (const key in this.quickFilterFieldConfig) {
      if (this.quickFilterFieldConfig.hasOwnProperty(key)) {
        const field = this.quickFilterFieldConfig[key];

        if (field.mandatory === 'yes') {
          this.quickFilterControls.get(key)?.disable();
        }
        if (this.defaultFilters.includes(key)) {
          this.setDefaultFilters(field, key);
          this.setFiltervisibility(field, key);
        }
      }
    }
    const queryViewFilters = this.filters[this.componentId];
    if(fromResetQuickFilter){
      queryViewFilters?.forEach((filter: any) => {
        const value = filter.staticValue ? filter.staticValue : (this.mapData[filter.tableField] || this.metaData[filter.tableField]);
        if(!filter.staticValue){
        const control = this.quickFilterControls.get(filter.lookupField);
        this.patchControlValue(control, value, this.quickFilterFieldConfig[filter.tableField]);
        }
      })
    }
    
      if (((this.defaultFilters?.length > 0 || queryViewFilters?.length > 0)  && !this.restorefilters) || fromResetQuickFilter) {
      let filterVals = { ...this.quickFilterControls.getRawValue() };

        const hasDates = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
        );

        if (hasDates.length > 0) {
          this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue());
        }

        const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
          e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
        );

        if (hasNumbers.length > 0) {
          this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
        }

        this.filter.quickFilter = filterVals;
        if(fromResetQuickFilter){
          this.onRefresh();
        }
      //this.quickFilterControls.updateValueAndValidity({ emitEvent: true });
    }
  }

  resolvecustomFilters(fieldconfig:any,key:string,defaultFilterSetting:any){

  }

  setDefaultFilters(field: any, key: string) {
  const control = this.quickFilterControls.get(key);
  const defaultFilterField = this.defaultFilterSettings[key];
  let defaultValue = defaultFilterField.value;

  if (defaultFilterField.operator?.toLowerCase()?.trim() === 'is empty') {
    control?.patchValue(field.multiple ? ['IS_EMPTY'] : 'IS_EMPTY');
  } else if (defaultValue) {
    this.patchControlValue(control, defaultValue,field);
  } else if (defaultFilterField.isCustom) {
    this.resolvecustomFilters(field, key, this.defaultFilterSettings);
  }
  
}

patchControlValue(control: AbstractControl | null, defaultValue: any, field: any) {
    if (control instanceof FormGroup && typeof defaultValue !== 'string') {
      if (field.uiType == 'date' || field.uiType == 'datetime') {
        if(this.queryViewList){
          control?.patchValue(new Date(defaultValue), { emitEvent: false });
        }
        else{
          control.patchValue({
            min: defaultValue[0] ? new Date(defaultValue[0]): null,
            max: defaultValue[1] ? new Date(defaultValue[1]) : null,
          }, { emitEvent: false });
        }
      } else {
        control.patchValue({
          min: defaultValue[0],
          max: defaultValue[1],
        }, { emitEvent: false });
      }
    }  
    else if(field?.uiType =='autosuggest' && this.queryViewList){
      control?.patchValue({displayField :defaultValue}, { emitEvent: false });
    }
    else if (typeof defaultValue === 'string') {
      defaultValue = this.getSpecialDateValue(defaultValue.toLowerCase(),field) || defaultValue;
      control?.patchValue(defaultValue, { emitEvent: false });
    } 
    else if(field?.fieldType == 'Date'){
      control?.patchValue(new Date(defaultValue), { emitEvent: false });
    }
     else if(typeof defaultValue === 'object' && defaultValue !== null && defaultValue?.displayField){
          control?.patchValue(defaultValue.displayField, { emitEvent: false });
     }
    else {
      control?.patchValue(defaultValue, { emitEvent: false });
    }
  }

getSpecialDateValue(value: string, config: any): { min: Date, max: Date } | Date | null {
    const now = new Date();
    if (value === 'today') {
      if (config.uiType === 'datetime') {
        const min = new Date(now.setHours(0, 0, 0, 0));
        const max = new Date(now.setHours(23, 59, 59, 999));
        if(this.queryViewList){
          return min;
        }
        else{
          return { min, max };
        }
      }
      return new Date(now.setHours(0, 0, 0, 0));
    } else if (value === 'tomorrow') {
      if (config.uiType === 'datetime') {
        const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
        if(this.queryViewList){
          return min;
        }
        else{
          return { min, max };
        }
      }
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    }
    return null;
  }

   setFiltervisibility(field: any, key: string) {
    const defaltFilterField = this.defaultFilterSettings[key];
    this.hiddenFields[key] = !defaltFilterField.viewInPages;
    if (defaltFilterField.viewInPages && defaltFilterField.editInPages) {
      this.quickFilterControls.get(key)?.enable({emitEvent:false});
    } else {
      this.quickFilterControls.get(key)?.disable({emitEvent:false});
    }
  }

showFilter(): boolean {
    const configValues = Object.values(this.quickFilterFieldConfig);
  
    // Check if quickFilterFieldConfig is empty
    if (configValues.length === 0) {
      return false;
    }
    // Check if at least one field's allowview property is true
    const result = configValues.some((field) => {
      const allowview = (field as { viewInPages?: boolean }).viewInPages;
      return allowview !== false;
    });
   
    return result;
  }

   resetQuickFilterValues() {
    this.resetNestedFormGroupDeep(this.quickFilterControls);
    this.initFilterForm(true);
  }

  resetNestedFormGroupDeep(formGroup: FormGroup) {
    if (!formGroup || !(formGroup instanceof FormGroup)) return;
  
    const resetValues = Object.keys(formGroup.controls).reduce((acc, key) => {
      const control = formGroup.get(key);
  
      if (control instanceof FormGroup) {
        // Recursively reset nested FormGroup
        this.resetNestedFormGroupDeep(control);
      } else if (control instanceof FormControl) {
        if (!this.defaultFilters.includes(key) || (this.fromDetailPage && this.queryViewList)) {
          acc[key] = null;
        }
      }
  
      return acc;
    }, {} as any);
  
    formGroup.reset(resetValues, { emitEvent: false });
  }

  onPCalendarShow() {
    setTimeout(() => {
      const timePicker = document.querySelector('.p-timepicker');
      const datePicker = document.querySelector('.p-datepicker-group-container') ;
      if (timePicker) {
          timePicker.addEventListener('click', this.preventCalendarClose.bind(this));
      }
      if (datePicker) {
        datePicker.addEventListener('click', this.preventCalendarClose.bind(this));
    }
  }, 0);
  }

  preventCalendarClose(event: Event): void {
  event.stopPropagation(); // Prevent the click from propagating and closing the overlay
}


  
  onPCalendarPanelClick(event: Event) {
    event?.stopPropagation();
  }
	calculateFormula(){
	
}
	onDelete() {
    if (this.selectedValues.length > AppConstants.threshold) {
      // Display an info message if the number of selected values exceeds the threshold
      this.translateService.get('DELETION_IS_LIMITED_TO_OPENBRACE_OPENBRACE_THRESHOLD_CLOSEBRACE_CLOSEBRACE_RECORDS_DOT_PLEASE_CHOOSE_ACCORDINGLY', { threshold: AppConstants.threshold })
      .subscribe((message: string) => {
        this.showInfoMessage(message);
      });
    } else {
      // Proceed with deletion
      if (this.selectedValues.length > 0) {
        let requestedParams: any = { ids: this.selectedValues.toString() }
        this.confirmationService.confirm({
          message: this.translateService.instant('ARE_YOU_SURE_THAT_YOU_WANT_TO_DELETE_THE_SELECTED_RECORDS_QUESTION'),
          header: this.translateService.instant('CONFIRMATION'),
          icon: 'pi pi-info-circle',
          accept: () => {
            const deleteSubscription = this.applicationUserService.delete(requestedParams).subscribe((res: any) => {
              this.showToastMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORDS_DELETED_SUCCESSFULLY') });
              requestedParams = {};
              this.selectedValues = [];
              this.isRowSelected = false;
              this.actionButtonEnableDisable();
              this.onRefresh(true);

            });
            this.subscriptions.push(deleteSubscription);

          },
          reject: () => {
            
          },
        });
      }
    }
  }
	loadGridData() {
    let gridSubscription: any;
    if (environment.prototype && this.tableConfig.children?.length > 0) {
      gridSubscription = this.applicationUserService.getProtoTypingData().subscribe((data: any) => {
        this.gridData = [...this.gridData, ...data];
        this.isPageLoading = false;
      });
    }
    else {
      this.gridData = []
    }
}
	mapFields(mapper: any, keys: any, mapData: any, metaData: any, sourceField: string, targetField: string, hasMapper ?:boolean): void {
    let value = '';
    keys?.forEach((key: { [x: string]: string | number; }) => {
      if (key.uiType == 'autosuggest' || (typeof mapData[key[sourceField]] === 'object' && mapData[key[sourceField]]?.referenceField)) {
          mapper[key[targetField]] = mapData[key['parentField']] || mapData[key[sourceField]]?.referenceField;
      }
      else if (key.fieldType == 'Boolean' || key.uiType =='checkbox') {
        mapper[key[targetField]] = mapData[key[sourceField]] ? mapData[key[sourceField]] : false;
      }
       else {
        if (mapData[key[sourceField]] || metaData[key[sourceField]]){
          const srcField:any = key['sourceField']
          if(!hasMapper && !this.quickFilterControls.get(srcField)?.value){
            return;
          }else{
            mapper[key[targetField]] = mapData[key[sourceField]] || metaData[key[sourceField]];
          }
        }   
      }
    });
  
    const hasDates = keys?.filter((e: any) =>
      e.fieldType?.toLowerCase() === "date" || e.fieldType?.toLowerCase() === "datetime"
    );
  
    if (hasDates?.length > 0) {
      this.handleDateFields(hasDates, mapper, mapData, hasMapper);
    }
  
    const hasNumbers = keys?.filter((e: any) =>
      e.fieldType?.toLowerCase() === "number" || e.fieldType?.toLowerCase() === "double"
    );
  
    if (hasNumbers?.length > 0) {
      this.handleNumberFields(hasNumbers, mapper, mapData);
    }
  
  }


    getDefaultFilterValues(fromSearch: boolean): any {
    // Process filters
    let searchData: any = {};
    let mapper: any = {};
    if (fromSearch) {
      if (this.filters[this.componentId]) {
        this.mapFields(searchData, this.filters[this.componentId], this.mapData, this.metaData, 'tableField', 'lookupField');
      }
    }
    else {
      // Process mapConfig
      if (this.mapConfig[this.componentId]) {
        this.mapFields(mapper, this.mapConfig[this.componentId], this.mapData, this.metaData, 'detailField', 'listField',true);
      }
    }
    return { searchData: searchData, mapper: mapper } || {};
  }

openPopup(sid?: any, parentId?: any, queryParams?: any,component?:any, col?:any) {
    const dynamicDialogRef = this.dialogService.open(component, {
    showHeader: true,
    closable: false,
    position: "top",
    closeOnEscape: false,
    width: col?.detailPagePopupWidth ? col.detailPagePopupWidth + ''?.trim() + '%': '70%',
    data: { popup: true, id: queryParams['id'], pid: parentId, queryParams: queryParams },
      styleClass: 'detail-page-as-popup-container'
    });
    if (!environment.prototype) {
        const detailPopupSubscription = dynamicDialogRef.onClose.subscribe((_data: any) => {
    this.onRefresh();
    });
      this.subscriptions.push(detailPopupSubscription);
    }
}

  populateDataFields(data: any, searchFields: any, config: any, filterKeys: boolean): void {
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && (searchFields[key]?.toString().length || this.queryViewList)) {
      // If it is queryview, default filters will be considered as search not mapper
         const isDefaultFilter = this.defaultFilters.includes(key) && !this.queryViewList;
        if (filterKeys && !isDefaultFilter) continue;
        if (!filterKeys && isDefaultFilter) continue;
  
        if (config[key].uiType === 'autosuggest') {
          let lookupObj: any = [];
          if (config[key].multiple) {
            searchFields[key]?.map((o: any) => lookupObj.push(o.sid));
          }
          const rField = this.tableSearchFieldConfig[key]?.parentField || this.quickFilterFieldConfig[key]?.parentField || "displayField";
          data[key] = searchFields[key][rField];
        } else if (searchFields[key] === 'IS_EMPTY') {
          data[key] = '$__isEmpty';
        } else if (Array.isArray(searchFields[key])) {
          data[key] = searchFields[key].map((item: string) => item === 'IS_EMPTY' ? '$__isEmpty' : item);
        } else if ((searchFields[key] == '' || !searchFields[key]) && this.queryViewList){
          data[key] = null;
        } else {
          data[key] = searchFields[key];
        }
      }
    }
  }

  getSearchData(searchFields?: any, config?: any): any {
    let searchData: any = {};
    const enrichedData = this.getDefaultFilterValues(true);
    searchData = enrichedData?.searchData;
  
    if (searchFields) {
      this.populateDataFields(searchData, searchFields, config, false);
    }
  
    return searchData;
  }
  
  getMapperData(searchFields?: any, config?: any): any {
    let mapperData: any = {};
    const enrichedData = this.getDefaultFilterValues(false);
    mapperData = enrichedData?.mapper;
  
    if (searchFields) {
      this.populateDataFields(mapperData, searchFields, config, true);
    }
  
    return mapperData;
  }

 assignTableParams() {
    const params: any = {};
    this.filter.sortField = this.tableConfig.groupOnColumn ? this.tableConfig.groupOnColumn?.name : this.filter.sortField;
    const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) }
    const mapper = this.getMapperData(this.filter.quickFilter, this.quickFilterFieldConfig);
    if (this.filter.globalSearch)
      searchData['_global'] = this.filter.globalSearch;

    if (this.filter.sortField && this.filter.sortOrder) {
    let columnName:any = null;
    this.tableConfig.children.map((ele: any) => {
      if (ele.uiType === "autosuggest" && this.filter.sortField === ele.name) {
        columnName = (ele.name + "__value__" + ele.displayField);
      }
      else if(this.filter.sortField === ele.name){
        columnName = this.filter.sortField 
      }
      if(columnName){
        params.order = [{
          column: columnName,
          dir: this.filter.sortOrder
        }]
      }
      else{
        params.order = null;
      }
    })
  }
    else {
      params.order = null;
    }
    params.search = searchData;
    params.mapper = mapper;

    return params;
  }
 updateActions() {
        this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children) ||[];
        this.actionBarConfig?.forEach((actionConfig: any) => {
            if (actionConfig && actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonVisiblity?.query?.rules, actionConfig.conditionForButtonVisiblity?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'view');
            }
            if (actionConfig && actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable) {
                const conResult = this.appUtilBaseService.evaluvateCondition(actionConfig.conditionForButtonEnable?.query?.rules, actionConfig.conditionForButtonEnable?.query?.condition);
                this.validateActions(actionConfig.buttonId, conResult, 'edit');
            }
        })
    }
    validateActions(label: string, result: boolean, action: string) {
        if (action === 'view') {
            if (result && this.conditionalActions.hideActions.includes(label))
                this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1)
            else if (!result && !this.conditionalActions.hideActions.includes(label))
                this.conditionalActions.hideActions.push(label);
        }
        else if (action === 'edit') {
            if (result && this.conditionalActions.disableActions.includes(label))
                this.conditionalActions.disableActions.splice(this.conditionalActions.disableActions?.indexOf(label), 1);
            else if (!result && !this.conditionalActions.disableActions.includes(label))
                this.conditionalActions.disableActions.push(label);
        }
    }
  disablechildAction(pid?:any) {
      const value: any = "parentId";
      let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
      if (!this.mapConfig[this.componentId]) {
      const parentId = this[property] || pid;
      this.leftActionBarConfig?.children?.map((ele: any) => {
        if (ele?.action === 'new' && !parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
          ele.buttonEnabled = 'no';
        }
        else if (ele.action === 'new' && parentId && this.isChildPage && ele.buttonEnabled != 'conditional') {
          ele.buttonEnabled = 'yes';
        }
      })
    }
      }
  getGridConfig() {
    const self = this;
    this.tableConfig.tableStyle = this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.tableStyle;
    const gridConfigData: any = {
      data: this.gridData,
      columns: this.getColumns(),
      ajaxUrl: ApplicationUserApiConstants.getDatatableData,
      select: true,
      colReorder: (String(this.tableConfig?.columnReorder)?.toLowerCase() === 'true'),
      detailPageNavigation: (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_of_the_row' ? 'row_click' : (this.tableConfig?.detailPageNavigation?.toLowerCase() == 'click_on_navigate_icon' ? 'row_edit' : '')),
      toggleColumns: (String(this.tableConfig?.toggleColumns)?.toLowerCase() === 'true'),
      paging: !(String(this.tableConfig?.infiniteScroll)?.toLowerCase() === 'true'),
      scrollX: true,
      quickfilterConfigured: this.quickFilterConfig?.children?.length > 0,
      scrollCollapse: true,
      pageLength: parseInt(String(this.tableConfig?.pageLimit)),
      deferRender: true,
      ordering: true,
      sortField: this.tableConfig.sortField,
      sortOrder: this.tableConfig.sortOrder,
      colResize: (String(this.tableConfig?.columnResize)?.toLowerCase() === 'true'),
      disableSelection: ((this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' || this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only') ? false : true),
      recordSelection: (this.tableConfig?.recordSelection?.toLowerCase() == 'multiple_records' ? 'multi' : (this.tableConfig?.recordSelection?.toLowerCase() == 'single_record_only' ? 'single' : '')),
      bFilter: false,
      enterKeytoSearch: false,
      showGridlines:this.tableConfig.showGridlines,
      striped:this.tableConfig.striped,
      rowSpacing:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowSpacing,
      rowHeight:this.appUtilBaseService.getTableView(this.tableConfig.tableStyle,this.tableConfig.rowSpacing,this.tableConfig.rowHeight)?.rowHeight,
      sortSeparator:this.separator,
      rowGrouping: jQuery.isEmptyObject(this.tableConfig?.groupOnColumn) ? '' : this.tableConfig?.groupOnColumn?.name,
      rowGroupColumns: this.tableConfig?.rowGroupColumns,
      rowGroup: (String(this.tableConfig?.rowGroup)?.toLowerCase() === 'yes'),
      currentPageName:this.pageViewTitle,
      fixedColumns: {
        left: parseInt(String(this.tableConfig?.leftFreezeUptoColumn || '0') ),
        right: parseInt(String(this.tableConfig?.rightFreezeFromColumn || '0') )
      },
      isChildPage: this.isChildPage,
      parentId: this.getParentId(),
      uniqueIdentifier:this.tableConfig?.uniqueIdentifier|| null,
      defaultSearch: this.filters[this.componentId]?.length > 0 ||this.mapConfig[this.componentId]?.length > 0 || this.queryViewList || this.defaultFilters.length > 0 || this.restorefilters ? true : false,
      searchParams: { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig)},
      mapper:this.getMapperData(this.filter.quickFilter, this.quickFilterFieldConfig),
       emptyTableMsg: this.gridEmptyMsg,
      fromDetailPage: this.fromDetailPage,
      restoredpage : this.currentPaginationStart,
      isChildIsInDetailPopup: this.dynamicDialogConfigFromDetailPage?.popup,
      onRowMenuClick: (option: any, row: any, data: any) => {
      },

      onRowSelect: (selectedRows: any, id: any) => {
        this.getSelectedvalues(selectedRows, id);
      },
      onRowDeselect: (selectedRows: any) => {
        this.getSelectedvalues(selectedRows, '');
      },
       onRowClick: (event: any, id: string,data:any) => {
        this.onUpdate(id, event,data);
      },
      drawCallback: (settings: any, apiScope: any,gridProps:any) => {
        this.currentPaginationStart = gridProps?.params.start;
        this.onDrawCallback(settings, apiScope);
      },
      onAfterServiceRequest: (data: any) => {
        this.onAfterServiceRequest(data)
      },
      onHyperLinkClick: (event: any, col: any,rowdata:any) => {
       this.openHyperLink(event,col,rowdata)
      },
      onActiveFilterSelection: (data:any) =>{
      }
    };
    return gridConfigData;
  }

  onAfterServiceRequest(data: any) {
     this.clearSelectedValues();
    // Callback function for getting Datatable data 
    // console.log(data)
  }

  onDrawCallback(settings: any, apiScope: any) {
    // Callback function, which is called every time DataTables performs a draw
  }

  clearSelectedValues() {
    this.selectedValues = [];
    this.actionButtonEnableDisable();
  }

  getSelectedvalues(selectedRows: any, id: string) {
    let rawData: any = selectedRows?.data();
    // Filter out properties that are not functions
    this.selectedRows = []
    // Iterate through the properties of the response object
    for (const key in rawData) {
        // Check if the property is a numeric index (data objects)
        if (!isNaN(parseInt(key))) {
            // Add the data object to the array
            this.selectedRows.push(rawData[key]);
        }
    }

    this.selectedValues = [];
    rawData?.map((obj: any) => {
        this.selectedValues.push(obj.sid)
    })
    if (this.selectedValues.length > 0) {
        this.isRowSelected = true;
    } else if (this.selectedValues.length <= 0) {
        this.isRowSelected = false;
    }
    this.actionButtonEnableDisable();
}

actionButtonEnableDisable() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if(ele.type?.toLowerCase() == 'buttongroup' && ele.children?.length > 0) {
        ele?.children?.map((gButtonEle:any) => {
          this.disableButtons(gButtonEle)
        })
      } else {
        this.disableButtons(ele)
      }
    })
  }

  disableButtons(ele:any) {
    if ((ele?.action === 'delete' || ele?.action === 'activate' || ele?.action === 'deactivate') && ele.buttonEnabled != 'conditional') {
      if (this.selectedValues?.length > 0) {
        ele.buttonEnabled = 'yes';
      } else {
        ele.buttonEnabled = 'no';
      }
    }
  }

  getColumns() {
   const json1 = this.tableConfig.children ||[];
    const json2 = this.customRenderConfig.children ||[];
    let merged = [];
    for (let i = 0; i < json1.length; i++) {
 if(json1[i].mapping?.length > 0){
        json1[i].orderable = false;
      }
      merged.push({
        ...json1[i],
        ...(json2.find((itmInner: any) => itmInner.fieldName === json1[i].fieldName))
      });
    }
    return merged;
  }
showToastMessage(config: object) {
    this.messageService.add(config);
  }
getParentId() {
  const value: any = "parentId";
  let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
  if (this.isChildPage) {
    if (this[property]) {
      return this[property];
    } else {
      return false;
    }
  }
}
leftPad(num:number, length:number) {
    var result = '' + num;
    while (result.length < length) {
      result = '0' + result;
    }
    return result;
  }

 getButtonConfig(btn:any){
    return {
      action:btn.action,
      confirmationTitle:btn.confirmationTitle|| this.translateService.instant('CONFIRMATION'),
      confirmationText:btn.confirmationText || 'Do you want to perform the action?',
      fields: btn.fields || {"children":[]},
        confirmButton:btn.confirmationButtonText,
      rejectButton:btn.cancelButtonText,
      values:(this.responseData?.filter((o:any)=>o.sid == this.selectedValues[0]))[0]
    }
  }
onBeforeRefresh(params:any){
    return params;
  }

  getDefaultSearchParams(){
    const searchData:any ={};
    if(this.filters[this.componentId]?.length > 0){
      this.filters[this.componentId].forEach((keys:any)=>{
        if(this.mapData[keys.tableField])
          searchData[keys.field] = this.mapData[keys.tableField]
      })
    }
    return searchData;
  }
showInfoMessage(message: string) {
    // Display an info message
    this.messageService.add({severity:'info', summary:'Info', detail: message});
  }
  toShowRecords(params?: any) {
    let searchDataValues = Object.keys(params?.search || {});
    let mapFields = Object.keys(params?.mapper || {});
  
    const mapConfigFields = this.mapConfig[this.componentId]?.map((config: { listField: any }) => config.listField) || [];
    const missingMapConfigFields = mapConfigFields.filter((field: string) => !mapFields.includes(field));
  
    this.showonFilter = this.queryViewList ||  (this.standardGrid && mapConfigFields.length >0 && this.fromDetailPage);
  
    this.applyQueryViewFilters(params, searchDataValues,mapFields);
    this.applyMapConfigFilters(params, mapFields, missingMapConfigFields);
  
    // Set the grid empty message based on the filter checks
    this.setGridEmptyMessage(searchDataValues,missingMapConfigFields,mapFields);
  
    // Update gridConfig with the appropriate empty table message
    this.gridConfig['emptyTableMsg'] = this.gridEmptyMsg;
    this.gridConfig['parentId'] = this.getParentId();
  }
  
  applyQueryViewFilters(params: any, searchDataValues: string[], mapFields?:any) {
    const mandatoryFilters = this.checkMandatoryFilters();
    const missingFilters = mandatoryFilters.filter(filter => !searchDataValues.includes(filter) && !mapFields.includes(filter));
  
    if (this.queryViewList) {
      if (mandatoryFilters.length > 0) {
         if (searchDataValues.length === 0 && mapFields.length === 0) {
          this.queryViewFiltersApplied = false; // No search data provided, so hide records
        } else if (missingFilters.length === 0) {
          this.queryViewFiltersApplied = true; // All mandatory filters are present in searchData
        } else {
          this.queryViewFiltersApplied = false; // Some mandatory filters are missing in searchData
          console.log("Mandatory filters missing in searchData:", missingFilters);
        }
      } else {
        this.queryViewFiltersApplied = true;
      }
    }
 
  }
  
  applyMapConfigFilters(params: any, searchDataValues: string[], missingMapConfigFields: string[]) {
    if ((this.mapConfig[this.componentId]?.length > 0 && missingMapConfigFields.length > 0) || !this.existingFormId) {
      this.hasMappedParameters = false;
    }
   else if((missingMapConfigFields.length  == 0 || this.mapConfig[this.componentId]?.length <= 0)  && this.existingFormId){
      this.hasMappedParameters = true;
    }
  }

comparePriorAndCurrentSearch = (prior: any, current: any) => {
    if (prior && current) {
      const priorString = JSON.stringify(prior);
      const currentString = JSON.stringify(current);
      return priorString === currentString;
    }
    return false;
  }

setGridEmptyMessage(searchDataValues: string[], missingMapConfigFields: string[],mapFields:any) {
    const mandatoryFilters = this.checkMandatoryFilters();
    const missingFilters = mandatoryFilters.filter(filter => !searchDataValues.includes(filter) && !mapFields.includes(filter));

    // Check for missing map config fields first
    if (this.mapConfig[this.componentId]?.length > 0) {
      if (missingMapConfigFields.length > 0)
        this.gridEmptyMsg = `To view the records, please fill in the field(s) : ${missingMapConfigFields.join(', ').replace(/,(?=[^,]*$)/, ', and')}.`;
      else
        this.gridEmptyMsg = this.translateService.instant('NO_DATA_AVAILABLE')
    }
    // Then check for missing mandatory filters
    else if (!this.queryViewFiltersApplied && this.showonFilter && this.queryViewList) {
      let missingParams = missingFilters.join(', ').replace(/,(?=[^,]*$)/, ', and');
      this.gridEmptyMsg = `Unable to display any records. The query is missing mandatory parameter(s): ${missingParams}. Please ensure these parameter(s) are provided for the view to display records.`;
      console.log("Mandatory fields without user interaction:", missingFilters);
    }
    // Default message if no data is available
    else {
        this.gridEmptyMsg = this.translateService.instant('NO_DATA_AVAILABLE')
    }
  }


checkMandatoryFilters() {
    const mandatoryFields: string[] = [];
    Object.keys(this.quickFilterControls.controls).forEach(key => {
      const control = this.quickFilterControls.get(key);
      if (control && control.validator && control.validator(control)) {
        const errors = control.validator(control);
        if (errors && errors.required) {
          mandatoryFields.push(key);
        }
      }
    });

    this.filters[this.componentId]?.forEach((obj: any) => {
      if (!mandatoryFields.includes(obj.lookupField)) {
        mandatoryFields.push(obj.lookupField);
      }
    });
    this.tableConfig.queryViewMandatoryFilters?.forEach((field: any) => {
      if (!mandatoryFields.includes(field)) {
        mandatoryFields.push(field);
      }
    });
    return mandatoryFields;
  }

 shouldRefresh(previousValue: any, currentValue: any): boolean {
    // Check if any of the changed fields match the filter fields
    const filterFields = this.filters[this.componentId]?.map((filter: any) => filter.tableField) || [];
    const mappingFields = this.mapConfig[this.componentId]?.map((filter: any) => filter.detailField) || [];

    const filtersObject = this.filters[this.componentId]?.reduce((acc: any, filter: any) => {
      if (filter.tableField) {
        acc[filter.tableField] = filter; // Add filter object with tableField as the key
      }
      return acc;
    }, {}) || {};

    return [...filterFields, ...mappingFields].some((field: any) => {
      const previousFieldValue = previousValue[field];
      const currentFieldValue = currentValue[field];
      //if there is a static value in query view list, no need to refresh.
      if (this.queryViewList && filterFields.length > 0) {
          if (filtersObject[field]?.value) {
            return false;
          }
          else {
            return JSON.stringify(previousFieldValue) !== JSON.stringify(currentFieldValue);
          }
      }
      // Check if the field has changed
      return JSON.stringify(previousFieldValue) !== JSON.stringify(currentFieldValue);
    });
  }
  
  manipulateOutputData(res: any): void {
    
  }
  
  

  getInputParams() {
    return {}
  }

  getMappedFilters(): void {
  const componentConfig = this.mapConfig[this.componentId];
    const queryViewConfig = this.filters[this.componentId];
    if (queryViewConfig) {
      this.getqueryViewFilters();
    }
    const value: any = "parentId";
   let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
    if (!componentConfig) {
      return;
    }
    componentConfig.forEach((filter: any) => {
      const label = filter?.label
        ? this.translateService.instant(filter.label)
        : filter.listField;
      if (label && filter.viewInPages) {
        const formattedText = this.mapData[filter.detailField] ? this.appUtilBaseService.formatRawDatatoRedableFormat(filter, this.mapData[filter.detailField], '', true) : this.mapData[filter.detailField];
        this.mappedFiltersDisplay[label] = formattedText;
      }
      if (filter.holdFilterValue) {
        if (!this.holdFilters.includes(filter.listField)) {
          this.holdFilters.push(filter.listField);
        }
        this.filtersFromParent[filter.listField] = this.mapData[filter.detailField];
      }
    });
   Object.keys(this.mappedFiltersDisplay).forEach(key => {
      const value = this.mappedFiltersDisplay[key];
      if (value === "" || value === undefined || value === null) {
        delete this.mappedFiltersDisplay[key];
      }
    });
   this.updateTooltipText();
  }
  
getqueryViewFilters() {
    const queryViewFilters = this.filters[this.componentId];
    queryViewFilters?.forEach((filter: any) => {
      // if(filter?.value){
      const value = filter.staticValue ? filter.staticValue : (this.mapData[filter.tableField] || this.metaData[filter.tableField]);
      if(!filter.staticValue){
      const control = this.quickFilterControls.get(filter.lookupField);
      this.patchControlValue(control, value, this.quickFilterFieldConfig[filter.tableField]);
      }
      // }
      if (filter.holdFilterValue) {
        if (!this.holdFilters.includes(filter.lookupField)) {
          this.holdFilters.push(filter.lookupField);
        }
        if (
          (filter?.uiType === 'autosuggest' && typeof this.mapData[filter.tableField] === 'object') ||
          (this.mapData[filter.tableField] && typeof this.mapData[filter.tableField] === 'object' && this.mapData[filter.tableField]?.referenceField)
        ) {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField]['referenceField'];
        }
        else {
          this.filtersFromParent[filter.lookupField] = this.mapData[filter.tableField];
        }

      }
    });
    let filterVals = { ...this.quickFilterControls.getRawValue() };

    const hasDates = this.quickFilterConfig.children.filter((e: any) =>
      e.fieldType.toLowerCase() === "date" || e.fieldType.toLowerCase() === "datetime"
    );

    if (hasDates.length > 0) {
      this.handleDateFields(hasDates, filterVals, this.quickFilterControls.getRawValue());
    }

    const hasNumbers = this.quickFilterConfig.children.filter((e: any) =>
      e.fieldType.toLowerCase() === "number" || e.fieldType.toLowerCase() === "double"
    );

    if (hasNumbers.length > 0) {
      this.handleNumberFields(hasNumbers, filterVals, this.quickFilterControls.getRawValue());
    }

    this.filter.quickFilter = filterVals;
  }

 actionButtonHideShow() {
    if (this.dynamicDialogConfigFromDetailPage?.popup) {
      let actionBarConfig = [...this.leftActionBarConfig?.children || [], ...this.rightActionBarConfig?.children || []];
      actionBarConfig?.map((obj: any) => {
        if (obj?.action === 'back') {
          obj.visibility = 'hide'
        }
      })
    }
  }
getListofServicesTobeFired(): Observable<any[]> {
    return new Observable(observer => {
      const config = { ...this.quickFilterFieldConfig };
      let autosuggestConfig: any = {}
      const data = this.quickFilterControls.getRawValue();
      const tempUrl: any = [];
      const observables: Observable<any>[] = [];

      for (const property in config) {
        if (config[property].uiType !== 'autosuggest' || !config[property].isCustom || !data[property]) continue;
        tempUrl.push({
          serviceName: config[property].autoSuggestServiceName,
          url: config[property].lookupUrl,
          field: config[property].name
        });
      }
      tempUrl.filter((obj: { id: any; }, index: any, self: any[]) =>
        index === self.findIndex((o: { id: any; }) => o.id === obj.id)
      );

      tempUrl?.map((o: any) => {
        const urlObj = {
          url: o.url,
          searchText: '',
          colConfig: config[o.field],
          value: data,
          pageNo: 0
                  };
        autosuggestConfig[o.field] = config[o.field];
        urlObj.url = this.appUtilBaseService.generateDynamicQueryParams(urlObj);

        const observable = this.baseService.get(urlObj).pipe(
          catchError((error: any) => {
            console.error('An error occurred:', error);
            return of(null);
          })
        );
        observables.push(observable);
      });
      if (observables.length > 0) {
        const sub = forkJoin(observables).subscribe((responses: any[]) => {
          responses.forEach((res: any, index: number) => {
            const property = Object.keys(autosuggestConfig)[index];
            const con = autosuggestConfig[property];
            if (!res || res.length <= 0) return; // Skip processing if there was an error
            const tempDisplay: any[] = [];
            const filteredResponse = res[0] || {};
            con.displayFields?.forEach((obj: any) => tempDisplay.push(filteredResponse[obj.name]));
            filteredResponse['displayField'] = tempDisplay.join('_');
            this.quickFilterControls.get(property)?.patchValue(filteredResponse);
            // this.data[property] = filteredResponse;
          });
          observer.next(responses); // Emit the responses
          observer.complete(); // Complete the observable
        });
        this.subscriptions.push(sub);
      } else {
        observer.next([]);
        observer.complete();
      }
    });
  }

onOperatorSelect(fieldConfig: any) {
    let equalFilter: boolean = (this.defaultFilters.includes(fieldConfig.name) && this.queryViewList);
    let operator = fieldConfig?.operator || 'has';
    if (fieldConfig?.operator == 'is equal to' || fieldConfig?.operator == 'is empty' || fieldConfig?.uiType == 'select' || equalFilter) {
      operator = '=';
    }
    return operator;
  }
  
     /**
   * To set query params for new button in detail page
   */
    setQueryParam(){
      let queryParams: any = {}
      if (this.holdFilters.length > 0) {
        this.holdFilters.forEach((filter: string) => {
          const control = this.quickFilterControls.get(filter);
         if (!(control instanceof FormGroup)) {
                if (this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter]) {
                  const fieldConfig = this.quickFilterFieldConfig?.[filter];
                  const parentField = fieldConfig?.parentField;
                  const controlValue = this.quickFilterControls?.get(filter)?.value;
                  if (
                    fieldConfig?.uiType === 'autosuggest' &&
                    parentField &&
                    controlValue?.[parentField] != null
                  ) {
                    queryParams[filter] = controlValue[parentField];
                  }
                  else {
                    queryParams[filter] = this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter];
                  }
                }
              }
        })
      }
      localStorage.setItem('holdFilters',JSON.stringify(queryParams));
    }
    
updateTooltipText(): void {
    const keyValuePairs = Object.entries(this.mappedFiltersDisplay)
        .map(([key, value]) => ` ${key}  :  ${value} `)
        .join(', ');
    this.tooltipText = `( ${keyValuePairs} )`;
}

getValue(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup){
      const child = ele.split('?.')[1];
      return formControl.controls[parent].value[child];
    }
    else
      return formControl.controls[parent].value;
  }

getDisabled(formControl: FormGroup, ele: string) {
  const parent = ele.split('?.')[0];
  if (formControl.controls[parent] instanceof FormGroup){
    return formControl.get(ele)?.disabled
  }
  else
    return formControl.controls[parent].disabled;
}

disableNewAction() {
    this.leftActionBarConfig?.children?.map((ele: any) => {
      if (ele?.action === 'new' && this.mapConfig[this.componentId]?.length > 0 && !this.existingFormId && ele.buttonEnabled != 'conditional') {
        ele.buttonEnabled = 'no';
      }
      else if (ele.action === 'new' && this.mapConfig[this.componentId]?.length > 0 && this.existingFormId &&  ele.buttonEnabled != 'conditional') {
        ele.buttonEnabled = 'yes';
      }
    })
  }
  
  /**
 * Generates the grid structure for saving filters and pagination.
 * @returns {Object} - Current filter settings.
 */
  generatedGridStructure() {
    return {
      "quickFilter": {
        display: this.quickFilterControls.getRawValue(),
        reference: this.filter.quickFilter,
      },
      "advancedSearch": {
        display: this.tableSearchControls.getRawValue(),
        reference: this.filter.advancedSearch
      },
      "pageStart": this.currentPaginationStart
    }
  }
  
 /**
 * Saves the current grid configuration.
 * @returns {void} 
 */
  rememberGridConfig(){
    this.appUtilBaseService.removeGridConfigProperty();
    const values = this.generatedGridStructure()
    this.appUtilBaseService.setGridConfigProperty(this.globalStorageKey,values);
  } 
  
 /**
 * Restores filter settings from saved configuration.
 * @returns {void}
 */
  restoreFilterSettings() {
    const fromPage = this.appGlobalService.get('FromPage');
    const detailPage = this.tableConfig?.detailPage?.url;
    const existingFilterSettings = this.appUtilBaseService.getGridConfigProperty(this.globalStorageKey)
    if (detailPage && this.appUtilBaseService.areUrlsEqual(fromPage, detailPage) && existingFilterSettings) {
      this.quickFilterControls.patchValue(existingFilterSettings.quickFilter.display,{emitEvent:false});
      this.filter.quickFilter = existingFilterSettings.quickFilter.reference;
      this.tableSearchControls.patchValue(existingFilterSettings.advancedSearch.display,{emitEvent:false});
      this.filter.advancedSearch = existingFilterSettings.advancedSearch.reference;
      this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);
      this.currentPaginationStart = existingFilterSettings.pageStart;
      this.restorefilters = true;
    }
    else{
      this.currentPaginationStart = null;
      this.restorefilters = false;
    }
  }
  
    openHyperLink(event: any, col: any, rowData: any) {
    if (!col?.detailPage?.url) return; //  return if no detailPage or URL
  
    // Construct query parameters based on detailPageMapping and holdFilters
    const queryParams = this.createQueryParams(col, rowData);
    //  const componentName = this.getRouteForUrl(col.detailPage.url);
    // Handle navigation or popup based on configuration
    if (col.showDetailPageAs === 'navigate_to_new_page') {
      this.appUtilBaseService.navigateWithQueryParams(queryParams, col.detailPage.url);
    } else if (col.showDetailPageAs === 'as_a_popup') {
      const componentName = this.componentMapping[col.componentName];
      this.openPopup(null,null,queryParams,componentName, col);
    }  
    // Prevent event propagation
    event.stopPropagation();
  }
  
  /**
   * Helper function to create query parameters based on mappings and filters.
   */
  createQueryParams(col: any, rowData: any): any {
    const queryParams: any = {};

    // Function to process mappings and populate queryParams
    const processMappings = (mappings: any[]) => {
      mappings.forEach(({ listField, detailField }) => {
        if (listField && detailField && rowData[listField]) {
          queryParams[detailField === 'sid' ? 'id' : detailField] = rowData[listField];
        }
      });
    };

    // Check if record creation is not enabled before processing detailPageMapping
    if (rowData[col.fieldName]) {
      processMappings(col.detailPageMapping || []);
    }
    else {
      processMappings([...col.detailPageMapping || [], ...col.holdFilters || []]);
    }
    // Process both detailPageMapping and holdFilters together
    return queryParams;
  }
	onNew() {
    if (!this.tableConfig.detailPage?.url) return;
      let queryParams: any = {}
if (this.holdFilters.length > 0) {
  this.holdFilters.forEach((filter: string) => {
    const control = this.quickFilterControls.get(filter);
   if (!(control instanceof FormGroup)) {
          if (this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter]) {
            const fieldConfig = this.quickFilterFieldConfig?.[filter];
            const parentField = fieldConfig?.parentField;
            const controlValue = this.quickFilterControls?.get(filter)?.value;
            if (
              fieldConfig?.uiType === 'autosuggest' &&
              parentField &&
              controlValue?.[parentField] != null
            ) {
              queryParams[filter] = controlValue[parentField];
            }
            else {
              queryParams[filter] = this.quickFilterControls.get(filter)?.value || this.filtersFromParent[filter];
            }
          }
        }
  })
}
    localStorage.setItem('holdFilters',JSON.stringify(queryParams));
    this.rememberGridConfig();
    const value: any = "parentId";
    let property: Exclude<keyof ApplicationUserListBaseComponent, '' > = value;
    if (this.isChildPage && this[property]) {
      const methodName: any = "onNewChild";
      let action: Exclude<keyof ApplicationUserListBaseComponent, '' > = methodName;
      if (typeof this[action] == "function") {
        this[action]({ 'isCreate': 'yes' , ...queryParams});
      }
    }
    else {
      if(this.fromDetailPage) {
        this.onBeforeValidationEmitter.emit({
          data: this.tableConfig.showDetailPageAs,
          parentCallbackFunction: ((parentObj: any) => {
            if (parentObj == 'true') {
                  this.appUtilBaseService.navigateWithQueryParams({ 'isCreate': 'yes' , ...queryParams}, this.tableConfig.detailPage?.url);
            }
          })
        });
      } else {
            this.appUtilBaseService.navigateWithQueryParams({ 'isCreate': 'yes' , ...queryParams}, this.tableConfig.detailPage?.url);
      }
    }
  }
	onUpdate(id: any, event?: any, data?: any) {
    if (!this.tableConfig.detailPage?.url) return;
     this.rememberGridConfig();
    const value: any = "parentId";
    let property: Exclude<keyof ApplicationUserListBaseComponent, '' > = value;
    const methodName: any = "onUpdateChild";
    let action: Exclude<keyof ApplicationUserListBaseComponent, '' > = methodName;
    if (this.isChildPage && this[property]) {
      if (typeof this[action] === "function") {
        this[action](id);
      }
    } else {
      if(this.fromDetailPage) {
        this.onBeforeValidationEmitter.emit({
          data: this.tableConfig.showDetailPageAs,
          parentCallbackFunction: ((parentObj: any) => {
            if (parentObj == 'true') {
               this.setQueryParam();
               this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
            }
          })
        });
      } else {
        this.setQueryParam();
         this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
      }
    }
  }
	toggleAdvancedSearch() {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}

clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}

clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.onRefresh();
  this.filtersApplied = false;
  this.readonlyOnSearch();
}

readonlyOnSearch(){
  const inputField = document.getElementById('inputField') as HTMLInputElement | null;    
  if (inputField) {
    if (this.filtersApplied) {
      inputField.setAttribute('readonly', 'true'); // Make input read-only
    } else {
      inputField.removeAttribute('readonly'); // Remove read-only state
    }
  }
  
}

formatSearchString(obj: any) {
  let formattedStringArray: string[] = [];
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (value !== null && value !== undefined && value !== "") {
            if(value?.type == 'Date'){
              let lowerLimitDate;
              let upperLimitDate;
              value?.lLimit ? lowerLimitDate = this.appUtilBaseService.formatDate(value?.lLimit,AppConstants.dateFormatAngular) : lowerLimitDate = null;
              value?.uLimit ? upperLimitDate = this.appUtilBaseService.formatDate(value?.uLimit,AppConstants.dateFormatAngular) : upperLimitDate = null;
              if(value?.lLimit && value?.uLimit){
              formattedStringArray.push(`${key}: ${lowerLimitDate}-${upperLimitDate}`);
            }
            else{
              (value?.lLimit) ? formattedStringArray.push(`${key}: ${lowerLimitDate}`) : (value?.uLimit) ? formattedStringArray.push(`${key}: ${upperLimitDate}`) :formattedStringArray.push(`${key}: ${value}`)  ;
            }
            }
            else{
              const translatedValue = ['dropdown','select','radiobutton'].includes(this.tableSearchFieldConfig[key]?.uiType) && value? this.translateService.instant(value) : value;
             formattedStringArray.push(`${key}: ${translatedValue}`);
            }
          }
      }
  }
  this.advancedSearchValue = formattedStringArray
}

advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    let hasDates = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let val:any ={};
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && Array.isArray(value)) {
            if(this.tableSearchFieldConfig[field].uiType ==='date'){
              const tempDate1 = new Date(value[0]);
              const tempDate2 = new Date(value[1]);
              const convertedDate1 = tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2);
              const convertedDate2 = tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2);
              val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: value[1] ? new Date(convertedDate2).getTime() : null, type: "Date" };
            }
            else{
              val = { lLimit: new Date(value[0]).getTime(), uLimit: value[1] ? new Date(value[1]).getTime(): value[1], type: "Date" }          
            }
          
          this.filter.advancedSearch[field] = val;
          if (value[0] == null && value[1] == null) {
            delete this.filter.advancedSearch[field];
          }
        }

        if (value && typeof value == 'object' && !Array.isArray(value)) {
          if (this.tableSearchFieldConfig[field].uiType === 'date') {
            const tempDate1 = typeof value?.min == 'undefined' ? value : value?.min ? new Date(value?.min) : null;
            const tempDate2 = typeof value?.max == 'undefined' ? value : value?.max ? new Date(value?.max) : null;
            const convertedDate1 = tempDate1 ? tempDate1.getFullYear() + '-' + this.leftPad((tempDate1.getMonth() + 1), 2) + '-' + this.leftPad(tempDate1.getDate(), 2) : null;
            const convertedDate2 = tempDate2 ? tempDate2.getFullYear() + '-' + this.leftPad((tempDate2.getMonth() + 1), 2) + '-' + this.leftPad(tempDate2.getDate(), 2) : null;
            val = { lLimit: convertedDate1 ? new Date(convertedDate1).getTime() : null, uLimit: convertedDate2 ? new Date(convertedDate2).getTime() : null, type: "Date" };
          } else {
            val = { lLimit: new Date(value?.min).getTime(), uLimit: value?.max ? new Date(value?.max).getTime() : null, type: "Date" }
          }
          if (val?.lLimit || val?.uLimit) {
            this.filter.advancedSearch[field] = val;
          }
          if (!val?.lLimit && !val?.uLimit) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    let hasNumbers = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
    if (hasNumbers.length > 0) {
      hasNumbers.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && !Array.isArray(value) && typeof value == 'object') {
          this.filter.advancedSearch[field] = {
            lLimit: value.min, uLimit: value.max, type: "Number"
          }
          if (value.min == null && value.max == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    this.formatSearchString(this.filter.advancedSearch);
    this.onRefresh(false,true);
    this.toggleAdvancedSearch();
    this.filtersApplied = Object.values(this.filter.advancedSearch).some(value => value !== null);    
    this.readonlyOnSearch();
  }

  onSearchFocus() {
    this.isSearchActive = true;
  }

  onSearchBlur() {
      this.isSearchActive = false;
  }

onKeydown(event: any) {
  this.showAdvancedSearch = false;
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
   return
  }
  clearTimeout(this.typingTimer);
  this.isSearchActive = true; 
  this.typingTimer = setTimeout(() => {
    this.onUserInactive(); 
  }, this.typingDelay);
}

onUserInactive() {
  this.isSearchActive = false;
  this.showAdvancedSearch = false;
  this.onRefresh();
}

get dynamicModel() {
  return this.filtersApplied ? this.advancedSearchValue : this.filter.globalSearch;
}

set dynamicModel(value: string) {
  if (this.filtersApplied) {
    this.advancedSearchValue = value;
  } else {
    this.filter.globalSearch = value;
  }
}

initSearchForm(){
  this.tableSearchFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
}

clearFilters(){
  this.filter.globalSearch = '';
  this.isSearchFocused = false;
}
clearValues(){
  if(this.filtersApplied){
    this.clearFilterValues();
  }
  else{
    this.clearGlobalSearch();
  }
}

focus(){
  this.isSearchFocused = !this.isSearchFocused;
}

clearGlobalSearch(){
  this.filter.globalSearch = '';
  this.onRefresh();
}

    onInit() {
			this.initSearchForm();
  

			this.initFilterForm();

		localStorage.setItem("formChanged", JSON.stringify(false));
  this.globalStorageKey = this.fromDetailPage && this.componentId ?` ${this.componentId}_${this.localStorageStateKey}`: this.localStorageStateKey;
  this.restoreFilterSettings();
  this.getListofServicesTobeFired().subscribe((responses: any[]) => {   
  this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
    this.tableFieldConfig = this.appUtilBaseService.formatTableFieldConfig(this.tableConfig.children);
    this.getMappedFilters();    
    this.loadGridData();
    this.disablechildAction();
    this.disableNewAction();
    this.updateActions();
    const params =  this.assignTableParams();
    this.toShowRecords(params);
    this.gridConfig = this.getGridConfig();
    this.selectedColumns = this.gridConfig.columns;
    this.combinedActionConfig = (this.leftActionBarConfig?.children ?? []).concat(this.rightActionBarConfig?.children ?? []);
    this.actionButtonEnableDisable();
    this.actionButtonHideShow();
       this.appUtilBaseService.updateButtonVisibilityBasedonAllowedActions(
      this.queryViewNotAllowedActions,
      {
        left: this.leftActionBarConfig,
        right: this.rightActionBarConfig
      },
      this.conditionalActions,{});
 });

    }
	
     onDestroy() {
		this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());

    }
     onAfterViewInit() {
			 this.appUtilBaseService.setCurrentPageGlobally();

    }
    
    onChanges(changes:any) {
			const mapDataChanged = changes.mapData && changes.mapData.previousValue &&
        JSON.stringify(changes.mapData.previousValue) !== JSON.stringify(changes.mapData.currentValue) &&
        this.shouldRefresh(changes.mapData.previousValue, changes.mapData.currentValue);

        const metaDataChanged = changes.metaData && changes.metaData.previousValue &&
        JSON.stringify(changes.metaData.previousValue) !== JSON.stringify(changes.metaData.currentValue) &&
        this.shouldRefresh(changes.metaData.previousValue, changes.metaData.currentValue);
    
      const existingFormIdChanged = !this.queryViewList && changes.existingFormId &&
        changes.existingFormId.previousValue === undefined &&
        changes.existingFormId.currentValue;
    
      const parentIdChanged = this.fromDetailPage && changes.parentId && 
      changes.parentId.previousValue === undefined &&
      changes.parentId.currentValue;
    
      if (mapDataChanged || existingFormIdChanged || parentIdChanged || metaDataChanged) {
        // Parent form value has changed, update the grid
        this.getMappedFilters();
        const params = this.assignTableParams();
      if(this.gridComponent && this.gridComponent.params && this.gridComponent.params.search)
      { this.gridComponent.params.search = params.search; } 
        this.toShowRecords(params);
            setTimeout(() => {
            this.onRefresh();
          }, 100);
        
      }
 if (existingFormIdChanged) {
      this.disableNewAction();
    }

	}
}
