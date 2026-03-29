package com.rumi.rumi_backend_v2.util;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@Service
public class SupabaseAuthService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_ANON_KEY}")
    private String supabaseAnonKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String getUserId(String authHeaderOrToken) {
        if (authHeaderOrToken == null || authHeaderOrToken.isBlank()) {
            throw new RuntimeException("Missing Authorization token");
        }
        String token = authHeaderOrToken.startsWith("Bearer ")
                ? authHeaderOrToken.substring(7)
                : authHeaderOrToken;
        String url = supabaseUrl + "/auth/v1/user";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("apikey", supabaseAnonKey);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            Map<String, Object> body = response.getBody();
            System.out.println("Supabase: "+ response);

            System.out.println("SupabaseAuth UserId:"+body.get("id"));
            return (String) body.get("id"); // user UUID

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Authorised, Invalid or expired token");
        }
    }

    @SuppressWarnings("unchecked")
    public String getUserEmail(String authHeaderOrToken) {
        if (authHeaderOrToken == null || authHeaderOrToken.isBlank()) {
            throw new RuntimeException("Missing Authorization token");
        }
        String token = authHeaderOrToken.startsWith("Bearer ")
                ? authHeaderOrToken.substring(7)
                : authHeaderOrToken;
        String url = supabaseUrl + "/auth/v1/user";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.set("apikey", supabaseAnonKey);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            Map<String, Object> body = response.getBody();
            System.out.println("SupabaseAuth UserEmail:"+body.get("email"));
            return (String) body.get("email");

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Authorised, Invalid or expired token");
        }
    }
}
