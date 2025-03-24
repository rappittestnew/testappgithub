import { Component, EventEmitter, Output, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AppConstants } from '@app/app-constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProviderMappingBaseService } from '../provider-mapping.base.service';
import { ProviderMappingBase } from '../provider-mapping.base.model';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss']
})
export class ProviderDetailComponent {

  public config = inject(DynamicDialogConfig);
  public DynamicDialogRef = inject(DynamicDialogRef);
  public ProviderMappingService = inject(ProviderMappingBaseService);
  public messageService = inject(MessageService)
  public appUtilBaseService = inject(AppUtilBaseService);
  public translateService = inject(TranslateService);
  public confirmationService = inject(ConfirmationService);

  detailFormConfig : any = {
    "outline" : false,
    "disabledFieldsByLookup" : [ ],
    "children" : [ {
      "allowEditing" : "yes",
      "fieldName" : "saEmail",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "SERVICE_ACCOUNT_MAIL",
      "type" : "formField",
      "mandatory" : "yes",
      "field" : "saEmail",
      "uiType" : "email",
      "name" : "saEmail",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "saEmail"
    }, 
    {
      "allowEditing" : "yes",
      "fieldName" : "clientId",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "CLIENT_ID",
      "type" : "clientId",
      "mandatory" : "yes",
      "field" : "clientId",
      "uiType" : "text",
      "name" : "clientId",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "clientId"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "clientSecret",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "CLIENT_SECRET",
      "type" : "clientSecret",
      "mandatory" : "yes",
      "field" : "clientSecret",
      "uiType" : "text",
      "name" : "clientSecret",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "clientSecret"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "apiKey",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "API_KEY",
      "type" : "apiKey",
      "mandatory" : "yes",
      "field" : "apiKey",
      "uiType" : "text",
      "name" : "apiKey",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "apiKey"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "issuerURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "ISSUER_URL",
      "type" : "issuerURL",
      "mandatory" : "yes",
      "field" : "issuerURL",
      "uiType" : "link",
      "name" : "issuerURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "issuerURL"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "tokenURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "TOKEN_URL",
      "type" : "tokenURL",
      "mandatory" : "yes",
      "field" : "tokenURL",
      "uiType" : "link",
      "name" : "tokenURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "tokenURL"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "providerName",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "PROVIDER_NAME",
      "type" : "providerName",
      "mandatory" : "yes",
      "field" : "providerName",
      "uiType" : "text",
      "name" : "providerName",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "providerName"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "authenticationMode",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "AUTHENTICATION_MODE",
      "type" : "authenticationMode",
      "mandatory" : "yes",
      "field" : "authenticationMode",
      "uiType" : "select",
      "name" : "authenticationMode",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "authenticationMode",
      "allowedValues": {
        "values": [
          {
            "label": "OAUTH2",
            "value": "OAUTH2"
          }, {
            "label": "BASIC",
            "value": "BASIC"
          }, {
            "label": "API_KEY",
            "value": "API_KEY"
          }
          , {
            "label": "SERVICE_ACCOUNT",
            "value": "SERVICE_ACCOUNT"
          }],
        "conditions": {
          "conditionType": "auto",
          "conditions": []
        }
      }
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "username",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "USERNAME",
      "type" : "username",
      "mandatory" : "yes",
      "field" : "username",
      "uiType" : "text",
      "name" : "username",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "username"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "password",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "PASSWORD",
      "type" : "password",
      "mandatory" : "yes",
      "field" : "password",
      "uiType" : "text",
      "name" : "password",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "password"
    },
    {
      "allowEditing" : "yes",
      "fieldName" : "baseURL",
      "data" : "",
      "isPrimaryKey" : false,
      "label" : "BASE_URL",
      "type" : "baseURL",
      "mandatory" : "yes",
      "field" : "baseURL",
      "uiType" : "link",
      "name" : "baseURL",
      "fieldType" : "string",
      "allowViewing" : "yes",
      "fieldId" : "baseURL"
    },
   ],
    "columns" : "2",
    "type" : "form",
  }
  ProviderMappingFormControl: UntypedFormGroup = new UntypedFormGroup({
    saEmail: new UntypedFormControl('', []),
    clientId: new UntypedFormControl('', []),
    clientSecret: new UntypedFormControl('', []),
    apiKey: new UntypedFormControl('', []),
    issuerURL: new UntypedFormControl('', []),
    userContextRequired: new UntypedFormControl('', []),
    tokenURL: new UntypedFormControl('', []),
    baseURL: new UntypedFormControl('', [Validators.required]),
    providerName: new UntypedFormControl('', []),
    authenticationMode: new UntypedFormControl('', []),
    username: new UntypedFormControl('', []),
    password: new UntypedFormControl('', []),
    additionalInfo: new UntypedFormControl('', [])
  });

  id: any;
  rowEvent: any;
  subscriptions: Subscription[] = [];
  currentDefaultValues: any;
  formErrors:any = {};
  inValidFields:any = {};
  formFieldConfig:any = {};
  showFields:any ={};
  validationMessage:string = '';


  ngOnInit() {
    this.ProviderMappingFormControl.get("providerName")?.disable({ emitEvent: false });
    this.ProviderMappingFormControl.get("authenticationMode")?.disable({ emitEvent: false });

    this.id = this.config.data.id;
    this.rowEvent = this.config.data.event;
    this.getDefaultValues();
    this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
    this.appUtilBaseService.configureValidators(this.ProviderMappingFormControl, this.formFieldConfig);
  }

  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }

  getDefaultValues() { //get the values of a specific record
    if (environment.prototype && this.id) {
      const params = {
        sid: this.id
      };
      const getByIdSubscription = this.ProviderMappingService.getProtoTypingDataById(params).subscribe((res: any) => {
        res = JSON.parse(JSON.stringify(res))
        this.setDefaultValues(res);

      });
      this.subscriptions.push(getByIdSubscription);
    } else if (this.id) {
      const params = {
        sid: this.id
      };
      const dataSubscription = this.ProviderMappingService.getById(params).subscribe((res: ProviderMappingBase[]) => {
        this.setDefaultValues(res);
      });
      this.subscriptions.push(dataSubscription);
    }
    else {
      this.setDefaultValues({});
    }

  }
  setDefaultValues(data: any) {
    this.showFields = {};
    switch (data.authenticationMode) {
      case "OAUTH2":
        this.showFields = ["tokenURL","issuerURL","clientId","clientSecret"]
        break;
    
      case "API_KEY":
        this.showFields = ["apiKey"]
        break;
    
      case "BASIC":
        this.showFields = ["username","password"]
        break;
    
      case "SERVICE_ACCOUNT":
        this.showFields = ["saEmail"]
        this.ProviderMappingFormControl.get("saEmail")?.addValidators([Validators.email]); 
        break;
      default:
        break;
    }
    this.showFields.push("baseURL");
    this.showFields.forEach((field: any) => {
      if (field != "issuerURL") {
        const control = this.ProviderMappingFormControl.get(field);
        if (control) {
          control.addValidators([Validators.required]);
          control.updateValueAndValidity();
        }
      }
    });
    this.ProviderMappingFormControl.patchValue({
      providerName: data.providerName,
      saEmail: data.saEmail,
      authenticationMode: data.authenticationMode,
      additionalInfo: JSON.stringify(data.additionalInfo),
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      apiKey: data.apiKey,
      issuerURL: data.issuerURL,
      tokenURL: data.tokenURL,
      username: data.username,
      password: data.password,
      baseURL: data.baseURL,
 
    });
    this.currentDefaultValues = data;
  }
  cancel() {
    if(this.ProviderMappingFormControl.dirty){
      this.confirmationService.confirm({
		    message:this.translateService.instant('DO_YOU_WANT_TO_DISCARD_ALL_UNSAVED_CHANGES_QUESTION'),
			header: this.translateService.instant('CONFIRMATION'),

			icon:'pipi-info-circle',
			accept:()=>{
        this.DynamicDialogRef.close();
			},
			reject:()=>{
			},
		});
	}
    else
    this.DynamicDialogRef.close();
  }
  updateValues() { //to update the record
    let updateData = this.ProviderMappingFormControl.value;
    if (environment.prototype) {
      this.DynamicDialogRef.close("saved");
    }
    else if (this.checkValidations()) {
      if(this.validateJSON()){
      let updateparams = this.showFields.reduce((acc:any, field:any) => {
        acc[field] = updateData[field]; 
        return acc;
      }, {});
      let params = { ...this.currentDefaultValues }; 

      this.showFields.forEach((field: any) => {
        if (updateparams[field] !== undefined) {
          params[field] = updateparams[field];  
        }
      });
      params = {
        ...params,
        additionalInfo: updateData.additionalInfo ? JSON.parse(updateData.additionalInfo) : {}
      }
      const updateSubscription = this.ProviderMappingService.update(params).subscribe((res: any) => {
        if (res)
        this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORD_SAVED_SUCCESSFULLY') });
      });
      this.subscriptions.push(updateSubscription);
      this.DynamicDialogRef.close("saved");
    }
    }
  }
  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }
  validateJSON() {
    let isValid = true;
    if(this.ProviderMappingFormControl.value.additionalInfo){
    try {
      JSON.parse(this.ProviderMappingFormControl.value.additionalInfo); 
      isValid = true;
    } catch (error:any) {
      isValid = false;
      this.validationMessage = 'Invalid JSON: ' + error.message;
      this.showMessage({ severity: 'error', summary: '', detail: this.validationMessage, life: 5000 });
  
    }
    }
    return isValid
  
  }
  checkValidations(): boolean { 
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.ProviderMappingFormControl, this.formErrors, finalArr, this.inValidFields,this.formFieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
      }
      return false;
    }
    if(this.detailFormConfig.children) {
      let multComp = this.detailFormConfig.children.filter((ele: any) => ele.multipleValues && ele.columns);
      if(multComp.length) {
        let mulFormErrors: string[] = [];
        multComp.forEach((config: any) => {
          let colnames = config.columns.filter((col: any) => col.name !== 'jid').map((col: any) => col.name);
          let values = this.ProviderMappingFormControl.value[config.field];
          values = values.filter((row: any) => {
            return Object.keys(row) && Object.keys(row).find(key => colnames.includes(key));
          });
          this.ProviderMappingFormControl.get(config.field)?.patchValue(values);
          mulFormErrors = [...mulFormErrors, ...this.appUtilBaseService.validateMultipleComp(this.ProviderMappingFormControl.value, config)];          
        });
        if(mulFormErrors.length) {
          this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(mulFormErrors), life: 5000 });
          return false;
        }
      }
    }
    return true;
  }
}
