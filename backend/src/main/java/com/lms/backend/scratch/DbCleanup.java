package com.lms.backend.scratch;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbCleanup {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mini_lms?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "quandeptrai1234";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            int rows = stmt.executeUpdate("DELETE FROM notifications");
            System.out.println("Successfully deleted " + rows + " notifications.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
