package com.gbg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "gang_applications")
@Data
@NoArgsConstructor
public class GangApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "In-game name is required")
    @Column(nullable = false)
    private String inGameName;

    @NotBlank(message = "Discord name is required")
    @Column(nullable = false)
    private String discordName;

    @NotNull(message = "Age is required")
    @Min(value = 13, message = "Must be at least 13")
    @Max(value = 99,  message = "Invalid age")
    @Column(nullable = false)
    private Integer age;

    @NotBlank(message = "Reason is required")
    @Size(min = 20, message = "Please provide more detail (at least 20 characters)")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED
    }
}
