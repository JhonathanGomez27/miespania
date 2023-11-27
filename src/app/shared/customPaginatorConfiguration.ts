import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();

    customPaginatorIntl.itemsPerPageLabel = 'Items por página';
    customPaginatorIntl.nextPageLabel = 'Siguiente pagina';
    customPaginatorIntl.previousPageLabel = 'Pagina anterior';
    customPaginatorIntl.firstPageLabel = 'Primera pagina';
    customPaginatorIntl.lastPageLabel = 'Ultima pagina';

    return customPaginatorIntl;
}
