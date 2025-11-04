import { Component, inject, signal } from '@angular/core';
import { ProductsTableComponent } from "@products/components/products-table/products-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
    selector: 'products-admin-page',
    imports: [ProductsTableComponent, PaginationComponent],
    templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    productsPerPage = signal(10);

    productsResource = rxResource({
        params: () => ({
            page: this.paginationService.currenPage() - 1,
            limit: this.productsPerPage()
        }),
        stream: ({ params }) => {
            return this.productsService.getProducts({ offset: params.page * 9, limit: params.limit });
        },
    });
}
