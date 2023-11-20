import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EditarJugadorSingleComponent } from '../modales/editar-jugador-single/editar-jugador-single.component';

@Component({
    selector: 'app-singles',
    templateUrl: './singles.component.html',
    styleUrls: ['./singles.component.scss'],
})
export class SinglesComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaTorneosData: MatTableDataSource<any> = new MatTableDataSource([{ranking: 1, jugador: 'Jugador 1', categoria: 'A', rama: 'Masculina'}]);
    tablaTorneosColumns: string[] = ['ranking', 'jugador', 'rama', 'categoria', 'acciones'];

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

    editarJugador(){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorSingleComponent,{
            // width: '80%'
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
