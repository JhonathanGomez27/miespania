import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TorneosService } from '../../torneos.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-inscribir-jugador',
    templateUrl: './inscribir-jugador.component.html',
    styleUrls: ['./inscribir-jugador.component.scss'],
})
export class InscribirJugadorComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    protected _onDestroy = new Subject<void>();

    public jugadoresFiltroCtrl: FormControl = new FormControl();
    public filteredJugadores: ReplaySubject<any[]> = new ReplaySubject<any[]>(null);

    tipojuego: any = '';
    torneo: any = {};
    Toast: any;

    inscritos: any = [];

    constructor(
        public matDialogRef: MatDialogRef<InscribirJugadorComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _torneoService: TorneosService
    ) {
        this.tipojuego = data.tipojuego;
        this.inscritos = data.inscritos;
        console.log(this.inscritos);
        this.torneo = data.torneo;        this.Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        if(this.torneo.modalidad === 'singles'){
            this.obtenerJugadores();
        }else{
            this.obtenerParejas();
        }
    }

    ngOnInit() {

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }

    obtenerJugadores(){
        this._torneoService.obtenerJugadores({rama: this.torneo.rama, categoria: this.torneo.categoria}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                const jugadores = this.ordenarJugadores(response.jugadores);
                this.filteredJugadores.next(jugadores.slice());
                this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filtroBusquedaJugador(jugadores);
                });
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    ordenarJugadores(data:any){
        let jugadores:any = [];
        this.inscritos.forEach(inscrito => {
            data.forEach(jugador => {
                if(inscrito.jugador.id === jugador.id){
                    jugador.show = false;
                }
            });
        });
        jugadores = data;
        return jugadores;
    }

    obtenerParejas(){
        this._torneoService.obtenerParejas({rama: this.torneo.rama, categoria: this.torneo.categoria}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                const parejas = this.ordernarParejas(response.parejas);
                this.filteredJugadores.next(parejas.slice());
                this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                    this.filtroBusquedaPareja(parejas);
                });
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    ordernarParejas(data:any){
        let jugadores:any = [];
        this.inscritos.forEach(inscrito => {
            data.forEach(pareja => {
                if(inscrito.pareja.id === pareja.id){
                    pareja.show = false;
                }
            });
        });
        jugadores = data;
        return jugadores;
    }

    addJugador(jugador: any){
        this.matDialogRef.close(jugador.id);
    }

    //---------------------
    //  Funciones filtros
    //---------------------

    /**
     * Filtro de busqueda del select de marcas
     * @param data
     * @returns
     */
    protected filtroBusquedaJugador(data:any): void {
        if (!data) {
            return;
        }
        // get the search keyword
        let search = this.jugadoresFiltroCtrl.value;
        if (!search) {
            this.filteredJugadores.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the select
        this.filteredJugadores.next(
            data.filter(
                (element) => element.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }

    /**
     * Filtro de busqueda del select de marcas
     * @param data
     * @returns
     */
    protected filtroBusquedaPareja(data:any): void {
        if (!data) {
            return;
        }
        // get the search keyword
        let search = this.jugadoresFiltroCtrl.value;
        if (!search) {
            this.filteredJugadores.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the select
        this.filteredJugadores.next(
            data.filter(
                (element) => element.jugador1.toLowerCase().indexOf(search) > -1 || element.jugador2.toLowerCase().indexOf(search) > -1
            )
        );
    }

}
