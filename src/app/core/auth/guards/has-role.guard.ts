import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router"
import { map, Observable, tap } from "rxjs";
import { UserService } from "app/core/user/user.service";
import { AuthService } from "../auth.service";

@Injectable({
    providedIn: 'root'
})
export class HasRoleGuard implements CanActivate{

    constructor(
        private _userService: UserService,
        private _router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const expectedRole = route.data.expectedRole;

        return this._userService.user$.pipe(
            map((user: any) =>
                Boolean(user && user.rol && expectedRole.includes(user.rol))
            ),
            tap((hasRole: boolean) => {
                if (!hasRole) {
                    alert('Accesso denegado - No tiene permisos para acceder a esta página');
                    this.signOut();
                }
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }
}
