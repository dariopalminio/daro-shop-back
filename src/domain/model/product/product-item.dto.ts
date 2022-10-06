export class ProductItemDTO {
    //_id: holds an ObjectId.
    sku:  String;
    name: string;
    description: string;
    images: string[];
    category: string;
    grossPrice: number;
    stock: number;
};
