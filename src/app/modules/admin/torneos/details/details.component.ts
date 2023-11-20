import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { EditarPartidoComponent } from '../modals/editar-partido/editar-partido.component';
import { CrearTorneoComponent } from '../modals/crear-torneo/crear-torneo.component';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    torneo: any = {};
    grupos: any = [];

    grupoSeleccionado: any = {};
    buscarJugador:any = new FormControl({value: '', disabled: false});

    // variables tabla
    tablaJugadoresData: MatTableDataSource<any> = new MatTableDataSource([{jugadorU: 'Jugador 1', JugadorD: 'Jugador 2', etapa: 'Grupos'}]);
    tablaJugadoresColumns: string[] = ['JugadorU', 'jugadorD', 'etapa', 'acciones'];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {}

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    editarTorneoDialogo(){
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearTorneoComponent,{
            // width: '80%'
            data: {accion: 'Editar'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    crearGrupo(){
        let grupo: any = {};

        this.grupos.push(grupo);
    }

    removeGrupo(index:any){
        this.grupos.splice(index, 1);
    }

    addIntegranteGrupo(index:any){

    }

    editarPartido(partido:any){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarPartidoComponent,{
            // width: '80%'
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
