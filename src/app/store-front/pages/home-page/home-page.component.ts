import { Component, inject, signal } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
    selector: 'home-page',
    imports: [ProductCardComponent],
    templateUrl: './home-page.component.html',
})
export class HomePageComponent {
    productsService = inject(ProductsService);
    productsResource = rxResource({
        params: () => ({}),
        stream: ({ params }) => {
            return this.productsService.getProducts({});
        },
    });
}

// http://localhost:3000/api/files/product/1740245-00-A_0_2000.jpg
