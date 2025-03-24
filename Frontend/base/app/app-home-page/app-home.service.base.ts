import { Injectable,inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AppHomeBaseService {

  public appGlobalService = inject(AppGlobalService);
 
  

  config : any = [ {
  "expanded" : false,
  "folder" : true,
  "data" : {
    "properties" : { }
  },
  "children" : [ {
    "expanded" : false,
    "folder" : true,
    "data" : {
      "properties" : {
        "detailPagePopupWidth" : 70,
        "tileType" : "type_1",
        "outline" : false,
        "label" : ""
      }
    },
    "children" : [ {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile1",
          "field" : "homeTile",
          "label" : "TILE_1",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 1",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile2",
          "field" : "homeTile",
          "label" : "TILE_2",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 2",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile3",
          "field" : "homeTile",
          "label" : "TILE_3",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 3",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile4",
          "field" : "homeTile",
          "label" : "TILE_4",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 4",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile5",
          "field" : "homeTile",
          "label" : "TILE_5",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 5",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    }, {
      "expanded" : false,
      "folder" : false,
      "data" : {
        "properties" : {
          "accessControl" : [ "App Admin" ],
          "detailPagePopupWidth" : 70,
          "outline" : false,
          "data" : "homeTile6",
          "field" : "homeTile",
          "label" : "TILE_6",
          "class" : "home-tile"
        }
      },
      "title" : "Tile 6",
      "type" : "homeTile",
      "key" : "homeTile",
      "selected" : false
    } ],
    "title" : "Home Page",
    "type" : "homePage",
    "key" : "homePage",
    "selected" : false
  } ],
  "title" : "Page",
  "type" : "page",
  "key" : "page",
  "selected" : false
} ];
  
 currentUserRoles = (this.appGlobalService.getCurrentUserData()).userRoles;
 checkAccess: any = (o: string) => this.currentUserRoles.includes(o);

  public getLandingPageData() {
    let accessibleData: any = {
      children: []
    };
    const data: any = (this.config.find((t: { type: string; }) => t.type === "page"))?.children[0];
    if (!environment.prototype) {
      data.children?.filter((tileProps: any) => {
        const tile = tileProps.data?.properties;
        if (tile.accessControl && tile.accessControl.length > 0) {
          if (tile.accessControl.some(this.checkAccess) || tile.accessControl.includes('all'))
            accessibleData.children.push(tileProps);
        }
        else {
          accessibleData.children.push(tileProps);
        }
      })
      accessibleData = { ...data, ...accessibleData };
    }
    else {

      accessibleData = data;
    }
    return accessibleData;
  }
}