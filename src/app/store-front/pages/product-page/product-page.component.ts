import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
    selector: 'product-page',
    imports: [ProductCarouselComponent],
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
