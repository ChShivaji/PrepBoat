import sqlite3
import os

db_path = r"c:\Users\Shivaji\OneDrive\Documents\Desktop\prepboat\backend\prepboat.db"

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}!")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    print("Tables:", tables)
    
    # Check users
    cursor.execute("SELECT id, name, email, role FROM users;")
    users = cursor.fetchall()
    print("\nUsers:")
    for u in users:
        print(u)
        
    # Check progress count
    if "user_progress" in tables:
        cursor.execute("SELECT COUNT(*), status FROM user_progress GROUP BY status;")
        progress_counts = cursor.fetchall()
        print("\nUser Progress counts:", progress_counts)
        
        # Select latest 5 progress records
        cursor.execute("SELECT id, user_id, question_id, status, solved_at, time_spent FROM user_progress ORDER BY solved_at DESC LIMIT 5;")
        print("Latest 5 progress records:")
        for r in cursor.fetchall():
            print(r)
            
    # Check test results
    if "test_results" in tables:
        cursor.execute("SELECT COUNT(*) FROM test_results;")
        print("\nTest Results count:", cursor.fetchone()[0])
        
    conn.close()
