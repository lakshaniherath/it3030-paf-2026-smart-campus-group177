package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final long TOKEN_TTL_MILLIS = 15 * 60 * 1000; // 15 minutes
    private final Map<String, ResetTokenRecord> tokenStore = new ConcurrentHashMap<>();

    public String createToken(String email) {
        clearExpired();
        String token = UUID.randomUUID().toString().replace("-", "");
        long expiresAt = Instant.now().toEpochMilli() + TOKEN_TTL_MILLIS;
        tokenStore.put(token, new ResetTokenRecord(email, expiresAt));
        return token;
    }

    public String consumeToken(String token) {
        clearExpired();
        ResetTokenRecord record = tokenStore.remove(token);
        if (record == null || record.expiresAt < Instant.now().toEpochMilli()) {
            return null;
        }
        return record.email;
    }

    private void clearExpired() {
        long now = Instant.now().toEpochMilli();
        tokenStore.entrySet().removeIf(entry -> entry.getValue().expiresAt < now);
    }

    private static class ResetTokenRecord {
        private final String email;
        private final long expiresAt;

        private ResetTokenRecord(String email, long expiresAt) {
            this.email = email;
            this.expiresAt = expiresAt;
        }
    }
}
