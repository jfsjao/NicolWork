import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'http://localhost:5000';  // URL do backend

  constructor(private http: HttpClient) { }

  ping(): Observable<{message: string}> {
    return this.http.get<{message: string}>(`${this.backendUrl}/ping`);
  }
}