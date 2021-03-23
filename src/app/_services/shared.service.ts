import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environment";
import { debounceTime } from "rxjs/operators";
@Injectable()
export class SharedService {
  public headers = new HttpHeaders()
    .set("content-type", "application/json")
    .set("Access-Control-Allow-Origin", "*");

  constructor(private http: HttpClient) {}

  public getAllTodos() {
    return this.http.get(`${environment.apiUrl}/todo/get-all`);
  }

  public createTodos(data) {
    return this.http.post(`${environment.apiUrl}/todo/create`, data);
  }

  public deleteSingleTodos(id) {
    return this.http.delete(`${environment.apiUrl}/` + id);
  }

  public updateSingleTodos(data) {
    return this.http.put(`${environment.apiUrl}/todo/update`, data);
  }
}
