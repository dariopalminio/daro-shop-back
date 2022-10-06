import { Test, TestingModule } from '@nestjs/testing';
import {
    ProductRepository,
  } from '../../../../infra/database/repository/product.repository';
  
import { getModelToken } from '@nestjs/mongoose';
import { ProductDTO } from "domain/model/product/product.dto';
import { Product } from "domain/model/product/product';
import { createMock } from '@golevelup/nestjs-testing';
import { Model, Query } from 'mongoose';
import { ProductDocument } from '../../../../infra/database/schema/product.schema';


const mockArrayResult = [
    {
        "_id": "60d8f02e11d897f930de4d53",
        "name": "Mesa",
        "description": "Blanca",
        "imageURL": "https://images1.png",
        "price": 23000,
        "sku": "MES-BLA-WHI-COT",
        "barcode": "MES-BLA-1234",
        "stock": 4,
        "__v": 0
    },
    {
        "_id": "60d8f09711d897f930de4d55",
        "name": "Laptop",
        "description": "MacBook Air",
        "imageURL": "https://images2.png",
        "price": 23000,
        "sku": "LAP-MAC-WHI-COT",
        "barcode": "LAP-MAC-1234",
        "stock": 2,
        "__v": 0
    }
];

const mockProd = {
    "_id": "60d8f09711d897f930de4d55",
    "name": "Laptop",
    "description": "MacBook Air",
    "imageURL": "https://images2.png",
    "price": 23000,
    "sku": "LAP-MAC-WHI-COT",
    "barcode": "LAP-MAC-1234",
    "stock": 2,
    "__v": 0
};

const mockProductDoc = (mock?: Partial<ProductDTO>): Partial<ProductDocument> => ({
    "_id": "60d8f09711d897f930de4d55",
    "name": "Laptop",
    "description": "MacBook Air",
    "imageURL": "https://images2.png",
    "price": 23000,
    "sku": "LAP-MAC-WHI-COT",
    "barcode": "LAP-MAC-1234",
    "stock": 2,
    "__v": 0
});

const mockProductDocDeleted = (): Partial<ProductDocument> => ({
    "_id": "60d8f09711d897f930de4d55",
    "name": "Laptop",
    "description": "MacBook Air",
    "imageURL": "https://images2.png",
    "price": 23000,
    "sku": "LAP-MAC-WHI-COT",
    "barcode": "LAP-MAC-1234",
    "stock": 2,
    "__v": 0
});

describe('[Unit test] ProductRepository', () => {
    let repository: ProductRepository;
    let model: Model<ProductDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductRepository,
                {
                    //getModelToken() function returns a prepared injection token based on a token name. 
                    //Using this token, you can easily provide a mock implementation using any of the standard 
                    //custom provider techniques, including useClass, useValue, and useFactory. 
                    provide: getModelToken('Product'),
                    // notice that only the functions we call from the model are mocked
                    useValue: {
                        new: jest.fn().mockResolvedValue(new ProductDTO()),
                        constructor: jest.fn().mockResolvedValue(new ProductDTO()),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        exec: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<ProductRepository>(ProductRepository);
        model = module.get<Model<ProductDocument>>(getModelToken('Product'));
    });


    it('ProductRepository should be defined', () => {
        expect(repository).toBeDefined();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('productRepository.getAll should return all products', async () => {

        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(mockArrayResult),
        } as any);

        const products = await repository.getAll();
        expect(products).toEqual(mockArrayResult);
    });

    it('productRepository.getById should getOne by id', async () => {

        jest.spyOn(model, 'findById').mockReturnValueOnce(
            createMock<Query<ProductDocument, ProductDocument>>({
                exec: jest
                    .fn()
                    .mockResolvedValueOnce(mockProductDoc(new ProductDTO())),
            }),
        );

        const findMockProdDoc = mockProductDoc(new ProductDTO());
        const response = await repository.getById(mockProductDoc()._id);
        expect(response).toEqual(findMockProdDoc);
    });

    it.skip('productRepository.updateProduct should update a product successfully', async () => {

        jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
            createMock<Query<ProductDocument, ProductDocument>>({
                exec: jest.fn().mockResolvedValueOnce(mockProd),
            }),
        );

       const prod: Product = new Product(
            "",
            "",
            "",
            "",
            Number(12),
            "",
            Number(12),
            []
            );

        const updatedCat = await repository.update(mockProductDoc()._id, prod);
        expect(updatedCat).toEqual(mockProd);
    });

    it('productRepository.deleteProduct should return that it did delete a Product', async () => {

        jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce(
            createMock<Query<ProductDocument, ProductDocument>>({
                exec: jest.fn().mockResolvedValueOnce(mockProductDocDeleted()),
            }),
        );

        const productDeleted = await repository.delete(mockProductDoc()._id);
        expect(productDeleted).toEqual(true);
    });


});
