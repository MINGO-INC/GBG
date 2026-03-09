package com.gbg.config;

import com.gbg.model.BankTransaction;
import com.gbg.model.Job;
import com.gbg.model.User;
import com.gbg.repository.BankTransactionRepository;
import com.gbg.repository.JobRepository;
import com.gbg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final BankTransactionRepository bankTransactionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${gbg.admin.username:admin}")
    private String adminUsername;

    @Value("${gbg.admin.password:gbg2024}")
    private String adminPassword;

    @EventListener(ApplicationReadyEvent.class)
    public void seedData() {
        seedUsers();
        seedJobs();
        seedTransactions();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setUsername(adminUsername);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }

    private void seedJobs() {
        if (jobRepository.count() > 0) return;

        Job j1 = new Job();
        j1.setJobType("Fleeca Bank Heist");
        j1.setParticipantCount(4);
        j1.setOutcome(Job.Outcome.FULL_SUCCESS);
        j1.setCaughtCount(0);
        j1.setNotes("Clean run, no heat");
        j1.setLoggedBy("MINGO");
        j1.setLoggedAt(LocalDateTime.now().minusDays(3));
        jobRepository.save(j1);

        Job j2 = new Job();
        j2.setJobType("Drug Run");
        j2.setParticipantCount(3);
        j2.setOutcome(Job.Outcome.PARTIAL);
        j2.setCaughtCount(1);
        j2.setNotes("Ghost got caught on exit");
        j2.setLoggedBy("Ghost");
        j2.setLoggedAt(LocalDateTime.now().minusDays(1));
        jobRepository.save(j2);
    }

    private void seedTransactions() {
        if (bankTransactionRepository.count() > 0) return;

        BankTransaction t1 = new BankTransaction();
        t1.setType(BankTransaction.TransactionType.DEPOSIT);
        t1.setAmount(new BigDecimal("50000"));
        t1.setDescription("Fleeca Heist cut");
        t1.setPerformedBy("MINGO");
        t1.setTransactionDate(LocalDateTime.now().minusDays(3));
        bankTransactionRepository.save(t1);

        BankTransaction t2 = new BankTransaction();
        t2.setType(BankTransaction.TransactionType.WITHDRAWAL);
        t2.setAmount(new BigDecimal("5000"));
        t2.setDescription("Ammo & supplies");
        t2.setPerformedBy("MINGO");
        t2.setTransactionDate(LocalDateTime.now().minusDays(2));
        bankTransactionRepository.save(t2);

        BankTransaction t3 = new BankTransaction();
        t3.setType(BankTransaction.TransactionType.DEPOSIT);
        t3.setAmount(new BigDecimal("15000"));
        t3.setDescription("Drug run profit");
        t3.setPerformedBy("Ghost");
        t3.setTransactionDate(LocalDateTime.now().minusDays(1));
        bankTransactionRepository.save(t3);
    }
}
