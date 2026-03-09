package com.gbg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Job type is required")
    private String jobType;

    /** Derived automatically from the participants list by JobService. */
    private Integer participantCount;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Outcome is required")
    private Outcome outcome;

    /** Derived automatically from the caughtMembers list by JobService. */
    private Integer caughtCount = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_participants", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "member_name")
    private List<String> participants = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_caught_members", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "member_name")
    private List<String> caughtMembers = new ArrayList<>();

    private Long dirtyCash;

    private Long cleanCash;

    private String notes;

    private String loggedBy;

    private LocalDateTime loggedAt = LocalDateTime.now();

    public enum Outcome {
        FULL_SUCCESS, PARTIAL, FAILED
    }
}
