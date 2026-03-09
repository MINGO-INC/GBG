package com.gbg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    @NotNull(message = "Participant count is required")
    @Min(value = 1, message = "At least 1 participant required")
    private Integer participantCount;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Outcome is required")
    private Outcome outcome;

    @Min(value = 0, message = "Caught count cannot be negative")
    private Integer caughtCount = 0;

    private String notes;

    private String loggedBy;

    private LocalDateTime loggedAt = LocalDateTime.now();

    public enum Outcome {
        FULL_SUCCESS, PARTIAL, FAILED
    }
}
