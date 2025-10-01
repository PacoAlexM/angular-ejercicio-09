import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';

@Component({
    selector: 'product-page',
    imports: [],
    templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
    productsService = inject(ProductsService);
    productSlug = inject(ActivatedRoute).snapshot.params['idSlug'];

    productResource = rxResource({
        params: () => this.productSlug,
        stream: ({ params: productSlug }) => {
            return this.productsService.getProductBySlug(productSlug);
        },
    });
}
