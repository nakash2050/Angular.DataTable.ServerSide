import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppService } from "./../services/app.service";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from "@angular/forms"

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, DataTablesModule, FormsModule],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
