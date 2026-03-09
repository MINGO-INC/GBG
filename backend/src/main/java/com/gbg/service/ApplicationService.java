package com.gbg.service;

import com.gbg.model.GangApplication;
import com.gbg.repository.GangApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final GangApplicationRepository applicationRepository;

    public GangApplication submitApplication(GangApplication application) {
        application.setStatus(GangApplication.ApplicationStatus.PENDING);
        application.setSubmittedAt(java.time.LocalDateTime.now());
        return applicationRepository.save(application);
    }
}
