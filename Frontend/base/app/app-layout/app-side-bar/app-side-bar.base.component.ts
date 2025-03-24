import { AppLayoutBaseService } from '../app-layout.service.base'
import { TranslateService } from '@ngx-translate/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilBaseService } from "../../app-util.base.service";
import { Directive, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { PlatformLocation } from '@angular/common';


@Directive()
export class AppSideBarBaseComponent {
  menuType: string | undefined;
  floatDirection = "top-right";
  displayLeftMenu: any = true;
  displayRightMenu: any = true;
  badgeValue: number = Math.floor(Math.random() * 10);;

  items: any = [];

  isMobile: boolean = BaseAppConstants.isMobile;
  parentClassName: string = "";
  sideBarElements: any = []
  floatItems: any;
  fixedItems: any;
  floatDialog: any
  fixedSideBar: any
  floatMenuType: any
  fixedMenuType: any;
  menuRecursiveCount: number = 0;
  childrenItemINdex: number = 0;
  fixedSidebarOnInit: boolean = true;
  floatDialogOnInit: boolean = true;
  selectFirstMenuByDefault = BaseAppConstants.selectFirstMenuByDefault;
  @Input() currentPage: any;



  public bs = inject(AppLayoutBaseService);
  public translate = inject(TranslateService);
  public utilBase = inject(AppUtilBaseService);
  public router = inject(Router);
  public location = inject(PlatformLocation);



  getBadgeValue() {
    return this.badgeValue;
  }

  onInit(): void {
    // this.items = this.bs.getMenuItems();
    let values = this.bs.getMenuItems();
    this.sideBarElements.push(values.leftMenu)
    this.sideBarElements.push(values.rightMenu)
    let response = this.bs.getMenu();
    this.sideBarElements?.forEach((sideBarItems: any) => {
      if (sideBarItems?.element == "leftMenu") {
        sideBarItems["children"] = response?.left
      }
      if (sideBarItems?.element == "rightMenu") {
        sideBarItems["children"] = response?.right
      }
    })
    if (this.sideBarElements[0]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[0]
      this.floatMenuType = 'left'
      this.floatDirection = 'top-left'
    } else if (this.sideBarElements[1]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[1]
      this.floatMenuType = 'right'
      this.floatDirection = 'top-right'
    }
    if (this.sideBarElements[0]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[0]
      this.fixedMenuType = 'left'
    } else if (this.sideBarElements[1]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[1]
      this.fixedMenuType = 'right'
    }
    this.menuType = this.bs.getMenuType();
    let pageLink = window.location.href.split('#')[1];
    this.bs.getLeftMenuVisibility().subscribe(d => {
      this.displayLeftMenu = d
      if (this.fixedMenuType == 'left') {
        this.fixedSideBar = this.displayLeftMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'left') {
        this.floatDialog = this.displayLeftMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    this.bs.getRightMenuVisibility().subscribe(d => {
      this.displayRightMenu = d
      if (this.fixedMenuType == 'right') {
        this.fixedSideBar = this.displayRightMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'right') {
        this.floatDialog = this.displayRightMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    if (this.isMobile || this.sideBarElements[0]?.menuType == "float" || this.sideBarElements[1]?.menuType == "float") {
      this.floatDialog = false
      if (this.floatMenuType == 'left' || this.isMobile) {
        this.displayLeftMenu = false
        this.bs.updateLeftMenuVisibility(this.displayLeftMenu);
      }
      if (this.floatMenuType == 'right' || this.isMobile) {
        this.displayRightMenu = false
        this.bs.updateRightMenuVisibility(this.displayRightMenu);
      }
    }
    this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
    this.childrenItemINdex = 0
    this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
    this.closeSidebar();
  }

  onBeforeDialogHide() {
    if (this.floatMenuType == 'left' || this.isMobile) {
      this.bs.updateLeftMenuVisibility(this.displayLeftMenu = false);
    }
    if (this.floatMenuType == 'right' || this.isMobile) {
      this.bs.updateRightMenuVisibility(this.displayRightMenu = false);
    }
  }

  toggleList(rootIndex: any, level: any, itemIndex: any, sideBarMenuType: any, item: any) {
    if (level != 0) {
      itemIndex = rootIndex
    }

    $('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).toggle();
    if ($('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).css('display') == 'none') {
      if (this.selectFirstMenuByDefault && item.children) {
        $('.collapse').css('display', 'none')
        $('.sidebar-menu-items').addClass('collapsed');
      }
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('collapsed');
    } else {
      if (this.selectFirstMenuByDefault && item.children) {
        $('.collapse').css('display', 'none')
        $('.sidebar-menu-items').addClass('collapsed');
        $('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).css('display', 'block');
        if (item.children[0].page?.url) {
          this.highlightActiveMenu(item.children[0], itemIndex, sideBarMenuType);
          this.router.navigateByUrl(item.children[0].page?.url);
        }
      }
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).removeClass('collapsed');
    }
    if (!item.children) {
      this.onBeforeDialogHide()
      /* if (item?.page?.url) {
        item?.pathsInvolved?.forEach((obj: any) => {
          if (obj.indexOf(item?.page?.url) >= 0 || obj.indexOf(item?.link) >= 0) {
            this.highlightActiveMenu(item, itemIndex, sideBarMenuType)
          }
        })
      } else */
      if (item?.link || item?.url) {
        let customUrl = (item?.link || item?.url)
        window.open(customUrl, "_blank");
      }
    }
  }

  togglePopupShow() {
    $('.popover-content').show()
  }

  togglePopupHide() {
    $('.popover-content').hide()
  }

  mainMenuClick(event: any) {
    let menu = event.target.closest('a').className?.indexOf('menu-active')
    if (menu >= 0) {
      Array.from(document.querySelectorAll('.sidebar-heading-menu-items')).forEach((el) => el.classList.remove('menu-active'));
      setTimeout(() => {
        event.target.closest('a').className += ' menu-active'
      }, 100);
    }
  }

  highlightActiveMenu(item: any, itemIndex: any, sideBarMenuType: any, onInit: any = "") {
    if (onInit != 'onInit') {
      this.removeMenuActiveClasses()
    }
    setTimeout(() => {
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('menu-active')
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-1').addClass('menu-active')
    }, 100)
  }

  removeMenuActiveClasses() {
    Array.from(document.querySelectorAll('.sidebar-menu-items')).forEach((el) => el.classList.remove('menu-active'));
  }

  showSideBar(showSideBar: any) {
    if (showSideBar == 0) {
      return ((this.fixedMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    } else {
      return ((this.floatMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    }
  }

  getMenuImage(item: any) {
    return "assets/images/" + item?.iconFileName
  }

  iterateRecursiveArray(children: any, menuType: string, pageLink: any) {
    if (children && children?.length > 0) {
      children?.forEach((items: any) => {
        if (menuType == "fixed") {
          if (this.fixedItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        if (menuType == "float") {
          if (this.floatItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        items["menuRecursiveCount"] = ++this.menuRecursiveCount
        /* if (!items?.children && pageLink != "/") {
          items?.pathsInvolved?.forEach((obj: any) => {
            if (obj.indexOf(pageLink) >= 0) {
              this.highlightActiveMenu(items, this.childrenItemINdex - 1, menuType == 'fixed' ? 0 : 1, "onInit")
            }
          })
        } */
        if (items?.children && items?.children?.length > 0) {
          this.iterateRecursiveArray(items.children, menuType, pageLink)
        }
      })
    }
  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes?.currentPage?.currentValue) {
      this.highlightRootMenu()
    }
  }


  handleActiveRoute(item: any) {
    const currPage = window.location.hash?.slice(1)?.split('?')[0];
    if (item.pathsInvolved?.includes(currPage) && (item.element === "menuItem" || item.element == "menuGroup")) {
      return 'menu-active';
    }
    else
      return '';

  }
  activeChange(item: any, enabled: boolean, level: number) {
    const currPage = window.location.hash?.slice(1)?.split('?')[0];
    const eleId = `${item.label}${level}`
    if (enabled === false) {
      if (item.pathsInvolved.includes(currPage) && item.element === "menuItem") {
        $('#' + eleId).addClass('menu-active');
      }
    }
    this.highlightRootMenu();
  }


  highlightRootMenu() {
    let activeMenuElementClassList: any = document.querySelector('.sidebar-submenu-menu-items.menu-active')?.classList?.value?.split(' ')
    if (activeMenuElementClassList) {
      let classNameIndex = activeMenuElementClassList?.findIndex((element: any) => element.includes("sidebar-item-level"));
      const className = activeMenuElementClassList[classNameIndex];
      this.parentClassName = (className.split('-').slice(0, -1).join('-')) + "-1";
      Array.from(document.querySelectorAll('.sidebar-heading-menu-items')).forEach((el) => el.classList.remove('menu-active'));
      $('.' + this.parentClassName).addClass('menu-active');
    }
    else if (this.parentClassName) {
      $('.' + this.parentClassName).removeClass('menu-active');
    }
  }

  onMouseEnter(event: any, level: number) {
    let ele = event.target;
    if (ele && event.target?.className.includes('popover-wrapper' + level)) {
      let menus = event.target?.children[2];
      if (menus) {
        // to display the arrow
        ele.style.setProperty("--pseudo-visibility", 'visible');
        // For floated menu display
        let menuHeight = menus.clientHeight;
        let eleTop = ele.getBoundingClientRect().top;
        let eleRight = ele.getBoundingClientRect().right;
        let eleHeight = ele.clientHeight;
        event.target.children[2].style.left = eleRight + 'px';
        if ((eleTop < menuHeight / 2) || ((window.innerHeight - eleTop) < menuHeight / 2)) {
          if (eleTop > menuHeight) {
            // display on top of the icon if the overlay height can be occupied.
            event.target.children[2].style.top = (eleTop - menuHeight + ele.clientHeight) + 'px'
          } else if ((window.innerHeight - eleTop) > menuHeight) {
            // display on bottom of the icon if the overlay height can be occupied.
            event.target.children[2].style.top = eleTop + 'px'
          } else {
            // display from the top
            event.target.children[2].style.top = '60px';
          }
        } else {
          // display center aligned to the icon
          event.target.children[2].style.top = ((eleTop + (eleHeight / 2)) - (menuHeight / 2)) + 'px';
          event.target.children[2].style.left = eleRight + 'px';
        }
      } else {
        ele.style.setProperty("--pseudo-visibility", 'hidden');
      }
    }
  }


  closeSidebar() {
    this.router.events.subscribe((event: any) => {
      this.location.onPopState(() => { this.onBeforeDialogHide() });
    });
  }

  getPageUrl(item: any) {
    let level1 = item?.children?.length > 0 ? item?.children[0] : null;
    if (level1?.element == 'tabGroup') {
      let level2 = level1?.children?.length > 0 ? level1?.children[0] : null;
      if (level2?.element == 'tabGroup' && level2?.children[0]?.element == 'tabItem') {
        return (level2?.children[0]?.page?.url || level2?.children[0]?.customUrl || null)
      } else if (level2?.element == 'tabItem') {
        return (level2?.page?.url || level2?.customUrl || null)
      }
    } else if (level1?.element == 'tabItem') {
      return (level1?.page?.url || level1?.customUrl || null)
    } else {
      return null
    }
  }

}
