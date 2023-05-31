package com.mohaeng.backend.place.dto;

import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.service.PlaceService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Builder
@AllArgsConstructor
public class MainPageDto {
    private String region;
    private Long placeId;
    private String name;
//    private String content;
    private String contentId;
    private String averageRating;
    private String firstImage;

    public static MainPageDto Of(Place place, PlaceService placeService){
        Map<String, String> areaCodeToRegionMap = new HashMap<>();
        areaCodeToRegionMap.put("1", "서울");
        areaCodeToRegionMap.put("2", "인천");
        areaCodeToRegionMap.put("3", "대전");
        areaCodeToRegionMap.put("4", "대구");
        areaCodeToRegionMap.put("5", "광주");
        areaCodeToRegionMap.put("6", "부산");
        areaCodeToRegionMap.put("7", "울산");
        areaCodeToRegionMap.put("8", "세종");
        areaCodeToRegionMap.put("31", "경기");
        areaCodeToRegionMap.put("32", "강원");
        areaCodeToRegionMap.put("33", "충북");
        areaCodeToRegionMap.put("34", "충남");
        areaCodeToRegionMap.put("35", "경북");
        areaCodeToRegionMap.put("36", "경남");
        areaCodeToRegionMap.put("37", "전북");
        areaCodeToRegionMap.put("38", "전남");
        areaCodeToRegionMap.put("39", "제주");
        String firstImage = place.getFirstImage();
        if (firstImage == null || firstImage.isEmpty()) {
            firstImage = placeService.getFirstImage();
        }
        double averageRating = placeService.getAverageRatingForPlace(place.getId());
        String region = areaCodeToRegionMap.get(place.getAreaCode());
//        List<String> overviewList = placeService.getPlaceOverview(place.getContentId());
//        String overview = String.join(" ", overviewList);

        return MainPageDto.builder()
                .region(region)
                .placeId(place.getId())
                .name(place.getName())
//                .content(overview)
                .contentId(place.getContentId())
                .averageRating(String.valueOf(averageRating))
                .firstImage(firstImage)
                .build();
    }
}
