const SHA256 = require("crypto-js/sha256")

class block{
    constructor(index, timestamp, data, previousHash=""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash()
        }
    }
}

class blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new block(0, Date.now(), "Genesis Block", "1");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(var i = 1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            return true;
        }
    }   

}

let start = Date.now();
console.log("starting at " + start);
let jonCoin = new blockchain();
// console.log("Mining 1")
// jonCoin.addBlock(new block(1, Date.now(), {jeff: 1, jon: 3, alex: 2}))
// console.log("Mining 2")
// jonCoin.addBlock(new block(1, Date.now(), {jeff: 1, jon: 3, alex: 2, matt: 1}))
// console.log("Mining 3")
// jonCoin.addBlock(new block(1, Date.now(), {jeff: 1, jon: 3, alex: 2, matt: 2}))
// console.log(JSON.stringify(jonCoin, null, 4));
var times = [];


for(var i =1; i<=1000; i++){
    let tStart = Date.now();
    console.log("Mining "+i)
    jonCoin.addBlock(new block(1, Date.now(), {jeff: 1, jon: 3, alex: i}))
    let tEnd = Date.now();
    times.push((tEnd-tStart));
}

const reducer = (acc, curr) => acc + curr;

console.log(times.reduce(reducer) / 100)

console.log("IS CHAIN VALID: " + jonCoin.isChainValid())

console.log("fini in " + ((Date.now() - start) / 1000));
