package com.gbg.controller;

import com.gbg.model.Member;
import com.gbg.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    /** Returns all active members ordered by rank. */
    @GetMapping
    public ResponseEntity<List<Member>> getActiveMembers() {
        return ResponseEntity.ok(memberService.getActiveMembers());
    }

    /**
     * Returns aggregated gang stats consumed by the React About section.
     * Example response: { "memberCount": 7, "loyalty": 100, "ranking": 1 }
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "memberCount", memberService.getActiveMemberCount(),
                "loyalty",     100,
                "ranking",     1
        ));
    }
}
