
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '../app-layout.service.base'
import { BaseAppConstants } from '../../app-constants.base'
import { AfterViewInit, Component, Directive, Input, QueryList, ViewChildren } from '@angular/core';
import { AppUtilBaseService } from "../../app-util.base.service";
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiConstants } from '@app/api.constants';
import { BaseService } from '@baseapp/base.service';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationUserBase} from '@baseapp/application-user/application-user/application-user.base.model';
import { ApplicationUserService } from '@baseapp/application-user/application-user/application-user.service';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { BaseApiConstants } from '@baseapp/api-constants.base';

@Directive()
export abstract class AppHeaderBaseComponent {
  selectedLang: any;
  displayLeftMenu = true;
  displayRightMenu = true;
  menuType!: string;
  headerElements: any;
  logo!: any;
  mobileLogo!: any;
  rightMenu: any;
  hamburgerMenu: any;
  hamburgerMenuRight: any;
  isMiddleMenuNotEmpty: boolean = true
  userLanguage ="";
  isMobile: boolean = BaseAppConstants.isMobile;
  appHeaderContentFloat: boolean = false
  isMenuFixed: Boolean = false;
  currentUserData: any;
  isPrototype = environment.prototype;
  loggedinUserDetails: any = {}
  languageOptions:any[]=[];
  langLabel: any = {
    "English": "English",
    "German": "Deutsch",
    "French": "Français",
    "Dutch": "Nederlands",
    "Chinese": "中国人",
    "Japanese": "ドイツ語",
    "Korean": "한국인",
    "Portuguese": "Português",
    "Spanish": "Español",
    "Polish": "Polski",
    "Russian": "Русский",
    "Ukrainian": "українська",
    "Norwegian": "norsk",
    "Hungarian": "magyar",
    "Romanian": "română",
    "Thai": "แบบไทย",
    "Turkish": "Türkçe"
  }
  subscriptions: Subscription[] = [];
  @Input() displayMenus: boolean | undefined;

  languageCodes:any[]=[];

  public translate = inject(TranslateService);
  public confirmationService = inject(ConfirmationService);
  public bs = inject(AppLayoutBaseService);
  public utilBase = inject(AppUtilBaseService);
  public router = inject(Router);
  public appGlobalService = inject(AppGlobalService);
  public baseService = inject(BaseService);

  @ViewChildren('DropdownWithSubMenu') dropdownsWithSubMenu!: QueryList<NgbDropdown>;
  public appUserService = inject(ApplicationUserService);
  public translateService = inject(TranslateService);



  setLanguageDefault(obj:any,code:any){
                try {
          if(obj){
            this.userLanguage = obj?.languages[0]?.code;
          }
          else if(code){
            this.userLanguage = code;
          }
          let payload={"languageCode":this.userLanguage}
          const serviceOpts = BaseApiConstants.updateLanguage;
          this.baseService.put(serviceOpts,payload).subscribe((response: any) => {
          },)
        }
        catch(error){
          console.log('error');
        }    
  }


  onInit(): void {
    this.headerElements = this.bs.getTopBarCofiguration();
    localStorage.setItem("formChanged", JSON.stringify(false));
    this.getMenuElement();
    this.getLoggedInUsedDetails();
    let response = this.bs.getMenu();
if (response?.topBarRight) {
      response.topBarRight.forEach((item: any) => {
        if (item?.languages?.length > 0) {
          item.languages = item.languages.map((language:any) => ({
            ...language,
            label: this.langLabel[language.name] || language.name // Adding label for respective language
          }));
        }
      });
    }
      this.headerElements?.middle?.forEach((headerItems: any) => {
        if (headerItems?.element == "leftPane") {
          headerItems["children"] = response?.topBarLeft
        }
        if (headerItems?.element == "middlePane") {
          headerItems["children"] = response?.topBarMiddle
        }
        if (headerItems?.element == "rightPane") {
                    headerItems["children"] = response?.topBarRight
          if (headerItems["children"]?.length > 0) {
            headerItems["children"]?.forEach((obj: any) => {
              if (obj?.languages?.length > 0) {
                this.languageCodes = [...obj?.languages];
                let selectedLanguage = this.currentUserData?.languageCode;
                if (selectedLanguage && this.languageCodes.some(l => l.code === selectedLanguage)) {        
                  this.selectedLang = this.languageCodes.find(l=>l.code==selectedLanguage);
                    this.translate.use(this.selectedLang.code);
                }
                else {
                  selectedLanguage = localStorage.getItem('selectedLanguage');
                  try {
                    const parsedLanguage = JSON.parse(selectedLanguage);
                    if (parsedLanguage) {
                      this.selectedLang = parsedLanguage;
                      this.translate.use(this.selectedLang.code);
                      if (!this.isPrototype) {
                        this.setLanguageDefault(null,this.selectedLang.code);
                      }
                    } else {
                      this.translate.use(obj?.languages[0].code);
                      if(!this.isPrototype) {
                        this.setLanguageDefault(obj,null);
                      }
                    }
                  } catch (error) {
                    console.error('Error parsing selected language from localStorage:', error);
                    this.translate.use(obj?.languages[0].code);
                    if(!this.isPrototype) {
                      this.setLanguageDefault(obj,null);
                    }
                  }
                }
              }
            })
          }
      }
    })
    this.headerElements?.left?.forEach((headerItems: any) => {
      if (headerItems?.element == "leftMenu") {
        headerItems["children"] = response?.left
        this.isMenuFixed = (response.left.length > 0 && headerItems.menuType == 'fixed');
      }
    })
    this.headerElements?.right?.forEach((headerItems: any) => {
      if (headerItems?.element == "rightMenu") {
        headerItems["children"] = response?.right
        this.rightMenu["children"] = response?.right
      }
    })
    if (response?.topBarLeft?.length <= 0 && response?.topBarMiddle?.length <= 0 && response?.topBarRight?.length <= 0) {
      this.isMiddleMenuNotEmpty = false
    }
    this.menuType = this.bs.getMenuType();
    this.getLogo();
    this.getMenuBar();
    this.bs.getLeftMenuVisibility().subscribe(d => { this.displayLeftMenu = d });
    this.bs.getRightMenuVisibility().subscribe(d => { this.displayRightMenu = d });
  }

ngAfterViewInit() {

    // Set offset for submenus to fix positioning
    this.dropdownsWithSubMenu?.forEach((dropdown: NgbDropdown, index: number) => {
      dropdown.popperOptions = (options) => ({
        ...options,
        modifiers: [
          ...(options.modifiers || []),
          {
            name: 'offset',
            options: {
              offset: [16, 16]
            },
          },
        ],
      });
    });

  }

  public showMenu(menuType: any): void {
    if (menuType == 'left') {
      this.bs.updateLeftMenuVisibility(this.displayLeftMenu = !this.displayLeftMenu);
    } else {
      this.bs.updateRightMenuVisibility(this.displayRightMenu = !this.displayRightMenu);
    }
  }

  getLogo() {
    const ele = (this.headerElements.left.find((t: { element: string; }) => t.element === "logo"));
    this.logo = `assets/images/` + ele.logoFileName;
    this.mobileLogo = `assets/images/` + ele.mobileLogoFileName;
    if (!this.mobileLogo) {
      this.mobileLogo = this.logo
    }
  }

  getMenuElement() {
    this.rightMenu = this.headerElements.right.find((t: { element: string; }) => t.element === "rightMenu");
  }

  onLanguageSwitch(lang: any) {
    if (!this.isPrototype) {
      this.callConfirmationService(lang);
    } else {
      localStorage.setItem('selectedLanguage', lang);
      this.selectedLang = lang;
      this.translate.use(lang.code);
    }
  }

  callConfirmationService(lang:any){
    let formChanged = localStorage.getItem("formChanged");
      if (formChanged && JSON.parse(formChanged)) {
        this.confirmationService.confirm({
          message: this.translateService.instant('DO_YOU_WANT_TO_DISCARD_ALL_UNSAVED_CHANGES_AND_RELOAD_QUESTION'),
          header: this.translateService.instant('CONFIRMATION'),
          icon: 'pi pi-info-circle',
          accept: () => {
            this.setLanguageDefault(null,lang.code);
            this.translate.use(lang.code);
            window.location.reload();
          },
          reject: () => {
            if(this.currentUserData['languageCode']){
              this.selectedLang = this.languageCodes.find(l=>l.code==this.currentUserData['languageCode']);
            }
          },
        });
    }
    else if (!this.isPrototype){
      this.setLanguageDefault(null,lang.code);
      this.translate.use(lang.code);
      window.location.reload();
        }
  }

  getMenuBar() {
    const ele = (this.headerElements.left.find((t: { element: string; }) => t.element === "leftMenu"));
    if (ele) {
      this.hamburgerMenu = `assets/images/` + ((ele.iconFileName) ? ele.iconFileName : 'hamburger_menu.svg');
    }
    const eleRight = (this.headerElements.right.find((t: { element: string; }) => t.element === "rightMenu"));
    if (eleRight) {
      this.hamburgerMenuRight = `assets/images/` + ((eleRight.menuIconFileName) ? eleRight.menuIconFileName : 'hamburger_menu.svg');
    }
  }

  navigateToHomePage() {
    this.router.navigateByUrl('/')
  }



  logoutUser(e: any, defaultLink: string) {
    window.location.href = `${window.location.origin}/logout`;
  }

  getLoggedInUsedDetails() {
    this.currentUserData = this.appGlobalService.getCurrentUserData() || {};
    this.loggedinUserDetails.userName = this.currentUserData?.firstName || 'Prototype User';
    this.loggedinUserDetails.email = this.currentUserData?.email || 'Prototype User'
  }

  checkSVG(fileName: any) {
    return fileName?.toLowerCase().includes('.svg')
  }
}