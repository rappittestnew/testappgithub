import { Directive, EventEmitter, Input, OnInit, Output, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject, Subscription, from, of } from 'rxjs';
import { ImportsService } from '../imports.service';
import { UploaderService } from '@baseapp/upload-attachment.service';
import { AppConstants } from '@app/app-constants';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { DialogService } from 'primeng/dynamicdialog';
interface ImportObject {
  tableName : string,
  importName : string,
  possibleInputFiles : any,
  allowDatechangeonImport : string,
  allowDateTimechangeonImport : string,
  allowNumberchangeonImport : string,
  dateformats : any,
  numberformats : any,
  roles : any

};
// @Component({
//   selector: 'app-import-page',
//   templateUrl: './import-page.component.html',
//   styleUrls: ['./import-page.component.scss']
// })

@Directive(
  {
    providers:[MessageService, ConfirmationService, DialogService]
  }
  )

export class ImportPageBaseComponent {

  @Input() ImportConfig:any;
  @Input() fromListPage:any;
  @Input() fromTableName:any;
  @Input() popupOpen:any;
  @Output() onAfterImportInitiate: EventEmitter<any> = new EventEmitter();
  @ViewChild('csvRef')
  csvRef!: any;
  @ViewChild('excelRef')
  excelRef!: any;
  @ViewChild('tableDropdown')
  tableDropdown!: any;
  @ViewChild('templateDropdown')
  templateDropdown!: any;

  id: any;

  public importsService = inject(ImportsService)
  public uploaderService = inject(UploaderService)
  public appUtilBaseService = inject(AppUtilBaseService)
  public translateService = inject(TranslateService)
  public messageService = inject(MessageService)
  public router = inject(Router)
  public appGlobalService = inject(AppGlobalService)

  importGroup: FormGroup = new FormGroup({
    tableName: new FormControl('', []),
    templateName: new FormControl('', [Validators.required]),
    FileType: new FormControl('', []),
    attachment: new FormControl(''),
    googleSheetLink: new FormControl('', []),
    dateFormat: new FormControl('', []),
    dateTimeFormat: new FormControl('', []),
    numberFormat: new FormControl('', [])
  });
  actionBarConfig: any = [];
  conditionalActions: any = {
    disableActions: [],
    hideActions: []
  }
  subscription!: Subscription;
  dateformat:any = [];
  datetimeformat:any= [];
  numberformat:any = [];
  displayUpload:any;
  inValidFields:any = {};
  updatedConfig:any[] =[];
  filterConfig:any[] =[];
  subscriptions: Subscription[] = [];
  //  isPageLoading:boolean = false;

  isMobile: boolean = BaseAppConstants.isMobile;
  isSearchFocused:boolean = false;
  showBreadcrumb = BaseAppConstants.showBreadcrumb;
  pageViewTitle: string = 'Add Imports';
  selectedtablename:any;
  selectedValues:any = {};
  templateDownloadLink: string = "";
  enableDownloadLink: boolean = false;
  allImportConfig: any;
  currentUserRoles:any;
  formErrors:any = {}; 
  fieldConfig:any={
    tableName:{label:"TABLE_TYPE"},
    templateName:{label:"TEMPLATE_TYPE"},
    FileType:{label:"FILE_TYPE"},
    attachment:{label:"ATTACHMENT"},
    googleSheetLink:{label:"GOOGLE_SHEET_LINK"},
    dateFormat:{label:"DATE_FORMAT"},
    dateTimeFormat:{label:"DATE_TIME_FORMAT"},
    numberFormat: {label:"NUMBER_FORMAT"}
  }
  fileTypeMap: Map<string, string> = new Map<string, string>;
  importBtndisabled: boolean = false;

  selectedImportType(event: any){
    this.importGroup.reset();
    this.importGroup.controls["tableName"].setValue(this.selectedtablename);
    this.importGroup.controls["attachment"].addValidators([Validators.required]);
    this.selectedValues.selectedImportFileType = event.value.fileTypes.reverse();
    this.importGroup.controls["templateName"].setValue(event.value.name);
    this.selectedFileType( this.selectedValues.selectedImportFileType[0])

    this.dateformat = event.value.dateFormat;
    this.datetimeformat = event.value.dateTimeFormat;
    this.numberformat = event.value.numberFormat;
    this.setDefaultValue();
  }
  //selecting the File type radio buttons
  selectedFileType(filetype:any){
    this.importGroup.controls["attachment"].setValue(null);
    this.selectedValues.selectedType = filetype;
    this.importGroup.controls["FileType"].setValue(this.selectedValues.selectedType)
    if(this.popupOpen == true){
      this.getTemplateLink();
   }
  }

  //Download Link for Template
  getTemplateLink() {
    this.enableDownloadLink = false;
    const params = {
      modelName: this.importGroup.controls["tableName"].value,
      templateName: this.importGroup.controls["templateName"].value,
    }
    if (params.modelName && params.templateName && !environment.prototype) {
      const dataSubscription = this.importsService.getTemplateLink(params).subscribe((res: any) => {
        if(this.selectedValues.selectedType === 'csv' && res.csv) {
          this.templateDownloadLink = AppConstants.attachmentBaseURL + res.csv;
          this.enableDownloadLink = true;  
        } else if(this.selectedValues.selectedType === 'excel' && res.excel) {
          this.templateDownloadLink = AppConstants.attachmentBaseURL + res.excel;
          this.enableDownloadLink = true;  
        }
      });
      this.subscriptions.push(dataSubscription);
    }
  }

  showMessage(config:any){
    this.messageService.clear();
    this.messageService.add(config);
  }
  checkValidation() {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.importGroup, this.formErrors, finalArr, this.inValidFields, this.fieldConfig)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), life: 5000 });
        setTimeout(() => {
          this.messageService.clear();
        }, 5000);
      }
      return false;
    }
    else {
      return true;
    }
  }

  //selecting table name
  selectedTable(event: any) {
    this.enableDownloadLink = false;
    this.selectedValues = {}
    this.selectedtablename = event.value.tableName;
    this.ImportConfig = event.value.imports;
    this.ImportConfig.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
    this.setDefaultImport()
  }

  setDefaultImport(){
    const key={ value: this.ImportConfig[0] }
    this.selectedImportType(key);
  }
  selectedImport(event:any){
    this.selectedImportType(event);

  }

  ImportAuth(roles:any, config:any) {
    this.filterConfig = []
    for (let i of config){
      const found = (roles.some((r: any) => i.roles.includes(r)) || i.roles.includes("all") || false);
      if (found){
        this.filterConfig.push(i);
      }
    }
    return environment.prototype ? config : this.filterConfig;
  }

  checkAuth(){
    this.updatedConfig = [];
    this.updatedConfig = this.ImportAuth(this.currentUserRoles,this.ImportConfig);
  }
  checkedAllImportConfig: any = [];
  checkallAuth(){
    for (let i of this.currentImpConfig){
      i.imports = this.ImportAuth(this.currentUserRoles,i.imports)
      if (i.imports.length){
        this.checkedAllImportConfig.push(i);
      }
    }
    this.currentImpConfig =this.checkedAllImportConfig;
  }

  onSelectattachment(event: any, ref: any) {
    if (ref.msgs.length > 0 && ref.msgs[0]?.severity == "error") {
      const attachmentError = this.appUtilBaseService.capitalizeFirstLetter(ref.msgs[0]?.detail) || this.translateService.instant("FILE_ATTACHMENT_FAILED_DOT_PLEASE_TRY_AGAIN_DOT_ENSURE_THE_FILE_MEETS_THE_REQUIRED_FORMAT_AND_SIZE_RESTRICTIONS");
      this.showMessage({ severity: 'error', summary: 'Error', detail: attachmentError, life: 5000 });
    } else {
      this.importGroup.controls.attachment.setValue(event.currentFiles[0]);
      this.appUtilBaseService.setImagePreview(event.files).subscribe((res: any) => {
        this.importGroup.controls.attachment.setValue(res.slice(0));
      });
    }
  }
  currentImpConfig: any[] = [];

  onInit(): void {
    this.currentUserRoles = this.appGlobalService.getCurrentUserData().userRoles ||[];
    const importSubscription = this.importsService.getImportConfig().subscribe((data: any) => {
      this.allImportConfig = data;
    });
    for (const prop in this.allImportConfig) {
      this.currentImpConfig.push({tableName:prop,imports:this.allImportConfig[prop]})
    }

    this.subscriptions.push(importSubscription);
    if(this.fromListPage == true){
      this.selectedtablename = this.fromTableName; 
      this.ImportConfig = this.findImpConfig(this.currentImpConfig,this.selectedtablename);
      this.ImportConfig.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
      this.checkAuth();
      this.setDefaultImport()
    }
    else{
      this.importGroup.controls["tableName"].addValidators([Validators.required]);
      this.checkallAuth()
    }
    //fileTypeInitialization
    this.fileTypeMap.set("csv", "CSV");
    this.fileTypeMap.set("excel", "Excel");
    this.currentImpConfig.sort((a, b) => a.tableName.localeCompare(b.tableName));
  }
  findImpConfig(list: any, tablename: any) {
    const filteredImp = list.find((x: { tableName: string; }) => x.tableName == tablename).imports;
    return filteredImp;
  }
  setDefaultValue(){
    this.importGroup.controls['dateFormat'].patchValue(this.dateformat && this.dateformat.length > 0 ? this.dateformat[0] : '');
    this.importGroup.controls['dateTimeFormat'].patchValue(this.datetimeformat && this.datetimeformat.length > 0 ? this.datetimeformat[0] : '');
    this.importGroup.controls['numberFormat'].patchValue(this.numberformat && this.numberformat.length > 0 ? this.numberformat[0] : '');
    // this.importGroup.controls['dateFormat'].disable();
    // this.importGroup.controls['dateTimeFormat'].disable();
    // this.importGroup.controls['numberFormat'].disable();
  }



  async initiateImport(isToastNotNeeded?: boolean) {
    if (this.checkValidation()) {
      this.importBtndisabled = true;
      const isTableCreationValid = await this.validateImport(); // To check whether the default import tables are created properly

      if (isTableCreationValid) {
        const data = {
          modelName: this.selectedtablename,
          templateName: this.importGroup.controls["templateName"].value,
          fileType: this.importGroup.controls["FileType"].value,
          rappitImport: this.importGroup.controls["attachment"].value,
          dateFormat: this.importGroup.controls['dateFormat'].value,
          dateTimeFormat: this.importGroup.controls['dateTimeFormat'].value,
          numberFormat: this.importGroup.controls['numberFormat'].value
        };

        const method = this.id ? 'update' : 'create';
        const requestedObj = data;
        this.messageService.clear();
        const attachmentFields = ['rappitImport'];
        const splittedData = this.appUtilBaseService.splitFileAndData(data, attachmentFields);

        if (Object.keys(splittedData.files).length > 0) {
          const saveSubscription = this.uploadAttachmentsandSaveData(requestedObj, splittedData).subscribe(
            (res: any) => {
              this.onAfterSave(res, data, method, isToastNotNeeded);
            },
            (err: any) => {
              this.importBtndisabled = false;
            }
          );
          this.subscriptions.push(saveSubscription);
        }
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Error',
          detail: this.translateService.instant('THE_IMPORT_PROCESS_CANNOT_BEGIN_BECAUSE_THE_NECESSARY_IMPORT_RELATED_TABLES_ARE_NOT_FOUND'),
          life: 5000
        });
        this.importBtndisabled = false;
      }
    } else {
      this.importBtndisabled = false;
    }
  }

  

  validateImport(): Promise<boolean> {
    this.importBtndisabled = true;
    return new Promise((resolve, reject) => {
      const validateSub = this.importsService.validateToImport().subscribe({
        next: (response) => {
          if (response) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }
      });
      this.subscriptions.push(validateSub);
    });
  }

  onAfterSave(res: any, data: any, method: string, isToastNotNeeded?: boolean) {
    this.importBtndisabled = false ;
    if (!isToastNotNeeded) {
      this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORD_SAVED_SUCCESSFULLY') });
    }
  }

  uploadAttachmentsandSaveData(data: any, splittedData: any): Observable<any> {
    const subject$ = new Subject();

    const completeReq = (resData: any,) => {
      resData ? subject$.next(resData) : subject$.error(resData);
      subject$.complete();
    }
    if (!this.id) {
      const requestedData = {...splittedData.data};
        requestedData.importStatus ="INITIATED";
      const saveSubscription = this.importsService.create(requestedData).subscribe(
        (createdData: any) => {
          const data = { ...splittedData.data, ...createdData };
          splittedData.data = data;
          this.id = data.sid;
          if (splittedData.files) {
            this.updateData(splittedData).subscribe(
              updatedData => completeReq(updatedData),
              err => {
                this.importBtndisabled = false ;
                completeReq(null)
              }
            );
          }
        },
        (err: any) => { 
          this.importBtndisabled = false ; 
          completeReq(null)})
      this.subscriptions.push(saveSubscription);
    }

    return subject$.asObservable()
  }

  updateData(splittedData: any) {
    const subject$ = new Subject();
    const updateSubscription = this.saveFiles(splittedData).subscribe((dataToUpdate: any) => {
      dataToUpdate.data.importId = this.id;
      dataToUpdate.data.importStatus = "FILE_UPLOADED";
      const isErrorEmpty = Object.keys(dataToUpdate.error).length === 0;
      if(isErrorEmpty){
      this.importsService.update(dataToUpdate.data).subscribe(
        (res: unknown) => {
          subject$.next(res);
          subject$.complete();
          this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('IMPORT_INITIATED_SUCCESSFULLY') });
          this.clearSelectedFiles();
          if(this.fromListPage == true){
            this.selectedtablename = this.fromTableName; 
            this.setDefaultImport()
          }
          else{
            this.selectedtablename = null;
            if(this.tableDropdown)
            this.tableDropdown.clear();
            if(this.templateDropdown)
            this.templateDropdown.clear();
          }
          this.id = '';
          this.onAfterImportInitiate.emit()
        },
        (err: any) => {
          subject$.error(null);
          subject$.complete();
          this.importBtndisabled = false ;
          this.clearSelectedFiles();
        }
      )
      }
    });
    this.subscriptions.push(updateSubscription);
    return subject$.asObservable()
  }

  saveFiles(splittedData: any) {
    const files:any={};
    const existingfiles:any={}
    const detailsform = null;
  Object.keys(splittedData.files).forEach(key => {
    splittedData.files[key].map((o:any)=>{
      if(!o.id){
        if(!files.hasOwnProperty(key)){
           files[key]=[];
        }
        files[key].push(o);
      }
      else{
        if(!existingfiles.hasOwnProperty(key)){
          existingfiles[key]=[];
       }
       existingfiles[key].push(o);
      }
    })
  })
      if (files && Object.values(files).filter((item:any) =>  (item||[])?.length).length) {

      return new Observable(observer => {
        this.uploaderService.saveAddedFiles(files, this.id, detailsform).subscribe((res: any) => {
          let fData: any = {};
          for (const key in res.dataToResend) {
            if (res.dataToResend[key] instanceof Array) {
              const tempArr = res.dataToResend[key].flat();
              fData[key] = (tempArr.filter((n: any, i: any) => tempArr.indexOf(n) === i)).filter(Boolean);
            } else {
              fData[key] = [res.dataToResend[key]];
            }
            fData[key] = this.appUtilBaseService.removeImagePreviewProperties(fData[key]);
          }

          const finalData = { data: { ...splittedData.data, ...fData }, error:res.error};
          const isErrorEmpty = Object.keys(res.error).length === 0;
          if (!isErrorEmpty) {
            const errorArr: any = [];
            // Object.keys(res.error).forEach((key) => {
              errorArr.push("Failed to upload the file");
            // })
            
            if (errorArr.length > 0){
              this.id = '';
              this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(errorArr), life: 5000 });
            }
          }
          observer.next(finalData);
          observer.complete();
        }, (err: any) => {
          observer.error(err);
        });
      });
    } else {
      return of(splittedData)
    }
  }
  clearSelectedFiles() {
    if(this.csvRef)
    this.csvRef.clear();
    if(this.excelRef)
    this.excelRef.clear();
  }
  onAfterViewInit() {
		
  }

}




