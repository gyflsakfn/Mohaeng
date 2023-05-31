package com.mohaeng.backend.place.repository;

import com.mohaeng.backend.place.domain.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findAllByPlaceId(Long placeId, Pageable pageable);
    List<Review> findAllByPlaceId(Long placeId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0)\n" +
            "FROM Review r\n" +
            "WHERE r.place.id = :place_id")
    double getAverageRatingByPlaceId(@Param("place_id") Long placeId);

}
