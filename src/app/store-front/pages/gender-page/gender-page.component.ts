import { Component, computed, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { TitleCasePipe } from '@angular/common';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
    selector: 'gender-page',
    imports: [ProductCardComponent, TitleCasePipe, PaginationComponent],
    templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
    route = inject(ActivatedRoute);
    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

    productsResource = rxResource({
        params: () => ({
            gender: this.gender(),
            page: this.paginationService.currenPage() - 1
        }),
        stream: ({ params }) => {
            return this.productsService.getProducts({ gender: params.gender, offset: params.page * 9 });
        },
    });
}
