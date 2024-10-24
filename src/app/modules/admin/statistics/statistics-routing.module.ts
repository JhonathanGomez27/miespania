import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { StatisticsResolver } from './statistics.resolver';  // Asegúrate de tener el resolver para statistics
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';
import { AuthUtils } from 'app/core/auth/auth.utils';

const token = AuthUtils._decodeToken(localStorage.getItem('accessToken'));
const routes: Routes = [
    {
        path: '',
        component: token.rol == 'user' ? StatisticsComponent : AdminStatisticsComponent,
        resolve: {
            statisticsData: StatisticsResolver  // Usa el resolver para cargar los datos
        }
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
