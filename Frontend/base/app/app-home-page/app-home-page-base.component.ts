import { BaseAppConstants } from "@baseapp/app-constants.base";
import { AppHomeBaseService } from "./app-home.service.base";
import { AppUtilBaseService } from "../app-util.base.service";
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from "@ngx-translate/core";
import { inject } from "@angular/core";

export class AppHomePageBaseComponent {

    tiles: any;
    tilesPerRow: any = 4
    isMobile: boolean = BaseAppConstants.isMobile;
    tileWidth: any = "20%"
    displayMenus = false;
    public bs = inject(AppHomeBaseService);
    public utilBase = inject(AppUtilBaseService);
    public _sanitize = inject(DomSanitizer);
    public translateService = inject(TranslateService);


    onInit(): void {
        this.tiles = this.bs.getLandingPageData()
        let tiles = this.tiles.data?.properties?.numberOfTilesPerRow
        this.tilesPerRow = tiles
        if (tiles == 3) {
            this.tileWidth = "30%"
        } else if (tiles == 4) {
            this.tileWidth = "20%"
        } else if (tiles == 5) {
            this.tileWidth = "15%"
        } else if (tiles > 5) {
            this.tilesPerRow = 6
            this.tileWidth = "10%"
        } else {
            this.tilesPerRow = 5
        }
    }

    getImageUrl(tile: any) {
        if (tile.data.properties?.image.icon) {
            return "assets/images/" + tile.data.properties?.image?.icon[0]?.fileName
        } else {
            return ""
        }
    }

    getSanitizedContent(label: string) {
        return this._sanitize.bypassSecurityTrustHtml(this.translateService.instant(label));
    }

    getStyles() {
        let value: any
        if (this.tiles.data?.properties?.backgroundImage?.type == 'uploaded') {
            value = `url('assets/images/${this.tiles.data?.properties?.backgroundImage?.icon[0].fileName}')`
        } else {
            value = this.tiles.data?.properties?.backgroundColor
        }
        let styleObj: any = {
            "background": value
        };
        return styleObj;
    }
}
