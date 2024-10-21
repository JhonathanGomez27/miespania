import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { StatisticsResolver } from './statistics.resolver';  // Asegúrate de tener el resolver para statistics

const routes: Routes = [
    {
        path: '',
        component: StatisticsComponent,
        resolve: {
            statisticsData: StatisticsResolver  // Usa el resolver para cargar los datos
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
