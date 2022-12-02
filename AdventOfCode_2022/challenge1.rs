use std::env;
use std::fs;


// return list of elf calories
fn make_elf_list(){
    let mut arr = fs::read_to_string("input.txt");
    println!(arr);
}

fn main() {
    make_elf_list();
}
