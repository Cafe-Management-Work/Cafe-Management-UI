import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CategoryDTO } from '../models/category-dto';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl + '/category/';

  constructor(private http: HttpClient) { }

   addCategory(category: CategoryDTO) {
    return this.http.post(`${this.url}add`, category, { responseType: 'text' });
  }

  updateCategory(id: number, category: CategoryDTO) {
    return this.http.post(`${this.url}update/${id}`, category, { responseType: 'text' });
  }

getAllCategory(filterValue?: string): Observable<Category[]> {
    let params = new HttpParams();
    
    // Dynamically append the query parameter if it exists
    if (filterValue) {
      params = params.set('filterValue', filterValue);
    }

    return this.http.get<Category[]>(this.url + 'get', { params: params });
  }
}
