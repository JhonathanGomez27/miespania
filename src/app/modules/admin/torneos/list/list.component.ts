import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { CrearTorneoComponent } from '../modals/crear-torneo/crear-torneo.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaTorneosData: MatTableDataSource<any> = new MatTableDataSource([{name: 'Torneo singles 2023', rama: 'Masculina', categoria: 'A', estado: 'En proceso'}]);
    tablaTorneosColumns: string[] = ['torneo', 'rama', 'categoria', 'estado', 'acciones'];

    // variables torneos
    torneos: any = [{name: 'Torneo singles 2023', rama: 'Masculina', categoria: 'A', estado: 'En proceso'}];
    torneosCount:any = 0;

    pagina: any = 0;

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    crearTorneoDialogo(): void{
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearTorneoComponent,{
            // width: '80%'
            data: {accion: 'Crear'}
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

    onPageChange(event: any): void {

    }

    editarTorneo(torneo:any){
        this._router.navigate(['./', 1], {
            relativeTo: this._activatedRoute,
        });
    }
}
