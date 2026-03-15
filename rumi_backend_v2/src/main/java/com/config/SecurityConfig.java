import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // 1. Allow public access to these endpoints
                .requestMatchers("/signup", "/login", "/css/**", "/js/**", "/public/**").permitAll()
                // 2. All other requests require the user to be logged in
                .anyRequest().authenticated()
            )
            // 3. Configure the login behavior
            .formLogin(form -> form
                .loginPage("/login") // Tells Spring you have a custom login page
                .defaultSuccessUrl("/dashboard", true)
                .permitAll()
            )
            .logout(logout -> logout.permitAll());

        return http.build();
    }
}