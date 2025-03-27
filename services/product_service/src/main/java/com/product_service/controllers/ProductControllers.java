package com.product_service.controllers;

import com.product_service.dto.ProductDTO;
import com.product_service.models.ProductModel;
import com.product_service.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/product")
@RestController
public class ProductControllers {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductModel> saveProduct(@RequestBody ProductDTO productDTO) {
        ProductModel productModel = new ProductModel();
        BeanUtils.copyProperties(productDTO, productModel);
        return ResponseEntity.status(HttpStatus.OK).body(productService.save(productModel));
    }

    @GetMapping
    public ResponseEntity<List<ProductModel>> listProduct(){
        return ResponseEntity.status(HttpStatus.OK).body(productService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductModel> product(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(productService.findId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id){
        productService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("product deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductModel> update(@PathVariable Long id, @RequestBody ProductDTO productDTO){
        ProductModel productModel = productService.findId(id);
        BeanUtils.copyProperties(productDTO, productModel);
        return ResponseEntity.status(HttpStatus.OK).body(productService.save(productModel));
    }
}
