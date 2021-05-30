const assert = require('assert')
const ganache = require('ganache-cli') // local ethereum test network
const Web3 = require('web3') // portal to ethereum network
const { interface, bytecode } = require('../compile')

const web3 = new Web3(ganache.provider()) //create an instance web3 and plug ganache's provider into it!

let accounts;
let inbox;

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts()
    // use one of those accounts to deploy the contract

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] }) // create contract instance of Inbox
        .send({ from: accounts[0], gas: '1000000' }) // account 0 deploy contract
})

describe('Inbox', () => {
    it('deploy a contract', () => {
        assert.ok(inbox.options.address)
    })

    it('has a default message', async () => {
        const message = await inbox.methods.message().call()
        assert.strictEqual(message, 'Hi there!')
    })

    it('can change message', async () => {
        const transaction = await inbox.methods.setMessage('Bye there!').send({
            from: accounts[0]
        })
        console.log('transaction:', transaction)
        const message = await inbox.methods.message().call()
        assert.strictEqual(message, 'Bye there!')
    })
})














// test demo
// class Car {
//     park() {
//         return 'stopped'
//     }

//     drive() {
//         return 'vroom'
//     }
// }

// let car;

// beforeEach(() => { 
//     console.log('run first in each test')
//     car = new Car();
// })

// describe('Car', () => {
//     it('can park', () => {
//         assert.strictEqual(car.park(), 'stopped')
//     })
//     it('can drive', () => {
//         assert.strictEqual(car.drive(), 'vroom')
//     })
// })