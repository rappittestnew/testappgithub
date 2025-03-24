import { Component, EventEmitter, Output, inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientMappingBaseService } from '../client-mapping.base.service';
import { Subscription } from 'rxjs';
import { ClientMappingBase } from '../client-mapping.base.model';
import { AppConstants } from '@app/app-constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent {

  public config = inject(DynamicDialogConfig);
  public DynamicDialogRef = inject(DynamicDialogRef);
  public ClientMappingService = inject(ClientMappingBaseService);
  public messageService = inject(MessageService)
  public translateService = inject(TranslateService);
  public confirmationService = inject(ConfirmationService);
  public appUtilBaseService = inject(AppUtilBaseService);



  ClientMappingFormControls: UntypedFormGroup = new UntypedFormGroup({
    saEmail: new UntypedFormControl('', [Validators.required, Validators.email]),
    accessTokenExpiry: new UntypedFormControl('', [Validators.required]),
    additionalInfo: new UntypedFormControl('', []),
    userContextRequired: new UntypedFormControl('', []),
    producer: new UntypedFormControl('', []),
    consumer: new UntypedFormControl('', []),
    authenticationMode: new UntypedFormControl('', []),
  });
  id: any;
  rowEvent: any;
  subscriptions: Subscription[] = [];
  currentDefaultValues: any;
  validationMessage: string = '';
  formFieldConfig:any = {};
  detailFormConfig : any = {
    "outline" : false,
    "disabledFieldsByLookup" : [ ],
    "children" : [ 
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
            "label": "ACCESS_KEY",
            "value": "ACCESS_KEY"
          }, {
            "label": "RAPPIT_INTRA_COMMUNICATION",
            "value": "RAPPIT_INTRA_COMMUNICATION"
          }, {
            "label": "NO_AUTH",
            "value": "NO_AUTH"
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
    }
   ],
    "columns" : "2",
    "type" : "form",
  }
  ngOnInit() {
    this.ClientMappingFormControls.get("producer")?.disable({ emitEvent: false });
    this.ClientMappingFormControls.get("consumer")?.disable({ emitEvent: false });
    this.ClientMappingFormControls.get("authenticationMode")?.disable({ emitEvent: false });
    this.id = this.config.data.id;
    this.rowEvent = this.config.data.event;
    this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
    this.getDefaultValues();
  }
  onDestroy() {
    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  }
  isValidEmail(field: any): boolean {
    const emailRegex = AppConstants.emailRegex;
    if (!field || emailRegex.test(field)) {
      return true;
    }
      this.showMessage({
      severity: 'error',
      summary: '',
      detail: this.translateService.instant('SERVICE_ACCOUNT_EMAIL_IS_INVALID'),
      life: 5000
    });
    return false;
  }

validateJSON() { //validate additional info JSON 
  let isValid = true;
  if(this.ClientMappingFormControls.value.additionalInfo){
  try {
    JSON.parse(this.ClientMappingFormControls.value.additionalInfo); 
    isValid = true;
  } catch (error:any) {
    isValid = false;
    this.validationMessage = 'Invalid JSON: ' + error.message;
    this.showMessage({ severity: 'error', summary: '', detail: this.validationMessage, life: 5000 });

  }
  }
  return isValid

}

  getDefaultValues() {
    if (environment.prototype && this.id) {
      const params = {
        sid: this.id
      };
      const getByIdSubscription = this.ClientMappingService.getProtoTypingDataById(params).subscribe((res: any) => {
        res = JSON.parse(JSON.stringify(res))
        this.setDefaultValues(res);

      });
      this.subscriptions.push(getByIdSubscription);
    } else if (this.id) {
      const params = {
        sid: this.id
      };
      const dataSubscription = this.ClientMappingService.getById(params).subscribe((res: ClientMappingBase[]) => {
        this.setDefaultValues(res);
      });
      this.subscriptions.push(dataSubscription);
    }
    else {
      this.setDefaultValues({});
    }

  }

  setDefaultValues(data: any) { //setting default values for fields
    var uc = "No";
    if (data.authenticationMode == "BASIC") {
      uc = "Yes";
    }
    this.ClientMappingFormControls.patchValue({
      saEmail: data.saEmail,
      accessTokenExpiry: data.accessTokenExpiry,
      consumer: data.consumer,
      producer: data.producer,
      userContextRequired: uc,
      authenticationMode: data.authenticationMode,
      additionalInfo: JSON.stringify(data.additionalInfo)
    });
    this.currentDefaultValues = data;
  }
  cancel() {
    if(this.ClientMappingFormControls.dirty){
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
  updateValues() {
    let updateData = this.ClientMappingFormControls.value;
    updateData.authenticationMode = this.currentDefaultValues.authenticationMode; //not allowing to change values for Authentication mode 
    if (environment.prototype) {
      this.DynamicDialogRef.close("saved");
    }
    else if (this.isValidEmail(updateData.saEmail) || updateData.authenticationMode === "OAUTH2") {
      if (this.validateJSON()){
      let updateparams = {
        saEmail: updateData.saEmail,
        accessTokenExpiry: updateData.accessTokenExpiry,
        additionalInfo: updateData.additionalInfo ? JSON.parse(updateData.additionalInfo) : {},
            }
      let params = {
        ...this.currentDefaultValues,
        saEmail: updateparams.saEmail ?? updateData.saEmail,
        accessTokenExpiry:updateparams.accessTokenExpiry ?? updateData.accessTokenExpiry,
        additionalInfo: updateparams.additionalInfo ?? updateData.additionalInfo,
      };
      const updateSubscription = this.ClientMappingService.update(params).subscribe((res: any) => {
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
  validateDigits(event: any) { //to truncate if digits cross 5
    const inputValue = event.target.value;
    if (inputValue.length > 5) {
      event.target.value = inputValue.slice(0, 5);
    }
  }
}
