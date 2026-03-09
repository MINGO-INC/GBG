package com.gbg.service;

import com.gbg.model.Job;
import com.gbg.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByLoggedAtDesc();
    }

    public Job logJob(Job job) {
        job.setParticipantCount(
                job.getParticipants() != null ? job.getParticipants().size() : 0);
        job.setCaughtCount(
                job.getCaughtMembers() != null ? job.getCaughtMembers().size() : 0);
        return jobRepository.save(job);
    }
}
