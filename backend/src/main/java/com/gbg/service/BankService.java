package com.gbg.service;

import com.gbg.model.BankTransaction;
import com.gbg.repository.BankTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BankService {

    private final BankTransactionRepository bankTransactionRepository;

    public List<BankTransaction> getAllTransactions() {
        return bankTransactionRepository.findAllByOrderByTransactionDateDesc();
    }

    public BankTransaction addTransaction(BankTransaction transaction) {
        return bankTransactionRepository.save(transaction);
    }

    public BigDecimal getBalance() {
        return bankTransactionRepository.calculateBalance();
    }
}
