import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { PrototypeVariables } from './auth/prototype.variables';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { LoaderService } from './loader.service';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { AppGlobalService } from './app-global.service';
import { HttpErrorResponse } from '@angular/common/http';

export class AppBaseComponent {
  title = '';
  blocked = false;
  //appId : string = PrototypeVariables.APP_ID;
  //prototypeUrl = new URL(PrototypeVariables.DESIGN_STUDIO_URL).origin;
  //url: string = `${this.prototypeUrl}?appId=${this.appId}`;
  isPrototype = environment.prototype;
  isAuthenticated: boolean = false;
  isAPITrigered: boolean = false;
  isPagesConfigured: boolean = false;
  //safeSrc: SafeResourceUrl | undefined;
  public translate = inject(TranslateService)
  public bs = inject(AppLayoutBaseService)
  public sanitizer = inject(DomSanitizer)
  public loaderService = inject(LoaderService)
  public authService = inject(AuthService);
  public appGlobalService = inject(AppGlobalService);

  onInit(): void {
    this.checkAuth();
    this.translate.use('en')
    this.bs.setAppTitle();
    this.bs.setAppLogo();
    this.loaderService.spinnerChanges.subscribe(res => {
      this.blocked = res;
    })

    //this.url = this.url.replace("http://", "https://");
    //this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.url);


  }

  checkAuth() {
    if (environment.prototype) {
      this.isAuthenticated = true;
      this.isPagesConfigured = true;
    } else if (window.location.hash === '#/logout' || window.location.hash.split('?')[0] === '#/error') {
      this.isAuthenticated = true;
      this.isPagesConfigured = true;
    } else {
      this.authService.authChanges.subscribe((res: any) => {
        if (res instanceof HttpErrorResponse) {
          this.isAuthenticated = false;
          if (res?.error?.STATUS_CODE != '401' && res?.error?.STATUS_CODE) {
            this.isAPITrigered = true;
          }
        } else {
          this.isAuthenticated = res;
        }
        if (this.isAuthenticated) {
          this.isAPITrigered = true;
          this.isPagesConfigured = this.checkMenuRoleConfigured();
        }
      })
    }
  }

  checkMenuRoleConfigured() {
    let menuArray: any = this.appGlobalService.getCurrentUserData()?.menuRole;
    if (menuArray) {
      let menuRoles: any = JSON.parse(menuArray);
      if (menuRoles?.left?.length > 0 || menuRoles.right?.length > 0 || menuRoles?.topBarLeft?.length > 0 || menuRoles?.topBarMiddle?.length > 0 || menuRoles?.topBarRight?.length > 1) {
        return true;
      }
    }
    return false;
  }
}
