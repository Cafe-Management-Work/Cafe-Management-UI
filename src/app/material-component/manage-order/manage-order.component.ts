import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillGenerateRequest } from 'src/app/models/bill';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService,
    private productService: ProductService, private billService: BillService,
    private snackBarService: SnackbarService, private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    console.log(this.categorys);
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    });
  }

  getCategorys() {

    this.categoryService.getAllCategory('true').subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
      this.responseMessage = response;

    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    })

  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCateagory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      (error: any) => {
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.opensnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe(
      (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      (error: any) => {
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBarService.opensnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total']
        .setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
    else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value *
        this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    }
    else
      return false;
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null) {
      return true;
    }
    else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({ id: formData.product.id, name: formData.product.name, category: formData.category.name, quantity: formData.quantity, price: formData.price, total: formData.total });
      this.dataSource = [...this.dataSource];
      this.snackBarService.opensnackbar(GlobalConstants.productAdded, "success");
    }
    else {
      this.snackBarService.opensnackbar(GlobalConstants.productExistError, GlobalConstants.error);

    }
  }

  handleDeleteAction(index: number, element: any): void {
    this.totalAmount -= element.total;
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource]; // Reassign to trigger UI change detection
  }

  submitAction(): void {
  this.ngxService.start();

  const formData = this.manageOrderForm.value;
  const data: BillGenerateRequest = {
    name: formData.name,
    email: formData.email,
    contactNumber: formData.contactNumber,
    paymentMethod: formData.paymentMethod,
    total: this.totalAmount.toString(),
    isGenerate: true,
    productDetails: JSON.stringify(this.dataSource)
  };

  this.billService.generateReport(data).subscribe({
    next: (response: any) => {
      // Clean quotes/whitespace if the string response came with extra formatting
      const uuid = typeof response === 'string' ? response.replace(/"/g, '').trim() : response?.uuid;

      if (uuid) {
        this.downloadFile(uuid); // Pass the valid string UUID
      } else {
        this.ngxService.stop();
        this.snackBarService.opensnackbar("Failed to generate bill UUID", GlobalConstants.error);
      }

      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },
    error: (error: any) => {
      this.ngxService.stop();
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    }
  });
}

 downloadFile(fileName: string) {
  const data: BillGenerateRequest = {
    uuid: fileName
  };

  this.billService.getPdf(data).subscribe((response: any) => {
    // Create a Blob from the PDF response
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Create an invisible link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    link.click();
    
    // Clean up memory
    window.URL.revokeObjectURL(url);
    this.ngxService.stop();
  }, (error) => {
    this.ngxService.stop();
    console.error('Error downloading file:', error);
  });
}


}
