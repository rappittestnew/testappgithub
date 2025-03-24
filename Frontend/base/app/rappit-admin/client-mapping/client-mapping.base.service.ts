import { Injectable, inject } from '@angular/core';
import { BaseService } from '@baseapp/base.service';
import { Observable } from 'rxjs';
import { ClientMappingBase } from './client-mapping.base.model';
import { ClientMappingApiConstants } from './client-mapping.api-constants';

@Injectable({
  providedIn: 'root'
})
export class ClientMappingBaseService {

  public baseService = inject(BaseService);

  getProtoTypingData(): Observable<any> {
    const subject: Observable<ClientMappingBase> = new Observable(observer => {
      const data = require('base/assets/static-sample-data/client-mapping.json');
      observer.next(data as ClientMappingBase);
    });
    return subject;
  }

  getProtoTypingDataById(...args: any): Observable<any> {
    const params = args[0];
    const key = Object.keys(params);
    let foundData: boolean = false;
    let data: any = {};
    const subject: Observable<ClientMappingBase> = new Observable(observer => {
      const response = require('base/assets/static-sample-data/client-mapping.json');
      response.map((o: any) => {
        foundData = key.every((d: string) => {
          return o[d] == params[d];
        })
        if (foundData) {
          data = o;
        }
      })
      observer.next(data as ClientMappingBase);
    });
    return subject;
  }

  getDatatableData(...args: any): Observable<any> {
    const serviceOpts = ClientMappingApiConstants.getDatatableData;
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
  setupCall(...args: any): Observable<any> {
    const serviceOpts = ClientMappingApiConstants.setup;
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
  generate(...args: any): Observable<any> {
    const serviceOpts = ClientMappingApiConstants.generate;
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

  getById(...args: any): Observable<any> {
    const serviceOpts = ClientMappingApiConstants.getById;
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
  update(...args: any): Observable<any> {
    const serviceOpts = ClientMappingApiConstants.update;
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

}
