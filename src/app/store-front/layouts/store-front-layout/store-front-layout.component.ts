import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontStoreNavbarComponent } from '../../components/front-store-navbar/front-store-navbar.component';

@Component({
    selector: 'store-front-layuot',
    imports: [RouterOutlet, FrontStoreNavbarComponent],
    templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent {}
