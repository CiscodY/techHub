package com.utp.compre.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utp.compre.external.SerpApiConfig;
import com.utp.compre.model.ProductSearchResult;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class ProductSearchService {

    private final WebClient serpApiClient;
    private final SerpApiConfig serpApiConfig;

    public Mono<List<ProductSearchResult>> searchProducts(String query) {

        if (query == null || query.isBlank()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Query no puede estar vacía"));
        }

        if (!StringUtils.hasText(serpApiConfig.getApiKey())) {
            return Mono.error(new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "SerpApi key not configured"));
        }

        return serpApiClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("engine", "google_shopping")
                        .queryParam("q", query)
                        .queryParam("api_key", serpApiConfig.getApiKey())
                        .build())
                .retrieve()
                .onStatus(status -> status.isError(),
                        resp -> resp.bodyToMono(String.class)
                                    .flatMap(body -> Mono.error(new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Error SerpApi: " + body))))
                .bodyToMono(String.class)
                .map(body -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode json = mapper.readTree(body); // aquí puede lanzar JsonProcessingException o IOException
                        List<ProductSearchResult> results = new ArrayList<>();
                        JsonNode items = json.path("shopping_results");
                        if (items != null && items.isArray()) {
                            items.forEach(item -> {
                                ProductSearchResult p = new ProductSearchResult();
                                p.setTitle(item.path("title").asText(""));
                                p.setPrice(item.path("price").asText(""));
                                p.setThumbnail(item.path("thumbnail").asText(""));
                                p.setSource(item.path("source").asText(""));
                                // position is used as productoApiId in current app
                                p.setProductApiId(item.path("position").asText(""));
                                p.setLink(item.path("link").asText(""));
                                p.setSnippet(item.path("snippet").asText(""));
                                p.setRating(item.path("rating").asText(""));
                                results.add(p);
                            });
                        }
                        return results;
                    } catch (Exception e) {  // <- atrapa JsonProcessingException, IOException, etc.
                        throw new RuntimeException("Error parsing JSON", e);
                    }
                });
    }
}
