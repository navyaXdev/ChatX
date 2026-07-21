import sqlite3

DB_PATH = "chatx.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH) #opens (or creates, if it doesn't exist) the file chatx.db and returns a connection object
    conn.row_factory = sqlite3.Row #this single line tells SQLite to give you query results as dictionary-like objects instead of plain tuples
    return conn