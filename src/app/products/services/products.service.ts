import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from '@products/interfaces/options.interface';

const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    private http = inject(HttpClient);
    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<string, Product>();

    getProducts(options: Options): Observable<ProductsResponse> {
        const { limit = 9, offset = 0, gender = '' } = options;
        const key = `${limit}-${offset}-${gender}`;

        if (this.productsCache.has(key)) {
            return of(this.productsCache.get(key)!);
        }

        return this.http.get<ProductsResponse>(`${baseUrl}/products`, { params: { limit, offset, gender, } }).pipe(
            tap(res => console.log(res)),
            tap(res => this.productsCache.set(key, res))
        );
    }

    getProductBySlug(slug: string): Observable<Product> {
        if (this.productCache.has(slug)) {
            return of(this.productCache.get(slug)!);
        }

        return this.http.get<Product>(`${baseUrl}/products/${slug}`).pipe(
            tap(res => console.log(res)),
            tap(res => this.productCache.set(slug, res))
        );
    }

    getProductById(id: string): Observable<Product> {
        if (this.productCache.has(id)) {
            return of(this.productCache.get(id)!);
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap(res => console.log(res)),
            tap(res => this.productCache.set(id, res))
        );
    }

    updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
        return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike);
    }
}
