package com.mohaeng.backend.place.repository;

import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.domain.PlaceBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceBookmarkRepository extends JpaRepository<PlaceBookmark, Long> {
    boolean existsPlaceBookmarkByMemberAndPlace(Member member, Place place);
    PlaceBookmark findByMemberAndPlace(Member member, Place place);
}
