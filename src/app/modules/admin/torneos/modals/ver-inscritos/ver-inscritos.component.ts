import {
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TorneosService } from '../../torneos.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-ver-inscritos',
    templateUrl: './ver-inscritos.component.html',
    styleUrls: ['./ver-inscritos.component.scss'],
})
export class VerInscritosComponent implements OnInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    protected _onDestroy = new Subject<void>();

    public jugadoresFiltroCtrl: FormControl = new FormControl();
    public filteredJugadores: ReplaySubject<any[]> = new ReplaySubject<any[]>(
        null
    );

    tipojuego: any = '';
    torneo: any = {};
    Toast: any;
    inscritos: any = [];

    constructor(
        public matDialogRef: MatDialogRef<VerInscritosComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _torneoService: TorneosService
    ) {
        this.tipojuego = data.tipojuego;
        this.torneo = data.torneo;
        this.Toast = Swal.mixin({
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

        this.inscritos = data.inscritos;

        console.log(this.inscritos);
        if (this.torneo.modalidad === 'singles') {
            this.filteredJugadores.next(this.inscritos.slice());
            this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                this.filtroBusquedaJugador(this.inscritos);
            });
        } else {
            this.filteredJugadores.next(this.inscritos.slice());
            this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                this.filtroBusquedaPareja(this.inscritos);
            });
        }
    }

    ngOnInit() {}

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
                (element) => element.jugador.nombre.toLowerCase().indexOf(search) > -1
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
                (element) => element.pareja.jugador1.nombre.toLowerCase().indexOf(search) > -1 || element.pareja.jugador2.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }
}
