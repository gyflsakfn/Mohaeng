package com.mohaeng.backend.place.service;

import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.repository.MemberRepository;
import com.mohaeng.backend.place.domain.PlaceBookmark;
import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.dto.response.PlaceBookmarkResponse;
import com.mohaeng.backend.place.repository.PlaceBookmarkRepository;
import com.mohaeng.backend.place.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlaceBookmarkService {
    private final PlaceBookmarkRepository placeBookmarkRepository;
    private final MemberRepository memberRepository;
    private final PlaceRepository placeRepository;

    @Transactional
    public PlaceBookmarkResponse addBookmark(Long placeId, String memberEmail) {
        // 1. 유저 확인 & 코스 확인
        Member member = isMember(memberEmail);
        Place place = isPlace(placeId);

        // 3. 이미 북마크를 누른 회원인지 확인
        if (isExistBookmark(member, place)){
            throw new IllegalArgumentException("이미 좋아요를 누른 회원입니다.");
        }

        // 4. PlaceBookmark 저장 & member에 bookmark 추가
        PlaceBookmark placeBookmark = PlaceBookmark.of(member, place);
        placeBookmarkRepository.save(placeBookmark);

        member.addPlaceBookmark(placeBookmark);

        return PlaceBookmarkResponse.from(placeId, member.getId());
    }

    @Transactional
    public PlaceBookmarkResponse cancelBookmark(Long placeId, String memberEmail) {
        // 1. 유저 확인 & 코스 확인
        Member member = isMember(memberEmail);
        Place place = isPlace(placeId);

        // 2. 이미 북마크를 누른 회원인지 확인
        if (!isExistBookmark(member, place)) {
            throw new IllegalArgumentException("member가 해당 place의 좋아요룰 누르지 않았습니다");
        }

        // 4. 해당 CourseBookmark 찾아서, deletedDate update & member의 placeBookMarkList에서 제거
        PlaceBookmark placeBookmark = placeBookmarkRepository.findByMemberAndPlace(member,place);
        placeBookmark.updateDeletedDate();
        member.removePlaceBookmark(placeBookmark);

        return PlaceBookmarkResponse.from(placeId, member.getId());
    }

    public boolean isExistPlaceBookmark(Long placeId, String memberEmail) {
        // 유저 확인 & 장소 확인
        Member member = isMember(memberEmail);
        Place place = isPlace(placeId);

        return isExistBookmark(member, place);
    }

    private boolean isExistBookmark(Member member, Place place) {
        return placeBookmarkRepository.existsPlaceBookmarkByMemberAndPlace(member, place);
    }


    private Member isMember(String memberEmail){
        return memberRepository.findByEmailAndDeletedDateIsNull(memberEmail).orElseThrow(
                // TODO: Exception 처리
                () -> new IllegalArgumentException("존재하지 않는 member 입니다.")
        );
    }

    private Place isPlace(Long id){
        return placeRepository.findById(id).orElseThrow(
                // TODO: Exception 처리
                () -> new IllegalArgumentException("존재하지 않는 코스 입니다.")
        );
    }




}
