package com.mohaeng.backend.member.service;

import com.mohaeng.backend.Image.AmazonS3Service;
import com.mohaeng.backend.member.domain.Member;
import com.mohaeng.backend.member.domain.Role;
import com.mohaeng.backend.member.dto.request.UserInfoChangeRequest;
import com.mohaeng.backend.member.dto.response.KakaoUserDto;
import com.mohaeng.backend.member.dto.response.MemberLoginDto;
import com.mohaeng.backend.member.jwt.Token;
import com.mohaeng.backend.member.jwt.TokenGenerator;
import com.mohaeng.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final RandomNameService randomNameService;
    private final TokenGenerator tokenGenerator;

    private final AmazonS3Service amazonS3Service;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String CLIENT_ID;
    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String REDIRECT_URL;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String GET_ACCESS_TOKEN_URL;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String GET_PROFILE_URL;


    public Member findByEmail(String email) {
        return memberRepository.findByEmailAndDeletedDateIsNull(email)
                .orElseThrow(() -> new IllegalArgumentException("INVALID_USER"));
    }

    public String getAccessToken(String code){
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", CLIENT_ID);
        params.add("redirect_uri", REDIRECT_URL);
        params.add("code", code);

        //Header와 Body를 합침
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        //Post로 요청
        ResponseEntity<String> accessTokenResponse = restTemplate.exchange(
                GET_ACCESS_TOKEN_URL,
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        String body = accessTokenResponse.getBody();
        JSONObject jsonObject = new JSONObject(body);
        String access_token = jsonObject.getString("access_token");

        return access_token;
    }

    public KakaoUserDto findProfile(String token) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        ResponseEntity<String> kakaoProfileResponse = restTemplate.exchange(
                GET_PROFILE_URL,
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        String body = kakaoProfileResponse.getBody();
        JSONObject jsonObject = new JSONObject(body);
        long id = jsonObject.getLong("id");
        String parsedEmail = jsonObject.getJSONObject("kakao_account").getString("email");
        String parsedName = jsonObject.getJSONObject("properties").getString("nickname");
        String profileImage = jsonObject.getJSONObject("properties").getString("profile_image");

        return new KakaoUserDto(id, parsedEmail, parsedName, profileImage);
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    @Transactional
    public void deleteMember(Member member) {
        member.updateDeletedDate();
    }

    public Member saveMember(String token) throws IOException {
        KakaoUserDto kakaoUser = findProfile(token);
        Member member = memberRepository.findByEmailAndDeletedDateIsNull(kakaoUser.getEmail()).
                orElse(null);

        if (member == null) {
            member = new Member(kakaoUser.getName(), kakaoUser.getEmail(), Role.NORMAL, randomNameService.generateNickName());
            String fullUrl = kakaoUser.getProfileImage();
            setMemberImageUrl(member, fullUrl);
        }

        member.setOauthAccessToken(token);
        member.setKakaoId(kakaoUser.getKakaoId());
        memberRepository.save(member);
        return member;
    }

    public Token createToken(Member member) {
        return tokenGenerator.generateToken(member.getEmail(), member.getRole());
    }

    public MemberLoginDto getLoginInfo(Member member) {
        MemberLoginDto memberLoginDto = MemberLoginDto.builder()
                .id(member.getId())
                .email(member.getEmail())
                .nickName(member.getNickName())
                .imgUrl(member.getImageURL() + "/" + member.getImageName())
                .build();
        return memberLoginDto;
    }

    @Transactional
    public void changeProfile(Member member, UserInfoChangeRequest userInfoChangeRequest, MultipartFile multipartFile) throws IOException {
        member.changeNickName(userInfoChangeRequest.getNickName());
        if (multipartFile != null) {
            amazonS3Service.deleteFile(member.getImageName());
            String fullFileName = amazonS3Service.uploadFile(List.of(multipartFile)).get(0);
            setMemberImageUrl(member, fullFileName);
        }

    }

    private void setMemberImageUrl(Member member, String fullFileName) {
        String fileName = fullFileName.substring(fullFileName.lastIndexOf("/") + 1);
        String url = fullFileName.substring(0, fullFileName.lastIndexOf("/"));
        member.updateProfileImage(fileName, url);
    }

//    @Transactional
//    public List<String> changeProfile2(Member member, UserInfoChangeRequest req, List<MultipartFile> multipartFiles) throws IOException {
//        member.changeNickName(req.getNickName());
//
//        List<String> strings = new ArrayList<>();
//        if (multipartFiles != null) {
//            if (!isEmpty(member.getImageName())){
//                // 저장된 url에서 파일 이름 뽑아내기
//                String name = member.getImageURL().substring(member.getImageURL().lastIndexOf("/") + 1);
//                amazonS3Service.deleteFile(name);
//                strings = amazonS3Service.uploadFile(multipartFiles);
//
//                String newName = strings.get(0).substring(strings.get(0).lastIndexOf("/") + 1);
//                member.updateProfileImage(newName, strings.get(0));
//            }
//        }
//
//        return strings;
//    }

}
