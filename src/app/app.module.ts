import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescriptifComponent } from './components/descriptif/descriptif.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { RadiowithfreetextComponent } from './components/radiowithfreetext/radiowithfreetext.component'

@NgModule({
  declarations: [
    AppComponent,
    DescriptifComponent,
    RadiowithfreetextComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    AppRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent]
})
export class AppModule { }
