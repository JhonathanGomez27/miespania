import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { JugadoresService } from "./jugadores.service";
import { environment } from "environments/environment";

const limit = environment.limit;

@Injectable({
    providedIn: 'root'
})
export class ObtenerJugadoresResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerJugadores();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerJugadoresPaginadoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerJugadoresFiltroPaginadoI({page: 1, limit: limit, rama: '', categoria: '', nombre: ''});
    }
}


@Injectable({
    providedIn: 'root'
})
export class ObtenerRamasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerRamas();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerCategoriasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerCategorias();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerParejasResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerParejas();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerParejasPaginadoResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _jugadoresService: JugadoresService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        return this._jugadoresService.obtenerParejasFiltroPaginadoI({page: 1, limit: limit,  rama: 'masculina', categoria: 'A', nombre: ''});
    }
}
