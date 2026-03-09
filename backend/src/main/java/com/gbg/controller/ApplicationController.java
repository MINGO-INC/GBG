package com.gbg.controller;

import com.gbg.model.GangApplication;
import com.gbg.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * Accepts a new join application from the website form.
     * Returns 201 Created with the saved application on success,
     * or 400 Bad Request with validation errors on failure.
     */
    @PostMapping
    public ResponseEntity<GangApplication> submitApplication(
            @Valid @RequestBody GangApplication application) {
        GangApplication saved = applicationService.submitApplication(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
