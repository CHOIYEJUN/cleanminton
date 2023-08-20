package o2.example.o2calendar;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


import javax.sql.DataSource;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class O2CalendarApplication {

    public static void main(String[] args) {
        SpringApplication.run(O2CalendarApplication.class, args);
    }



}
