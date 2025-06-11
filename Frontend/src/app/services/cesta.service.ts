import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cesta } from '../model/cesta';

@Injectable({
  providedIn: 'root'
})
export class CestaService {
  // Substitua pela URL real do seu endpoint no backend
  private apiUrl = 'http://localhost:3000/api/pedidos'; 

  constructor(private http: HttpClient) { }

  // Envia os dados da cesta para o backend
  finalizarCompra(cesta: Cesta): Observable<any> {
    return this.http.post<any>(this.apiUrl, cesta);
  }
}