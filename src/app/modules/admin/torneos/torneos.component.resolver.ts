import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { TorneosService } from "./torneos.service";

@Injectable({
    providedIn: 'root'
})
export class ObtenerTorneosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerTorneos();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerTorneoByIdResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerTorneoById(route.paramMap.get('id'));
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
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerRamas();
    }
}


@Injectable({
    providedIn: 'root'
})
export class ObtenerTiposResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerTipos();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ObtenerModalidadesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerModalidades();
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
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerCategorias();
    }
}


@Injectable({
    providedIn: 'root'
})
export class ObtenerFasesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerFases();
    }
}


@Injectable({
    providedIn: 'root'
})
export class ObtenerEstadosResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _torneosService: TorneosService)
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
        return this._torneosService.obtenerEstados();
    }
}
