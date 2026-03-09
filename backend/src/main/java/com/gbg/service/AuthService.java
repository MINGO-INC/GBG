package com.gbg.service;

import com.gbg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final long TOKEN_TTL_SECONDS = 24 * 3600; // 24 hours

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /** token → expiry timestamp (epoch seconds) */
    private final Map<String, Long> tokenStore = new ConcurrentHashMap<>();
    /** token → username */
    private final Map<String, String> tokenUserMap = new ConcurrentHashMap<>();

    public Optional<String> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(password, u.getPasswordHash()))
                .map(u -> {
                    String token = UUID.randomUUID().toString();
                    long expiry = Instant.now().getEpochSecond() + TOKEN_TTL_SECONDS;
                    tokenStore.put(token, expiry);
                    tokenUserMap.put(token, u.getUsername());
                    return token;
                });
    }

    public boolean validateToken(String token) {
        if (token == null || !tokenStore.containsKey(token)) return false;
        if (Instant.now().getEpochSecond() > tokenStore.get(token)) {
            tokenStore.remove(token);
            tokenUserMap.remove(token);
            return false;
        }
        return true;
    }

    public void logout(String token) {
        if (token != null) {
            tokenStore.remove(token);
            tokenUserMap.remove(token);
        }
    }

    public Optional<String> getUsernameByToken(String token) {
        return Optional.ofNullable(tokenUserMap.get(token));
    }
}
