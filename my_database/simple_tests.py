import subprocess

def run_j_db_command(command):
    """Run a command with the j_db program and return its output."""
    process = subprocess.Popen(
        ['./j_db'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    out, err = process.communicate(command + "\n.exit\n")
    return out, err, process.returncode


def gen_users(num):
    users = []
    for i in range(1, num + 1):
        users.append(f"{i} user{i} user{i}@example.com")
    return users

def gen_insert_commands(users):
    commands = []
    for user in users:
        commands.append(f"insert {user}")
    return commands

def evaluate_output(output, expected_users):
    select_output = output.strip().split("jdb > ")[-1].split("Executed")[0].strip().splitlines()

    print(select_output)

    if len(select_output) != len(expected_users):
        print(f"Test Failed: Expected {len(expected_users)} rows, got {len(select_output)} rows.")
        return

    for line, expected in zip(select_output, expected_users):
        expected_line = f"{expected}"
        if line != expected_line:
            print(f"Test Failed: Expected '{expected_line}', got '{line}'.")
            return
    
    print("Test Passed!")

if __name__ == "__main__":
    # Example test: insert and select
    test_users = gen_users(num=5)
    insert_commands = gen_insert_commands(test_users)
    
    commands = insert_commands + ["select"]
    
    output, error, code = run_j_db_command('\n'.join(commands))

    if error:
        print("Error:\n", error)
        print("Exit code:", code)
    else:
        evaluate_output(output, test_users)
        print("Exit code:", code)