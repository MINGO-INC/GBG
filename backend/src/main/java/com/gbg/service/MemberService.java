package com.gbg.service;

import com.gbg.model.Member;
import com.gbg.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<Member> getActiveMembers() {
        return memberRepository.findByStatusOrderByRankAsc(Member.Status.ACTIVE);
    }

    public long getActiveMemberCount() {
        return memberRepository.countByStatus(Member.Status.ACTIVE);
    }
}
