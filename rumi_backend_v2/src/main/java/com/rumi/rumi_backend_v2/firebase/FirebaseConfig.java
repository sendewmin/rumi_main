package com.rumi.rumi_backend_v2.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() throws IOException {

        String path = System.getenv("FIREBASE_CREDENTIALS");

        // Guard: Fail with a clear, descriptive error if the env var is not set
        if (path == null || path.isBlank()) {
            throw new IllegalStateException(
                "[Rumi] FIREBASE_CREDENTIALS environment variable is not set. " +
                "Set it to the absolute path of your Firebase service account JSON file. " +
                "Example: FIREBASE_CREDENTIALS=C:\\Users\\you\\Documents\\firebase\\firebase-service.json"
            );
        }

        FileInputStream serviceAccount = new FileInputStream(path);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}
