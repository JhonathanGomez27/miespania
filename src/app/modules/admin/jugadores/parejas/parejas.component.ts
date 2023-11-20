import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EditarJugadorParejaComponent } from '../modales/editar-jugador-pareja/editar-jugador-pareja.component';

@Component({
    selector: 'app-parejas',
    templateUrl: './parejas.component.html',
    styleUrls: ['./parejas.component.scss'],
})
export class ParejasComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaTorneosData: MatTableDataSource<any> = new MatTableDataSource([{ranking: 1, jugador: 'Jugador 1', jugadorD: 'Jugador 2', categoria: 'A', rama: 'Masculina'}]);
    tablaTorneosColumns: string[] = ['ranking', 'jugador', 'jugador2', 'rama', 'categoria', 'acciones'];

    jugadores: any = [];
    jugadoresCount:any = 0;

    pagina: number = 0;

    buscarJugador:any = new FormControl({value: '', disabled: false});

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onPageChange(event: any): void {

    }

    crearPareja(){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorParejaComponent,{
            // width: '80%'
            data: {accion: 'Crear'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    editarPareja(){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorParejaComponent,{
            // width: '80%'
            data: {accion: 'Editar'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
