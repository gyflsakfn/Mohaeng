package com.mohaeng.backend.member.repository;

import com.mohaeng.backend.member.domain.Member;
import org.hibernate.annotations.Where;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndDeletedDateIsNull(String email);

    Optional<Member> findByName(String name);
}
