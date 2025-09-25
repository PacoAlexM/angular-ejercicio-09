import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from '@products/interfaces/options.interface';

const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private http = inject(HttpClient);

    getProducts(options: Options): Observable<ProductsResponse> {
        const { limit = 9, offset = 0, gender = '' } = options;

        return this.http.get<ProductsResponse>(`${baseUrl}/products`, { params: { limit, offset, gender, } }).pipe(
            tap(res => console.log(res))
        );
    }
}
