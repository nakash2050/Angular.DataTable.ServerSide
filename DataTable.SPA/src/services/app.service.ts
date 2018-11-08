import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs/Observable";
import { Employee } from "../models/employee";

@Injectable()
export class AppService {

    private apiURL: string = 'http://localhost/DataTables/api/';

    constructor(private http: HttpClient) {

    }

    getAllEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiURL + 'employee');        
    }

    getAllEmployeesWithPaging(dtParams: any): Observable<any> {
        return this.http.post(this.apiURL + 'employee', dtParams);        
    }
}

