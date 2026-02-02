<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '123456'; // User's MySQL password
$dbName = 'ascend_db';

try {
    echo "Connecting to MySQL server...\n";
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Creating database '$dbName' if it doesn't exist...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName`");
    
    echo "Database created successfully.\n";
    
    // Test selecting it
    $pdo->exec("USE `$dbName`");
    echo "Selected database '$dbName'.\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
