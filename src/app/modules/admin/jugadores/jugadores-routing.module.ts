import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JugadoresComponent } from './jugadores.component';
import { SinglesComponent } from './singles/singles.component';
import { ParejasComponent } from './parejas/parejas.component';
import { ObtenerCategoriasResolver, ObtenerJugadoresPaginadoResolver, ObtenerJugadoresResolver, ObtenerParejasPaginadoResolver, ObtenerParejasResolver, ObtenerRamasResolver } from './jugadores.component.resolver';

const routes: Routes = [
    {
        path: '',
        component: JugadoresComponent,
        children:[
            {
                path: 'solos',
                component: SinglesComponent,
                resolve: {
                    jugadoresPag: ObtenerJugadoresPaginadoResolver
                }
            },
            {
                path: 'parejas',
                component: ParejasComponent,
                resolve: {
                    // parejas: ObtenerParejasResolver,
                    parejas: ObtenerParejasPaginadoResolver,
                    jugadores: ObtenerJugadoresResolver,
                }
            }
        ],
        resolve: {
            // jugadores: ObtenerJugadoresResolver,
            ramas: ObtenerRamasResolver,
            categorias: ObtenerCategoriasResolver,
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JugadoresRoutingModule { }
