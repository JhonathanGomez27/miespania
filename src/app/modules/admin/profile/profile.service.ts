import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    private url: string = `${environment.apiUrlAdmin}`;
    private _dataUser: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) { }

    //-----------------------------------
    // @ getters and setters
    //-----------------------------------

    set dataUser(value: any | null) {
        this._dataUser.next(value);
    }

    get dataUser$(): Observable<any | null> {
        return this._dataUser.asObservable();
    }

    // Método para obtener los datos del usuario logueado
    getUserData(): Observable<any> {
        return this.http.get<any>(`${this.url}usuarios/MisDatos`).pipe(
            tap((response) => {
                this._dataUser.next(response);
            })
        );
    }

    uploadImageToUser(id: string, file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);

      return this.http.patch<any>(
          `${this.url}usuarios/subir-imagen/${id}`,
          formData
      );
    }

    deleteImageUser(id: string): Observable<any> {
      return this.http.delete<any>(`${this.url}/files/${id}`);
    }
}
