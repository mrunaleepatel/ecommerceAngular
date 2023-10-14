import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ImageProcessingService } from '../image-processing.service';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber: number = 0;

  productDetails: Product[] = [];

  showLoadButton = false;

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  searchByKeyword(searchkeyword: string) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeyword);
  }

  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[] | undefined) => {
          if (x) {
            return x.map((product: Product) => this.imageProcessingService.createImages(product));
          } else {
            return [];
          }
        })
      )
      .subscribe(
        (resp: Product[]) => {
          console.log(resp);
          if (resp.length === 12) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          this.productDetails.push(...resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }

  public loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }

  showProductDetails(productId: number) {
    this.router.navigate(['/productViewDetails', {productId: productId}]);
  }
}
