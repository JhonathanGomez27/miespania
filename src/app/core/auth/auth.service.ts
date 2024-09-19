import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private url: string = environment.apiUrlAuthentication;
    private globalUrl: string = environment.apiUrlAdmin

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        const token = localStorage.getItem('accessToken') ?? '';
        if(token === 'undefined'){
            this.signOut();
            location.reload();
        }
        return localStorage.getItem('accessToken') ?? '';
    }

    set accessTokenRefresh(token: string) {
        localStorage.setItem('accessTokenRefresh', token);
    }

    get accessTokenRefresh(): string {
        return localStorage.getItem('accessTokenRefresh') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post(`${this.url}forgotPassword`, email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post(`${this.url}resetPassword`, password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { correo: string; contrasena: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('El usuario ya tiene sesíon iniciada.');
        }

        return this._httpClient.post(`${this.url}signin`, credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                this.accessTokenRefresh = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.get(`${this.url}refresh`).pipe(
            catchError(() =>
                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accesstoken;

                this.accessTokenRefresh = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenRefresh');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { nombre: string; correo: string; contrasena: string; nombre_a_mostrar: string; rama: string }): Observable<any>
    {
        return this._httpClient.post(`${this.globalUrl}usuarios`, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        console.log('Estado autenticado:', this._authenticated);
        console.log('Token de acceso:', this.accessToken);
        // console.log(AuthUtils._decodeToken(this.accessToken));
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
