package com.snhu.sslserver;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class SslServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SslServerApplication.class, args);
    }
}

@RestController
class ServerController {
	
    //@RequestMapping("/profile")
	@GetMapping("/hash")
    public String getProfile() {
        String name = "Maceo Bramante";  // Your name or the name you want
        String checksum = generateSHA256Checksum(name);
        
        // Return HTML content
        return "<html>" +
                "<body>" +
                "<p><strong>Name:</strong> " + name + "</p>" +
                "<p><strong>SHA-256 Checksum:</strong> " + checksum + "</p>" +
                "</body>" +
                "</html>";
    }

    private String generateSHA256Checksum(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data.getBytes());
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }

        return hexString.toString();
    }
}