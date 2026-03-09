package com.gbg.controller;

import com.gbg.model.BankTransaction;
import com.gbg.service.BankService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
public class BankController {

    private final BankService bankService;

    @GetMapping("/transactions")
    public ResponseEntity<List<BankTransaction>> getTransactions() {
        return ResponseEntity.ok(bankService.getAllTransactions());
    }

    @GetMapping("/balance")
    public ResponseEntity<Map<String, BigDecimal>> getBalance() {
        return ResponseEntity.ok(Map.of("balance", bankService.getBalance()));
    }

    @PostMapping("/transactions")
    public ResponseEntity<BankTransaction> addTransaction(@Valid @RequestBody BankTransaction transaction) {
        BankTransaction saved = bankService.addTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
