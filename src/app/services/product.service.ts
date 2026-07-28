import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductRequest } from '../models/productDto';
import { Observable } from 'rxjs';
import { ProductUpdateDto } from '../models/productUpdateDto';
import { StatusUpdateRequest } from '../models/status-update';
import { ProductBasicResponse, ProductMiniResponse } from '../models/productResponses';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl + '/product';

  constructor(private http: HttpClient) { }

  addProduct(productRequest: ProductRequest) {

    return this.http.post(`${this.url}/add`, productRequest, { responseType: 'text' });

  }

  updateProduct(productUpdateRequest: ProductUpdateDto) {
    return this.http.post(`${this.url}/update`, productUpdateRequest, { responseType: 'text' });
  }

  getProducts() {
    return this.http.get(`${this.url}/get`);
  }

  updateStatus(statusUpdateRequest: StatusUpdateRequest) {
    return this.http.post(`${this.url}/statusUpdate`, statusUpdateRequest, { responseType: 'text' });

  }

  delete(id: number) {
    return this.http.post(`${this.url}/delete/${id}`, {}, { responseType: 'text' });
  }

  getProductsByCateagory(id: number): Observable<ProductMiniResponse[]> {
    return this.http.get<ProductMiniResponse[]>(`${this.url}/getByCategory/${id}`);
  }

  getById(id: number): Observable<ProductBasicResponse> {
    return this.http.get<ProductBasicResponse>(`${this.url}/getById/${id}`)
  }
}
