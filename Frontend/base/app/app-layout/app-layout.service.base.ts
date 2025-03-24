import { Injectable,inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AppLayoutBaseService {
  private displayMenu = new Subject<boolean>();
  private menuType: string = 'float';
  private displayLeftMenu = new Subject<boolean>();
  private displayRightMenu = new Subject<boolean>();
  
   public titleService = inject(Title)
   public appGlobalService = inject(AppGlobalService);
  config : any = {"left":[{"detailPagePopupWidth":70,"outline":false,"infiniteScroll":false,"urlIconFileName":"Company Logo.svg","valueChange":true,"logoFileName":"Company Logo.svg","currentNode":"66361e42-9bc8-4c8b-892b-1c5cb7b9cd6e","mobileLogoFileName":"Company Logo.svg","element":"logo"},{"detailPagePopupWidth":70,"outline":false,"menuType":"fixed","hideSidebarOnCollapse":false,"element":"leftMenu"},{"detailPagePopupWidth":70,"outline":false,"element":"appTitle"}],"middle":[{"detailPagePopupWidth":70,"outline":false,"element":"leftPane"},{"detailPagePopupWidth":70,"outline":false,"element":"middlePane"},{"detailPagePopupWidth":70,"outline":false,"element":"rightPane"}],"right":[{"children":[{"detailPagePopupWidth":70,"outline":false,"link":"/logout","label":"Logout","element":"logout"}],"element":"user"},{"detailPagePopupWidth":70,"outline":false,"menuType":"float","element":"rightMenu"}]};

  public getLeftMenuVisibility(): Observable<boolean> {
    return this.displayLeftMenu.asObservable();
  }

  public updateLeftMenuVisibility(displayLeftMenu: boolean): void {
    this.displayLeftMenu.next(displayLeftMenu);
  }

  public getRightMenuVisibility(): Observable<boolean> {
    return this.displayRightMenu.asObservable();
  }

  public updateRightMenuVisibility(displayRightMenu: boolean): void {
    this.displayRightMenu.next(displayRightMenu);
  }

  public getMenuType(): string {
    return this.menuType;
  }

  public getTopBarCofiguration() {
    return this.config;
  }

  public getMenuItems() {

    const leftMenu: any = (this.config.left.find((t: { element: string; }) => t.element === "leftMenu"))
    const rightMenu: any = (this.config.right.find((t: { element: string; }) => t.element === "rightMenu"));
    let left = (leftMenu?.children ? leftMenu : false)
    // return (left || rightMenu);
    return { leftMenu: leftMenu, rightMenu: rightMenu }
  }

  public getStyles(item: any) {
    let properties = ['fontsize', 'font-family', 'color', 'background-color', 'height', 'width', 'margin', 'padding'];
    let styleObj: any = {};
    if (item) {
      for (const key in item) {
        if (key != "backgroundColor") {
          if (properties.includes((key.toLowerCase()))) {
            styleObj[key] = item[key];
          }
        }
        else if(key == "backgroundColor") {
          styleObj['background-color'] = item['backgroundColor'];
        }
      }
    }
    return styleObj;
  }

  getConfigData(): Observable<any> {
    const subject: Observable<any> = new Observable(observer => {
      const data = require('base/assets/menu.json');
      observer.next(data as any);
    });
    return subject;
  }
  
  public setAppTitle() {
    let appTitleObj: any = (this.config.left.find((t: { element: string; }) => t.element === "appTitle"))
    if (appTitleObj?.title) {
      this.titleService.setTitle(appTitleObj?.title);
    }
  }
  
  public setAppLogo() {
    let appLogoObj: any = (this.config.left.find((t: { element: string; }) => t.element === "logo"));
    let favIcon: any = document.querySelector('#appLogo');
    if (appLogoObj?.urlIconFileName) {
      favIcon.href = `assets/images/` + appLogoObj.urlIconFileName;
    } else {
      favIcon.href = `assets/images/` + appLogoObj.logoFileName;
    }
  }
getMenu() {
    let menuData: any;
    if (environment.prototype) {
      this.getConfigData().subscribe((response) => {
        menuData = response;
      })
    }
    else {
      let currentUserData = this.appGlobalService.getCurrentUserData();
      menuData = currentUserData ? JSON.parse(currentUserData.menuRole) : {};
    }
    menuData = this.customizeMenuContent(menuData);
    return menuData;
  }
customizeMenuContent(menu: any) {
    return menu;
  }
}