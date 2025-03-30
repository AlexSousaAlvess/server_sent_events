package com.product_service.services;

import com.product_service.models.ProductModel;

import java.util.List;

public interface ProductService{
    ProductModel save(ProductModel productModel);


    List<ProductModel> list();


    ProductModel findId(Long id);

    void delete(Long id);
}
