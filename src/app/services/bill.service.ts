import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bill, BillGenerateRequest } from '../models/bill';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl+"/bill"

  constructor(private http: HttpClient) { }

  generateReport(billGenerateRequest: BillGenerateRequest){
    return this.http.post(`${this.url}/generateReport`, billGenerateRequest, { responseType: 'text' })
  }

  getPdf(billGenerateRequest: BillGenerateRequest):Observable<Blob>{
    return this.http.post(`${this.url}/getPdf`, billGenerateRequest, { responseType: 'blob' })
  }

  getBills():Observable<Bill>{
    return this.http.get<Bill>(`${this.url}/getBill`)
  }

  delete(id:number){
    return this.http.post(`${this.url}/delete/${id}`, {}, { responseType: 'text' })
  }
}
