import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
    name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[]): string {
        if (typeof value === 'string') return `${baseUrl}/files/product/${value}`;

        const img = value[0];

        if (!img) return './assets/img/no-image.jpg';

        return `${baseUrl}/files/product/${img}`;
        
        // if (Array.isArray(value)) return `${baseUrl}/files/product/${value[0]}`;
        // else if (!value) return './assets/img/no-image.png';
        // else return `${baseUrl}/files/product/${value}`;
    }
}
