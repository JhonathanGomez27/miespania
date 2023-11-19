import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TorneosRoutingModule } from './torneos-routing.module';
import { TorneosComponent } from './torneos.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from 'app/shared/shared.module';
import { CrearTorneoComponent } from './modals/crear-torneo/crear-torneo.component';
import { EditarPartidoComponent } from './modals/editar-partido/editar-partido.component';


@NgModule({
  declarations: [
    TorneosComponent, ListComponent, DetailsComponent, CrearTorneoComponent, EditarPartidoComponent
  ],
  imports: [
    TorneosRoutingModule,
    SharedModule
  ]
})
export class TorneosModule { }
