package com.utp.compre.controller;

import com.utp.compre.model.ProductSearchResult;
import com.utp.compre.service.ProductSearchService;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class ProductSearchController {

    private final ProductSearchService service;

    @GetMapping
    public Mono<List<ProductSearchResult>> search(@RequestParam @NotBlank String query) {
        return service.searchProducts(query);
    }
}
