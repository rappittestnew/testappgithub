import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { ExportHistoryBase } from './export-history.base.model';
import { ExportHistoryApiConstants } from './export-history.api-constants';


@Injectable({
  providedIn: 'root'
})
export class ExportHistoryService {

  public baseService = inject(BaseService);


  getProtoTypingData(): Observable<any> {
    const subject: Observable<ExportHistoryBase> = new Observable(observer => {
      const data = require('base/assets/static-sample-data/export-history.json');
      observer.next(data as ExportHistoryBase);
    });
    return subject;
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = ExportHistoryApiConstants.getDatatableData;
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

}
