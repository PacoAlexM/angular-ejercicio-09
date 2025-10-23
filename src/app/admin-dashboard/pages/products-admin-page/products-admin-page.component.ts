import { Component } from '@angular/core';
import { ProductsTableComponent } from "@products/components/products-table/products-table.component";

@Component({
    selector: 'products-admin-page',
    imports: [ProductsTableComponent],
    templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {}
