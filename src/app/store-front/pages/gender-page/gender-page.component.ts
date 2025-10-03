import { Component, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'gender-page',
    imports: [ProductCardComponent, TitleCasePipe],
    templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
    route = inject(ActivatedRoute);
    productsService = inject(ProductsService);
    gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));
    productsResource = rxResource({
        params: () => this.gender(),
        stream: ({ params: gender }) => {
            return this.productsService.getProducts({ gender });
        },
    });
}
