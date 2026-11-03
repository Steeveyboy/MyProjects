# SQLite3 From Scratch (j_db)

A lightweight database implementation built from the ground up to understand how SQLite3 works internally. This project recreates the core components of a relational database system in C, focusing on learning the fundamental concepts behind modern database engines.

> **Status:** Work in progress. The storage engine handles up to about 20 rows before hitting an unimplemented code path. See [BUGS.md](BUGS.md) for known bugs.

## 🏗️ Architecture

The goal is to follow SQLite's architecture with two main layers:

### Frontend (SQL Compiler)
- **Tokenizer** ➜ **Parser** ➜ **Code Generator**
- **Input:** SQL commands
- **Output:** VM Bytecode

### Backend (CORE)
- **Virtual Machine** ➜ **B-Tree** ➜ **Pager** ➜ **OS Interface**
- **Purpose:** Execute bytecode, manage storage, and handle persistence

**Built so far:** a hand-written `strtok` statement parser, plus the B-Tree and Pager layers. Statements run directly against the B-tree. There is no tokenizer, code generator or virtual machine yet.

## ✅ What's Currently Implemented

### Core Features
- **REPL Interface**: Interactive command-line interface for database operations
- **Basic SQL Commands**:
  - `insert <id> <username> <email>`: Add a record with a caller-supplied ID. Rows are kept sorted by ID.
  - `select`: Display all records in ID order
- **Data Persistence**: All pages are held in memory and written to the database file on `.exit`
- **B-Tree Storage Engine**:
  - Leaf nodes for data storage, linked together for in-order scans
  - Internal nodes for indexing
  - Binary search within leaf and internal nodes
  - Splitting a full root leaf into an internal root with two leaf children
  - Page-based storage (4KB pages, up to 100 pages)

### Data Model
Supports one hard-coded user table with this schema:
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(32),
    email VARCHAR(255)
);
```

### Meta Commands
- `.exit`: Flush to disk and exit
- `.btree`: Display B-tree structure for debugging
- `.constants`: Print row and node layout sizes

### Storage Engine
- **Page Size**: 4KB (matching OS page size for efficiency)
- **B-Tree Implementation**: Leaf and internal node layouts, plus root splitting (see TODOs below)
- **Serialization**: Fixed-width binary row format (291 bytes per row, 13 rows per leaf)
- **Pager**: Loads pages from disk on demand and caches them in memory until `.exit`

## 🚧 Known Limitations (TODO)

These are features the code appears to support but doesn't fully implement yet. Details and repro steps are in [BUGS.md](BUGS.md).

- [ ] **Non-root leaf splits**: Once the root has split, filling another leaf exits with `Need to implement updating parent after split`. All unsaved rows are lost.
- [ ] **Internal node splits**: Internal nodes can only hold the single key created by the root split.
- [ ] **Tree rebalancing / node merging**: Not implemented. This will be needed for `DELETE`.
- [ ] **Duplicate key detection**: Only works while the tree is a single leaf.
- [ ] **Durability / crash safety**: Data only reaches disk on `.exit`. A crash, Ctrl-C or EOF on stdin loses the whole session.
- [ ] **Auto-incrementing IDs**: IDs must be supplied by hand.
- [ ] **Working test suite**: `simple_tests.py` currently fails (see Testing).

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
1, john, john@example.com
2, jane, jane@example.com
Executed
jdb > .exit
```

## 🧪 Testing

The project includes a Python test script ([simple_tests.py](simple_tests.py)) that inserts 5 generated users and checks the `select` output.

```bash
python simple_tests.py
```

> **Currently broken:** the script runs `./j_db` without a database filename, and its expected output format doesn't match `print_row`. See [BUGS.md](BUGS.md#6-simple_testspy-always-fails).

TODO:
- [ ] Fix the existing insert/select test
- [ ] Test data persistence (insert, `.exit`, reopen, `select`)
- [ ] Test inserting enough rows to force node splits (100+)
- [ ] Test duplicate key rejection, negative IDs and over-long strings
- [ ] Generate larger datasets for performance testing

## 🔮 Roadmap (What's Coming Next)

### Next Up
- [ ] **Finish the B-tree**: Parent updates after leaf splits, then internal node splits (see Known Limitations)
- [ ] **Fix known bugs**: See [BUGS.md](BUGS.md)

### Near Term
- [ ] **WHERE Clauses**: Filter records with conditional logic
- [ ] **UPDATE/DELETE Statements**: Modify and remove records
- [ ] **Multiple Tables**: Support for joins and relationships
- [ ] **Improved SQL Parser**: A real tokenizer and parser, with better error handling and syntax support

### Medium Term
- [ ] **Transactions**: ACID compliance with rollback support
- [ ] **Indexing**: Secondary indexes for faster queries
- [ ] **Data Types**: Support for INTEGER, TEXT, REAL, BLOB
- [ ] **Constraints**: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL

### Long Term
- [ ] **Bytecode VM**: Compile statements to bytecode, as SQLite does
- [ ] **Query Optimizer**: Cost-based query planning
- [ ] **Concurrency**: Multi-user support with locking
- [ ] **Compression**: Page-level compression for efficiency
- [ ] **WAL Mode**: Write-Ahead Logging for better performance
- [ ] **Virtual Tables**: Plugin architecture for custom storage

## 🎯 Learning Goals

This project is a way to learn:
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
