import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage: any;
	data: any;


	ngAfterViewInit() { }

	constructor(private dashboardService: DashboardService,
		private ngxUiLoaderService: NgxUiLoaderService, private snackBarService: SnackbarService) {
		this.ngxUiLoaderService.start();
		this.dashboardData();

	}

	  dashboardData(){
		this.dashboardService.getDetails().subscribe((response: any) =>{
			console.log(response);
			this.ngxUiLoaderService.stop();
			this.data = response;

		},(error) =>{
			this.ngxUiLoaderService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			}
			else{
				this.responseMessage = GlobalConstants.genericError;
			}
			this.snackBarService.opensnackbar(this.responseMessage, GlobalConstants.error);
		});
	  }

}
