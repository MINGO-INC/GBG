package com.gbg.controller;

import com.gbg.model.Job;
import com.gbg.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @PostMapping
    public ResponseEntity<Job> logJob(@Valid @RequestBody Job job) {
        Job saved = jobService.logJob(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
