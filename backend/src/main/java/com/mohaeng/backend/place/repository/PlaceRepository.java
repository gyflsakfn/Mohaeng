package com.mohaeng.backend.place.repository;

import com.mohaeng.backend.place.domain.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long>, PlaceRepositoryCustom{
    List<Place> findByAddressContainingIgnoreCase(String searchValue);
    Page<Place> findByNameContainingOrAddressContaining(String name, String address, Pageable pageable);
    Page<Place> findByNameContaining(String name, Pageable pageable);
    List<Place> findByContentId(String contentId);
    List<Place> findById(String placeId);

    @Query("SELECT p " +
            "FROM Place p " +
            "LEFT JOIN Review r " +
            "ON p.id = r.place.id " +
            "GROUP BY p.id " +
            "ORDER BY COUNT(r) DESC, AVG(CAST(r.rating AS double)) DESC NULLS LAST, p.id ASC")
    Page<Place> findAllSortedByRating(Pageable pageable);

    @Query("SELECT p " +
            "FROM Place p " +
            "LEFT JOIN Review r " +
            "ON p.id = r.place.id " +
            "WHERE p.areaCode = :areaCode " +
            "GROUP BY p.id " +
            "ORDER BY COUNT(r) DESC, AVG(CAST(r.rating AS double)) DESC NULLS LAST, p.id ASC")
    Page<Place> findByAreaCodeSortedByRating(@Param("areaCode") String areaCode, Pageable pageable);
    @Query(value = "SELECT p.*, AVG(r.rating) as avg_rating " +
            "FROM place p " +
            "JOIN review r ON p.place_id = r.place_id " +
            "GROUP BY p.place_id " +
            "ORDER BY avg_rating DESC " +
            "LIMIT 10", nativeQuery = true)
    List<Place> findTop10ByAvgRating();

    @Query(value = "SELECT p.* " +
            "FROM place p " +
            "WHERE NOT EXISTS (SELECT 1 FROM review r WHERE r.place_id = p.place_id) " +
            "LIMIT 10", nativeQuery = true)
    List<Place> findTop10WithoutReviews();
}
