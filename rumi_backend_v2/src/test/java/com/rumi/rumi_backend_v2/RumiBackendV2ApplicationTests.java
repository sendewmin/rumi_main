package com.rumi.rumi_backend_v2;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(locations = "file:./env.properties")
@SpringBootTest
class RumiBackendV2ApplicationTests {

    @Test
    void contextLoads() {
    }

}
