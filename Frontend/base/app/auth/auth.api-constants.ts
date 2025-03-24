import { BaseApiConstants } from "@baseapp/api-constants.base";
export class AuthApiConstants {

    public static readonly authenticate: any = {
        url: BaseApiConstants.apihost + '/applicationusers/authenticate',
        method: 'GET',
        showloading: true
    };
    public static readonly login: any = {
        url: '/login',
        method: 'GET',
        showloading: true
    };
    public static readonly getUserData: any = {
        url: BaseApiConstants.apihost + '/applicationusers/user-details',
        method: 'GET',
        showloading: true
    };

}