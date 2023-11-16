package o2.example.diary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class O2CalendarApplication {

    public static void main(String[] args) {
        SpringApplication.run(O2CalendarApplication.class, args);
    }



}
