import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@utils/form-utils';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'product-details',
    imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
    templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
    product = input.required<Product>();
    productService = inject(ProductsService);
    router = inject(Router);

    fb = inject(FormBuilder);

    wasSaved = signal(false);
    tempImgs = signal<string[]>([]);
    imageFileList: FileList | undefined = undefined;

    productForm = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        sizes: [['']],
        images: [[]],
        tags: [''],
        gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
    });

    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    imagesToCarousel = computed(() => {
        const currentImages = [ ...this.product().images, ...this.tempImgs() ];

        return currentImages;
    });

    ngOnInit(): void {
        this.setFormValue(this.product());
    }

    onSizeChange(size: string) {
        const currentSizes = this.productForm.value.sizes ?? [];

        if (currentSizes.includes(size))
            currentSizes.splice(currentSizes.indexOf(size), 1);
        else
            currentSizes.push(size);

        this.productForm.patchValue({ sizes: currentSizes });
    }

    async onSubmit() {
        const isValid = this.productForm.valid;

        this.productForm.markAllAsTouched();

        if (!isValid) return;

        const formValue = this.productForm.value;
        const productLike: Partial<Product> = {
            ...(formValue as any),
            tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
        };

        if (this.product().id === 'new') {
            const product = await firstValueFrom(this.productService.createProduct(productLike));

            console.log('Producto creado');

            this.router.navigate(['/admin/product', product.id]);

            // this.productService.createProduct(productLike).subscribe(product => {
            //     console.log('Producto creado');
            //     this.router.navigate(['/admin/product', product.id]);
            // 
            //     // this.wasSaved.set(true);
            // });
        } else {
            await firstValueFrom(this.productService.updateProduct(this.product().id, productLike));

            // this.productService.updateProduct(this.product().id, productLike).subscribe(product => { console.log('Producto actualizado') });
        }

        // console.log(this.productForm.value, { isValid });
        // console.log({ productLike });

        this.wasSaved.set(true);
        setTimeout(() => {
            this.wasSaved.set(false);
        }, 3000);
    }

    setFormValue(formLike: Partial<Product>) {
        this.productForm.reset(this.product() as any);
        // this.productForm.patchValue(formLike as any);
        this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    }

    onFilesChanged(event: Event) {
        const fileList = (event.target as HTMLInputElement).files;

        this.imageFileList = fileList ?? undefined;
        this.tempImgs.set([]);

        const imageUrls = Array.from(fileList ?? []).map(file => (URL.createObjectURL(file)));

        // console.log(fileList);
        // console.log({ imageUrls });

        this.tempImgs.set(imageUrls);
    }
}
