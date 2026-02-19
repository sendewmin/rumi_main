package com.rumi.rumi_backend_v2.test_db_setup;

import com.google.firebase.FirebaseApp;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    private final JdbcTemplate jdbcTemplate;

    public TestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/mysql/tables")
    public String showTables() {
        try {
            List<String> tables = jdbcTemplate.queryForList(
                    "SHOW TABLES",
                    String.class
            );

            // Join table names into a single string
            String tableList = String.join(", ", tables);

            return "MySQL Connected ✅ | Tables: " + "{ " + tableList + " )";

        } catch (Exception e) {
            return "MySQL Error ❌ " + e.getMessage();
        }
    }

    @GetMapping("/mysql/database")
    public String currentDatabase() {
        return "MySQL Connected ✅ | " + jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
    }

    @GetMapping("/firebase")
    public String testFirebase() {
        try {
            FirebaseApp app = FirebaseApp.getInstance();
            return "Firebase Connected ✅ | App name: " + app.getName();
        } catch (Exception e) {
            return "Firebase Error ❌ " + e.getMessage();
        }
    }

}