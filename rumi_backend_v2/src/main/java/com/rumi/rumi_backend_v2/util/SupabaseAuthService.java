package com.rumi.rumi_backend_v2.util;


import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "http://localhost:3000")
@Service
public class SupabaseAuthService {
    private static final Logger log = LoggerFactory.getLogger(SupabaseAuthService.class);

    /**
     * Extracts user ID from JWT token by decoding it (no external API call needed)
     * Supabase JWTs have the user ID in the "sub" claim
     */
    public String getUserId(String authHeaderOrToken) {
        if (authHeaderOrToken == null || authHeaderOrToken.isBlank()) {
            log.error("Missing Authorization token");
            throw new RuntimeException("Missing Authorization token");
        }
        
        String token = authHeaderOrToken.startsWith("Bearer ")
                ? authHeaderOrToken.substring(7)
                : authHeaderOrToken;
        
        try {
            log.debug("Decoding JWT token to extract user ID");
            DecodedJWT decodedJWT = JWT.decode(token);
            
            // Supabase uses "sub" claim for user ID
            String userId = decodedJWT.getSubject();
            
            if (userId == null || userId.isBlank()) {
                log.error("JWT token missing 'sub' claim (user ID)");
                throw new RuntimeException("Invalid token: missing user ID");
            }
            
            log.debug("Successfully extracted user ID from JWT: {}", userId);
            return userId;
            
        } catch (com.auth0.jwt.exceptions.JWTDecodeException e) {
            log.error("Failed to decode JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid or malformed token");
        } catch (Exception e) {
            log.error("Unexpected error extracting user ID from token", e);
            throw new RuntimeException("Failed to validate token");
        }
    }

    /**
     * Extracts user email from JWT token by decoding it
     * Supabase JWTs have the email in the "email" claim
     */
    public String getUserEmail(String authHeaderOrToken) {
        if (authHeaderOrToken == null || authHeaderOrToken.isBlank()) {
            log.error("Missing Authorization token");
            throw new RuntimeException("Missing Authorization token");
        }
        
        String token = authHeaderOrToken.startsWith("Bearer ")
                ? authHeaderOrToken.substring(7)
                : authHeaderOrToken;
        
        try {
            log.debug("Decoding JWT token to extract user email");
            DecodedJWT decodedJWT = JWT.decode(token);
            
            // Supabase stores email in custom claim "email"
            String email = decodedJWT.getClaim("email").asString();
            
            if (email == null || email.isBlank()) {
                log.error("JWT token missing 'email' claim");
                throw new RuntimeException("Invalid token: missing email");
            }
            
            log.debug("Successfully extracted email from JWT: {}", email);
            return email;
            
        } catch (com.auth0.jwt.exceptions.JWTDecodeException e) {
            log.error("Failed to decode JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid or malformed token");
        } catch (Exception e) {
            log.error("Unexpected error extracting email from token", e);
            throw new RuntimeException("Failed to validate token");
        }
    }
}
