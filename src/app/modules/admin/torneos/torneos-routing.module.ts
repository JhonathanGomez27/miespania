import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TorneosComponent } from './torneos.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ObtenerCategoriasResolver, ObtenerEstadosResolver, ObtenerFasesResolver, ObtenerModalidadesResolver, ObtenerRamasResolver, ObtenerTiposResolver, ObtenerTorneoByIdResolver, ObtenerTorneosResolver } from './torneos.component.resolver';

const routes: Routes = [
    {
        path: '',
        component: TorneosComponent,
        children:[
            {
                path: '',
                component: ListComponent,
            },
            {
                path: ':id',
                component: DetailsComponent,
                resolve: {
                    torneo: ObtenerTorneoByIdResolver
                }
            }
        ],
        resolve: {
            torneos: ObtenerTorneosResolver,
            ramas: ObtenerRamasResolver,
            tipos: ObtenerTiposResolver,
            modalidades: ObtenerModalidadesResolver,
            categorias: ObtenerCategoriasResolver,
            fases: ObtenerFasesResolver,
            // estados: ObtenerEstadosResolver,
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TorneosRoutingModule { }
