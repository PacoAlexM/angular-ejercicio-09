import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
    selector: 'home-page',
    imports: [ProductCardComponent, PaginationComponent],
    templateUrl: './home-page.component.html',
})
export class HomePageComponent {
    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    // activatedRoute = inject(ActivatedRoute);
    // 
    // currenPage = toSignal(this.activatedRoute.queryParamMap.pipe(
    //     map(param => (param.get('page') ? +param.get('page')! : 1)),
    //     map(page => (isNaN(page) ? 1 : page))
    // ), { initialValue: 1, });

    productsResource = rxResource({
        params: () => this.paginationService.currenPage() - 1,
        stream: ({ params: currenPage }) => {
            return this.productsService.getProducts({ offset: currenPage * 9 });
        },
    });
}

// http://localhost:3000/api/files/product/1740245-00-A_0_2000.jpg
