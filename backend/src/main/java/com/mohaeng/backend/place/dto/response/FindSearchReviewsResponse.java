package com.mohaeng.backend.place.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FindSearchReviewsResponse {
    private List<FindAllReviewResponse> reviews;
    private int totalPages;
    private long totalElements;
    private double averageRating;

    public FindSearchReviewsResponse(List<FindAllReviewResponse> reviews) {
        this.reviews = reviews;
    }
}
