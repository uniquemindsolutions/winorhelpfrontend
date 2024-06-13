

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

@Injectable({
  providedIn: 'root'
})

export class CommanService {
  private apiUrl = 'http://localhost/winorhelp/index.php/api'; // Replace with your actual API URL

  

  constructor(private http: HttpClient) { }


}

