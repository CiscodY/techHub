package com.utp.compre.model;

import lombok.Data;

@Data
public class ProductSearchResult {

    private String title;
    private String price;
    private String source;
    private String thumbnail;
    private String productApiId;
    private String link;
    private String snippet;
    private String rating;
}
