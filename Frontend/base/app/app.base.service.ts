import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiConstants } from './api-constants.base';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AppBaseService {
  public baseService = inject(BaseService);


  getWorkFlowConfig(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.workFlowConfig;
    const params = args[0];

    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  getUserRoles(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getUserRoles;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getPrototypingworkflow(workflowType: string): Observable<any> {
    const folderName: string = 'workflow';
    const subject: Observable<any> = new Observable(observer => {
      const data = require(`base/assets/${folderName}/${workflowType}.json`);
      observer.next(data as any);
    });
    return subject;
  }

  getRoles(): Observable<any> {
    const subject: Observable<any> = new Observable(observer => {
      const data = require(`base/assets/role.json`);
      observer.next(data as any);
    });
    return subject;
  }

  getWorkflowHistoryTable(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.workflowHistory;
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

  getRCToken(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getRCToken;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }

  getRCBaseUrl(...args: any): Observable<any> {
    const serviceOpts = BaseApiConstants.getRCBaseUrl;
    const params = args[0];
    const subject = new Observable(observer => {
      this.baseService.get(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
    return subject;
  }
}


