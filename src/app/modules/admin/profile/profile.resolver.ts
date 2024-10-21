import { Injectable } from '@angular/core';
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileResolver implements Resolve<boolean> {
    constructor(
        private router: Router,
        private _profileService: ProfileService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this._profileService.getUserData();
    }
}
