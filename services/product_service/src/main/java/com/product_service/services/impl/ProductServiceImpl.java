package com.product_service.services.impl;

import com.product_service.models.ProductModel;
import com.product_service.repositories.ProductRepository;
import com.product_service.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public ProductModel save(ProductModel productModel) {
        return productRepository.save(productModel);
    }

    @Override
    public List<ProductModel> list() {
        return productRepository.findAll();
    }

    @Override
    public ProductModel findId(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    @Override
    public ProductModel delete(Long id) {
        productRepository.deleteById(id);
    }
}
