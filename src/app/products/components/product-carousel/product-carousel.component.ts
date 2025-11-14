import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
    selector: 'product-carousel',
    imports: [ProductImagePipe],
    templateUrl: './product-carousel.component.html',
    styles: `
        .swiper {
            width: 100%;
            height: 500px;
        }
    `,
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
    images = input.required<string[]>();
    swiperDiv = viewChild.required<ElementRef>('swiperDiv');
    swiper: Swiper | undefined = undefined;

    ngAfterViewInit(): void {
        this.swiperInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['images'].firstChange) return;

        if (!this.swiper) return;

        this.swiper.destroy(true, true);

        this.swiperInit();
    }

    swiperInit() {
        const element = this.swiperDiv().nativeElement;

        if (!element) return;

        this.swiper = new Swiper(element, {
            direction: 'horizontal',
            loop: true,
            modules: [Navigation, Pagination],
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    }
}
