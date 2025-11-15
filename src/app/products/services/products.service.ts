import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from '@products/interfaces/options.interface';
import { User } from '@auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
};

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
        if (id === 'new') {
            return of(emptyProduct);
        }

        if (this.productCache.has(id)) {
            return of(this.productCache.get(id)!);
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
            tap(res => console.log(res)),
            tap(res => this.productCache.set(id, res))
        );
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(imagesNames => ({...productLike, images: [...currentImages, ...imagesNames]})),
            switchMap(updatedProduct => this.http.post<Product>(`${baseUrl}/products`, updatedProduct)),
            tap(productUpdated => this.updateProductCache(productUpdated))
        );

        // return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
        //     tap(productUpdated => this.updateProductCache(productUpdated))
        // );
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
            map(imagesNames => ({...productLike, images: [...currentImages, ...imagesNames]})),
            switchMap(updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)),
            tap(productUpdated => this.updateProductCache(productUpdated))
        );

        // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
        //     tap(productUpdated => this.updateProductCache(productUpdated))
        // );
    }

    updateProductCache(product: Product) {
        const productId = product.id;

        this.productCache.set(productId, product);

        this.productsCache.forEach(productResponse => {
            productResponse.products = productResponse.products.map(current => (current.id === productId ? product : current));
        });
    }

    uploadImages(images?: FileList): Observable<string[]> {
        if (!images) return of([]);

        const uploadObservables = Array.from(images).map(imgFile => this.uploadImage(imgFile));

        return forkJoin(uploadObservables).pipe(tap(imagesNames => console.log({ imagesNames })));
    }

    uploadImage(imageFile: File): Observable<string> {
        const formData = new FormData();

        formData.append('file', imageFile);

        return this.http.post<{fileName: string}>(`${baseUrl}/files/product`, formData).pipe(map(res => res.fileName));
    }
}
