# SQLite3 From Scratch (j_db)

A lightweight database implementation built from the ground up to understand how SQLite3 works internally. This project recreates the core components of a relational database system in C, focusing on learning the fundamental concepts behind modern database engines.

## 🏗️ Architecture

The database follows SQLite's architecture with two main layers:

### Frontend (SQL Compiler)
- **Tokenizer** ➜ **Parser** ➜ **Code Generator**
- **Input:** SQL commands
- **Output:** VM Bytecode

### Backend (CORE)
- **Virtual Machine** ➜ **B-Tree** ➜ **Pager** ➜ **OS Interface**
- **Purpose:** Execute bytecode, manage storage, and handle persistence

## ✅ What's Currently Implemented

### Core Features
- **REPL Interface**: Interactive command-line interface for database operations
- **Basic SQL Commands**:
  - `INSERT`: Add new records with auto-incrementing IDs
  - `SELECT`: Query and display all records
- **Data Persistence**: File-based storage with crash recovery
- **B-Tree Storage Engine**: 
  - Leaf nodes for data storage
  - Internal nodes for indexing
  - Automatic node splitting and tree rebalancing
  - Page-based memory management (4KB pages)

### Data Model
Currently supports a simple user table with schema:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(32),
    email VARCHAR(255)
);
```

### Meta Commands
- `.exit`: Exit the database
- `.btree`: Display B-tree structure for debugging

### Storage Engine
- **Page Size**: 4KB (matching OS page size for efficiency)
- **B-Tree Implementation**: Complete with leaf/internal node management
- **Serialization**: Binary row format for efficient storage
- **Pager**: Handles page caching and disk I/O

## 🚀 Usage

```bash
# Compile the database
gcc j_db.c -o j_db

# Run with a database file
./j_db mydb.db

# Interactive usage
jdb > insert 1 john john@example.com
Executed
jdb > insert 2 jane jane@example.com  
Executed
jdb > select
1 john john@example.com
2 jane jane@example.com
Executed
jdb > .exit
```

## 🧪 Testing

The project includes a Python test suite ([simple_tests.py](simple_tests.py)) that:
- Tests basic INSERT/SELECT operations
- Validates data persistence
- Generates test data for performance testing

```bash
python simple_tests.py
```

## 🔮 Roadmap (What's Coming Next)

### Near Term
- [ ] **WHERE Clauses**: Filter records with conditional logic
- [ ] **UPDATE/DELETE Statements**: Modify and remove records
- [ ] **Multiple Tables**: Support for joins and relationships
- [ ] **Improved SQL Parser**: Better error handling and syntax support

### Medium Term
- [ ] **Transactions**: ACID compliance with rollback support  
- [ ] **Indexing**: Secondary indexes for faster queries
- [ ] **Data Types**: Support for INTEGER, TEXT, REAL, BLOB
- [ ] **Constraints**: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL

### Long Term
- [ ] **Query Optimizer**: Cost-based query planning
- [ ] **Concurrency**: Multi-user support with locking
- [ ] **Compression**: Page-level compression for efficiency
- [ ] **WAL Mode**: Write-Ahead Logging for better performance
- [ ] **Virtual Tables**: Plugin architecture for custom storage

## 🎯 Learning Goals

This project demonstrates:
- Low-level memory management in C
- B-tree data structure implementation
- File I/O and persistence strategies
- Lexical analysis and parsing
- Database storage engine design
- Page-based memory management

## 📚 Inspired By

This implementation follows the excellent tutorial series ["Let's Build a Simple Database"](https://cstack.github.io/db_tutorial/) and SQLite's documented architecture.

---

*Note: This is an educational project. For production use, please use SQLite3 or other mature database systems.*

