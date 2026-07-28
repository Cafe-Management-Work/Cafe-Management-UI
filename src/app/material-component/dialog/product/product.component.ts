import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductRequest } from 'src/app/models/productDto';
import { ProductUpdateDto } from 'src/app/models/productUpdateDto';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();

  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";

  responseMessage: any;

  categorys: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });

    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }

  getCategorys() {
    this.categoryService.getAllCategory().subscribe((response: any) => {
      this.categorys = response;
    }, (error: any) => {
      console.log(error);

      // Concise error extraction handling objects, strings, and fallbacks
      const err = error.error;
      this.responseMessage = err?.message || err?.error || (typeof err === 'string' ? err : GlobalConstants.genericError);

      this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    })

  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.productForm.value;

    var data: ProductRequest = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.addProduct(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response;
      this.snackbarService.opensnackbar(this.responseMessage, 'success');
    }, (error: any) => {
      console.log(error);

      // Concise error extraction handling objects, strings, and fallbacks
      const err = error.error;
      this.responseMessage = err?.message || err?.error || (typeof err === 'string' ? err : GlobalConstants.genericError);

      this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
     var formData = this.productForm.value;

    var data: ProductUpdateDto = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description
    }
    this.productService.updateProduct(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response;
      this.snackbarService.opensnackbar(this.responseMessage, 'success');
    }, (error: any) => {
      console.log(error);

      // Concise error extraction handling objects, strings, and fallbacks
      const err = error.error;
      this.responseMessage = err?.message || err?.error || (typeof err === 'string' ? err : GlobalConstants.genericError);

      this.snackbarService.opensnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

}
