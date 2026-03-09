package com.gbg.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String inGameName;

    private String discordName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rank rank;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    private LocalDate joinDate;

    public enum Rank {
        BOSS, UNDERBOSS, CAPTAIN, SOLDIER, ASSOCIATE, RECRUIT
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}
