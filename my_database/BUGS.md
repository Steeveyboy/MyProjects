# Known Bugs

Bugs found in `j_db.c` and `simple_tests.py` (2026-11-02). Line numbers refer to the code at commit `ae67aaf`.

Build used for the repros below:

```bash
gcc -Wall -Wextra j_db.c -o j_db
```

---

## 1. Crash after about 20 inserts (non-root leaf split not implemented)

**Where:** `leaf_node_split_and_insert`, `j_db.c:542-547`

Once the root has split, the next leaf that fills up hits:

```
Need to implement updating parent after split
```

and the program calls `exit(EXIT_FAILURE)`. Pages are only written to disk in `db_close`, so **every row inserted in that session is lost**.

**Repro:**

```bash
(for i in $(seq 1 30); do echo "insert $i u$i e$i"; done; echo .exit) | ./j_db test.db
```

**Fix:** Update the parent internal node after a leaf split (insert a new key/child pair). Internal node splitting is needed after that.

---

## 2. Duplicate keys are accepted once the tree has more than one leaf

**Where:** `execute_insert`, `j_db.c:703-716`

The duplicate check reads `num_cells` and the key from the **root page** (`table->root_page_num`), not from the leaf the cursor points to. After the root becomes an internal node, `leaf_node_num_cells(root)` reads the internal node's `num_keys` field, and the key compared against is from the wrong page.

**Repro:**

```bash
(for i in $(seq 1 15); do echo "insert $i u e"; done; echo "insert 1 dup dup"; echo select; echo .exit) | ./j_db test.db
```

`select` shows two rows with id `1`.

**Fix:** Look up the cursor's page instead:

```c
Cursor* cursor = table_find(table, key_to_insert);
void* node = get_page(table->pager, cursor->page_num);
uint32_t num_cells = *leaf_node_num_cells(node);
```

The cursor is also leaked on the duplicate-key return path. Call `free(cursor)` before returning.

---

## 3. `internal_node_key` points to the wrong offset

**Where:** `internal_node_key`, `j_db.c:177-179`

```c
return internal_node_cell(node, key_num) + INTERNAL_NODE_CHILD_SIZE;
```

`internal_node_cell` returns a `uint32_t*`, so adding `INTERNAL_NODE_CHILD_SIZE` (4) moves **16 bytes**, not 4. It looks correct today because reads and writes use the same wrong offset and internal nodes only ever hold one key. With more than one key, writing key `n` will overwrite the cells of key `n+2`.

**Fix:**

```c
return (void*)internal_node_cell(node, key_num) + INTERNAL_NODE_CHILD_SIZE;
```

---

## 4. `get_page` bounds check uses the wrong constant

**Where:** `get_page`, `j_db.c:330`

```c
if (page_num > TABLE_MAX_ROWS) {
```

`TABLE_MAX_ROWS` is about 1,400, but `pager->pages` only has `TABLE_MAX_PAGES` (100) slots. A page number from 100 to about 1,400 writes past the end of the array. The error message prints `TABLE_MAX_PAGES`, which hides the mismatch.

**Fix:** `if (page_num >= TABLE_MAX_PAGES)`

**Related, `j_db.c:345`:** `if (page_num <= num_pages)` should be `<`. As written, it tries to read one page past the end of the file. That read returns 0 bytes, so the page is left as uninitialized `malloc` memory.

---

## 5. Data is lost if the input ends without `.exit`

**Where:** `read_input`, `j_db.c:264-267`

On EOF (Ctrl-D, or piped input with no `.exit`), `read_input` calls `exit(EXIT_FAILURE)` without calling `db_close`. Nothing is flushed, so all inserts from that session are lost. Ctrl-C has the same effect.

**Repro:**

```bash
echo "insert 1 a a" | ./j_db test.db
echo select | ./j_db test.db   # prints nothing
```

**Fix:** Close the database cleanly on EOF. Longer term, flush pages on write instead of only at shutdown (see the durability TODO in the README).

---

## 6. `simple_tests.py` always fails

**Where:** `simple_tests.py:5`, `simple_tests.py:34`

- It runs `./j_db` with no filename argument, so the program prints `Must Supply a database name` and exits right away.
- The expected row format is `1 user1 user1@example.com`, but `print_row` prints `1, user1, user1@example.com ` (commas and a trailing space).
- It only inserts 5 rows, so it never tests node splitting (bugs 1 and 2).

**Fix:** Pass a temp database path, match the real output format (or change `print_row`), and add tests for 100+ inserts, duplicate keys, and reopening the file to check persistence.

---

## 7. Compiler warnings

`gcc -Wall -Wextra` reports 9 warnings. These need attention:

- **Missing return value:** `get_node_max_key` (`:248`), `internal_node_find` (`:631`) and `execute_statement` (`:749`) can reach the end of a non-void function. This is undefined behavior if the node type or statement type is ever unexpected.
- **Signed/unsigned comparisons:** In `leaf_node_split_and_insert` (`:518`, `:529`, `:532`), the loop counter is `int32_t` and is compared against `uint32_t` values.

Minor:

- unused variables: `right_child` (`:481`) and `keyword` (`:661`)
- unused parameter: `statement` in `execute_select` (`:725`)
- `do_meta_command` is declared to return `bool` but returns `MetaCommandResult` values. It only works because `META_COMMAND_SUCCESS == 0 == false`.
- `getline` is declared by hand (`:259`) instead of defining `_POSIX_C_SOURCE` / `_GNU_SOURCE` before the includes.
- arithmetic on `void*` is a GNU extension and won't compile under strict ISO C.

---

## Housekeeping

- The `j_db` binary and the `my_db.db` file are untracked but not ignored. Add them to `.gitignore`.
- There is dead commented-out code in `db_close` (`j_db.c:415-424`) left over from the pre-B-tree pager.
