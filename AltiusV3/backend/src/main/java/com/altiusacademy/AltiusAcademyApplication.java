package com.altiusacademy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableJpaRepositories(basePackages = "com.altiusacademy.repository.mysql")
@EnableMongoRepositories(basePackages = "com.altiusacademy.repository.mongodb")
@EntityScan(basePackages = { "com.altiusacademy.model.entity", "com.altiusacademy.model.document" })
public class AltiusAcademyApplication {

    public static void main(String[] args) {
        SpringApplication.run(AltiusAcademyApplication.class, args);
    }

}
