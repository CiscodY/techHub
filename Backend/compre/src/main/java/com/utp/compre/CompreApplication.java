package com.utp.compre;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CompreApplication {

	public static void main(String[] args) {
		SpringApplication.run(CompreApplication.class, args);
	}

	@Bean
	public CommandLineRunner init(){
		return args ->{
			System.out.println("\n=======================================");
            System.out.println("Backend corriendo en: http://localhost:8080");
            System.out.println("=======================================\n");
		};
	}
}
