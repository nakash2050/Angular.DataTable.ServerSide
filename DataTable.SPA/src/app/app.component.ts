import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AppService } from "./../services/app.service";
import { Employee } from "../models/employee";
import { Subject } from "rxjs/Subject";
import { DataTableDirective } from "angular-datatables";
import { SearchCriteria } from "../models/search-criteria";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "app";
  employees: Employee[];
  empName: string;
  searchCriteria: SearchCriteria = { isPageLoad: true, filter: '' };

  dtOptions: DataTables.Settings = {}; 
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.searchCriteria = this.searchCriteria;
        this.appService.getAllEmployeesWithPaging(dataTablesParameters)
          .subscribe(resp => {
            this.employees = resp.data;            

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        null,
        null,
        null,
        null,
        { "orderable": false },
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {   
    this.searchCriteria.isPageLoad = false;
    this.searchCriteria.filter = this.empName;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  search() {
    this.rerender();
  }

  ngOnDestroy(): void {    
    this.dtTrigger.unsubscribe();
  }

}
