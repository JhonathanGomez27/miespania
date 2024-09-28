import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambiarContrasenaService {

    private url: string = `${environment.apiUrlAdmin}`;

  constructor(private http: HttpClient) { }



  actualizarContrasena(usrId: number, contrasena: string, contrasenaAntigua: string): Observable<any> {
    const body = {
      contrasena: contrasena,
      contrasena_antigua: contrasenaAntigua
    };

    return this.http.patch(`${this.url}usuarios/editar/${usrId}`, body);
  }

}
