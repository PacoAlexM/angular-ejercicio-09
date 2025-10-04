import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    private activatedRoute = inject(ActivatedRoute);

    currenPage = toSignal(this.activatedRoute.queryParamMap.pipe(
        map(param => (param.get('page') ? +param.get('page')! : 1)),
        map(page => (isNaN(page) ? 1 : page))
    ), { initialValue: 1, });
}
