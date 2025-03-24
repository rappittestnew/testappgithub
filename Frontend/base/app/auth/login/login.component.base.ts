import { inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@app/auth/auth.service";
import { AppUtilBaseService } from "@baseapp/app-util.base.service";
import { MessageService } from "primeng/api";
import { CookieService } from 'ngx-cookie-service';


export class LoginComponentBase {

    public authService = inject(AuthService);
    public messageService = inject(MessageService);
    public appUtilService = inject(AppUtilBaseService);
    public router = inject(Router);
    onInit() {
        this.initForm();
    }

    initForm() {

    }

    authenticate() {
        this.authService.isAuthenticating = true;

        const origin = window.location.origin;
        window.location.href = `${window.location.origin}/oauth2/authorization/google`;

        // this.authService.getGoogleAuthorized().subscribe((res: any) => {
        //     this.showMessage({ severity: 'success', summary: '', detail: 'User authenticated Successfully' });
        // })
    }

    showMessage(config: any) {
        this.messageService.clear();
        this.messageService.add(config);
    }

    loadForgotPasswordPage() {
        this.router.navigateByUrl('auth/forgot-password')
    }

}
