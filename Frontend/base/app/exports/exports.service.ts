import { Injectable, inject } from '@angular/core';
import { BaseService } from '@baseapp/base.service';
import { Observable } from 'rxjs';
import { ExportsApiConstants } from './exports.api-constants';
import { NotifiactionService } from '@baseapp/notification.service';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ExportsService {
  public baseService = inject(BaseService)
  public notification = inject(NotifiactionService)
  public translateService = inject(TranslateService)

  initiateExport(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.create;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          let errorMsg = `${this.translateService.instant('EXPORT_FAILED')}`;
          this.notification.showMessage({ severity: 'error', icon: '', summary: '', detail: errorMsg, life: 5000 })
          observer.error(err);
        });
    });

    return subject;
  }
  update(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.update;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.put(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  create(...args: any): Observable<any> {
    const serviceOpts = ExportsApiConstants.create;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }
  getExportConfig(): Observable<any> {
    const subject: Observable<any> = new Observable(observer => {
      const data = require('base/assets/export.json');
      observer.next(data as any);
    });
    return subject;
  }


}

