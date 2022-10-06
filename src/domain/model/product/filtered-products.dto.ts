import { ProductItemDTO } from "./product-item.dto";

export class FilteredProductsDTO {
    page:  number;
    limit: number;
    count: number;
    list: any[];
};