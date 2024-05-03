-- Create Users table
CREATE TABLE dbo.Users (
    UserID INT PRIMARY KEY,
    Name VARCHAR(50),
    Email NVARCHAR(255),
    Password NVARCHAR(255),
    Created_at DATETIME,
    Weight INT,
    Gender VARCHAR(10)
);
