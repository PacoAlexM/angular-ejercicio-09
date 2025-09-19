import { Component } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';

@Component({
    selector: 'home-page',
    imports: [ProductCardComponent],
    templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
