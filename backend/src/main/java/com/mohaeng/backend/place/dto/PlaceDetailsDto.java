package com.mohaeng.backend.place.dto;

import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.service.PlaceService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlaceDetailsDto {
    private Long placeId;
    private String name;
    private String areaCode;
    private String firstImage;
    private String contentId;
    private String mapX;
    private String mapY;
    private String address;
    private String overview;

    public static PlaceDetailsDto from(Place place, PlaceService placeService){
        String firstImage = place.getFirstImage();
        if (firstImage == null || firstImage.isEmpty()) {
            firstImage = placeService.getFirstImage();
        }
        return PlaceDetailsDto.builder()
                .placeId(place.getId())
                .name(place.getName())
                .areaCode(place.getAreaCode())
                .firstImage(firstImage)
                .contentId(place.getContentId())
                .mapX(place.getMapX())
                .mapY(place.getMapY())
                .address(place.getAddress())
                .overview(place.getOverview())
                .build();
    }
}
