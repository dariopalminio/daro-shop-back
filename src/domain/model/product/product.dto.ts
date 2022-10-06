

export class ProductDTO {
    //_id: holds an ObjectId.
    readonly sku:  String;
    readonly barcode:  String;
    readonly name: string;
    readonly description: string;
    readonly images: string[];
    readonly category: string;
    readonly type: string;
    readonly brand: string;
    readonly color: string;
    readonly model: string;
    readonly gender: string;
    readonly size: string;
    readonly netCost: number; 
    readonly ivaAmountOnCost: number;
    readonly grossCost: number; 
    readonly netPrice: number; 
    readonly ivaAmountOnPrice: number;
    readonly grossPrice: number;
    readonly stock: number;
    readonly active:boolean;
};