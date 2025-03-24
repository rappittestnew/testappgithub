import { inject } from "@angular/core";
import { Injectable } from "@angular/core";
import { AppLoaderService } from "@baseapp/app-loader.service";
import { BaseService } from "@baseapp/base.service";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { AuthApiConstants } from './auth.api-constants';
import { PrototypeVariables } from "./prototype.variables";

@Injectable({
  providedIn: 'root',
})
export class AuthBaseService {
  public baseService = inject(BaseService)
  private isAuthenticated: boolean = false;

  protected authObsr$ = new Subject<boolean>();
  public authChanges = this.authObsr$.asObservable();


  isAuthenticating: boolean = false;
  login(params: any) {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get(AuthApiConstants.login).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;
  }
  authenticate(params?: any) {
    // const url = AuthApiConstants.authenticate.url.replace('{APP_ID}',PrototypeVariables.APP_ID);
    this.isAuthenticating = true;
    const url = AuthApiConstants.authenticate.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url }).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;

  }
  recoverPassword(params: any) {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: '/login' }, params).subscribe(
        (data: any) => {
          observer.next(data);
        },
        (error: any) => {
          observer.error(error);
        }
      );
    });

    return currentUserSubject;
  }


  getGoogleAuthorized() {
    const url = '/rest/oauth2/authorization/google';
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url }).subscribe(
        (data: any) => {
          observer.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;
  }


  getUserInfo(params?: any) {
    this.isAuthenticating = true;
    const url = AuthApiConstants.getUserData.url;
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: url, handleError: false }).subscribe(
        (data: any) => {
          observer.next(data);
          this.authObsr$.next(data);
          this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error); 
          this.authObsr$.next(error);
          this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;
  }

  getLoginMethod() {
    const currentUserSubject = new Observable((observer: any) => {
      this.baseService.get({ url: '/login' }).subscribe(
        (data: any) => {
          observer.next(data);
          // this.isAuthenticating = false;
        },
        (error: any) => {
          observer.error(error);
          // this.isAuthenticating = false;
        }
      );
    });

    return currentUserSubject;
  }


  authSuccess() {
    this.authObsr$.next(true);
  }

  authFail() {
    this.authObsr$.next(false);
  }
}