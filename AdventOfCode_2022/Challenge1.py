
def get_elf_list():
    file = open("input.txt", 'r')
    lines = file.read().split('\n\n')

    ls = []
    for elf in lines:
        ls.append(sum([int(n) for n in elf.split('\n')]))
    return ls

def part1():
    ls = get_elf_list()
    print(f"The elf with the most snacks is carrying {max(ls)} calories")

def part2():
    ls = get_elf_list()
    ls.sort()
    print(f"The top three elves with the most snacks is carrying {sum(ls[-3:])} calories")

if __name__ == "__main__":
    part1()
    part2()