import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TorneosRoutingModule } from './torneos-routing.module';
import { TorneosComponent } from './torneos.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from 'app/shared/shared.module';
import { CrearTorneoComponent } from './modals/crear-torneo/crear-torneo.component';
import { EditarPartidoComponent } from './modals/editar-partido/editar-partido.component';
import { CrearGrupoComponent } from './modals/crear-grupo/crear-grupo.component';
import { ConfirmarAccionComponent } from './modals/confirmar-accion/confirmar-accion.component';
import { ConfirmarIniciarTorneoComponent } from './modals/confirmar-iniciar-torneo/confirmar-iniciar-torneo.component';
import { InscribirJugadorComponent } from './modals/inscribir-jugador/inscribir-jugador.component';
import { VerInscritosComponent } from './modals/ver-inscritos/ver-inscritos.component';
import { TorneoRegularComponent } from './details/torneo-regular/torneo-regular.component';
import { TorneoEscaleraComponent } from './details/torneo-escalera/torneo-escalera.component';


@NgModule({
  imports: [
      TorneosRoutingModule,
      SharedModule,
  ],
  declarations: [
    TorneosComponent, ListComponent, DetailsComponent, CrearTorneoComponent, EditarPartidoComponent, CrearGrupoComponent, ConfirmarAccionComponent, ConfirmarIniciarTorneoComponent, InscribirJugadorComponent, VerInscritosComponent, TorneoRegularComponent, TorneoEscaleraComponent
  ]
})
export class TorneosModule { }
