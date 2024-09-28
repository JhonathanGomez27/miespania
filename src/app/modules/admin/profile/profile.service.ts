import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    private url: string = `${environment.apiUrlAdmin}`;

    constructor(private http: HttpClient) { } // Inyectar HttpClient

    // Método para obtener los datos del usuario logueado
    getUserData(): Observable<any> {
        return this.http.get<any>(`${this.url}usuarios/MisDatos`); // Realiza la petición GET
    }

}
