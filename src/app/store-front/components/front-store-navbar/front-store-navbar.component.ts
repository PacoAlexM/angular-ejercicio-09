import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'front-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './front-store-navbar.component.html',
})
export class FrontStoreNavbarComponent {}
