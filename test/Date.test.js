const { assert, expect } = require("chai");
const {expectRevert} = require('@openzeppelin/test-helpers');

const DustyToken = artifacts.require("Dusty"); 

require("chai")
    .use(require("chai-as-promised"))
    .should()

contract("Dusty", (accounts) => {

    let dusty
    before(async () => {
        dusty = await DustyToken.new()
    })

    describe("Deployed Dusty", async () => {
        it("has an owner", async () => {
            let owner = await dusty.owner()
            expect(owner).to.equal(accounts[0])
        })

        it("has a name", async () => {
            let name = await dusty.name()
            expect(name).to.equal("Name, Class Race")
        })

        it("has a symbol", async () => {
            let symbol = await dusty.symbol()
            expect(symbol).to.equal("CHAR")
        })

        it("has correct tokenURI", async () => {
            let tokenURI = await dusty.tokenURI(0)
            expect(tokenURI).to.equal("https://date.kie.codes/token/0")
        })

        it("gifts the owner the origin of time", async () => {
            let owner = await dusty.ownerOf(0)
            expect(owner).to.equal(accounts[0])

            let meta = await dusty.get(0)
            expect(meta[0].toNumber()).to.equal(1)
            expect(meta[1].toNumber()).to.equal(1)
            expect(meta[2].toNumber()).to.equal(1)
            expect(meta[3].toString()).to.equal("ORIGIN")
        })


        it("gifts the owner a fresh baby dragon", async () => {
            let owner = await dusty.ownerOf(today.getFullYear(), today.getMonth(), today.getDate())
            expect(owner).to.equal(accounts[0])

            let catchphrase = await dusty.catchphraseOf(today.getFullYear(), today.getMonth(), today.getDate())
            expect(catchphrase).to.equal("i'm the baby, gotta love me (burn them!)")
        //     let meta = await dusty.get(???)
        //     expect(meta[0].toNumber()).to.greaterThan(2020)
        //     expect(meta[3].toString()).to.equal("Baby Dragon")
        //     expect(meta[4].toString()).to.equal("dragon baby")
        })

        // it("gifts the owner elon's birthday", async () => {
        //     let owner = await dusty.ownerOf(1971, 6, 28)
        //     expect(owner).to.equal(accounts[0])

        //     let catchphrase = await dusty.catchphraseOf(1971, 6, 28)
        //     expect(catchphrase).to.equal("Elon's Birthday")
        // })
    //     it("gifts the owner a dusty dude", async () => {
    //         let owner = await dusty.ownerOf(0)
    //         expect(owner).to.equal(accounts[0])
    
    //         let meta = await dusty.get()
    //         expect(meta[3].toString()).to.equal("Dusty D_fifestar")
    //         expect(meta[4].toString()).to.equal("ranger")
    //     })
    })


    describe("Converting a timestamp into a date", async () => {
        it("returns 01.01.1970 for timestamp 0", async () => {
            let meta = await dusty.timestampToDate(0)
            expect(meta[0].toNumber()).to.equal(1970)
            expect(meta[1].toNumber()).to.equal(1)
            expect(meta[2].toNumber()).to.equal(1)
        })

        it("returns 01.01.1970 for timestamp 23:59:59 (86399)", async () => {
            let meta = await dusty.timestampToDate(86399)
            expect(meta[0].toNumber()).to.equal(1970)
            expect(meta[1].toNumber()).to.equal(1)
            expect(meta[2].toNumber()).to.equal(1)
        })

        it("returns 02.01.1970 for timestamp 00:00:00 (86400)", async () => {
            let meta = await dusty.timestampToDate(86400)
            expect(meta[0].toNumber()).to.equal(1970)
            expect(meta[1].toNumber()).to.equal(1)
            expect(meta[2].toNumber()).to.equal(2)
        })

        it("returns 28.02.1970 for timestamp 23:59:59 (5097599)", async () => {
            let meta = await dusty.timestampToDate(5097599)
            expect(meta[0].toNumber()).to.equal(1970)
            expect(meta[1].toNumber()).to.equal(2)
            expect(meta[2].toNumber()).to.equal(28)
        })

        it("returns 01.03.1970 for timestamp 00:00:00 (5097600)", async () => {
            let meta = await dusty.timestampToDate(5097600)
            expect(meta[0].toNumber()).to.equal(1970)
            expect(meta[1].toNumber()).to.equal(3)
            expect(meta[2].toNumber()).to.equal(1)
        })

        it("returns 28.02.1972 for timestamp 23:59:59 (68169599)", async () => {
            let meta = await dusty.timestampToDate(68169599)
            expect(meta[0].toNumber()).to.equal(1972)
            expect(meta[1].toNumber()).to.equal(2)
            expect(meta[2].toNumber()).to.equal(28)
        })

        it("returns 29.02.1972 for timestamp 00:00:00 (68169600)", async () => {
            let meta = await dusty.timestampToDate(68169600)
            expect(meta[0].toNumber()).to.equal(1972)
            expect(meta[1].toNumber()).to.equal(2)
            expect(meta[2].toNumber()).to.equal(29)
        })

        it("returns 29.02.1972 for timestamp 23:59:59 (68255999)", async () => {
            let meta = await dusty.timestampToDate(68255999)
            expect(meta[0].toNumber()).to.equal(1972)
            expect(meta[1].toNumber()).to.equal(2)
            expect(meta[2].toNumber()).to.equal(29)
        })

        it("returns 01.03.1972 for timestamp 00:00:00 (68256000)", async () => {
            let meta = await dusty.timestampToDate(68256000)
            expect(meta[0].toNumber()).to.equal(1972)
            expect(meta[1].toNumber()).to.equal(3)
            expect(meta[2].toNumber()).to.equal(1)
        })

        it("returns 17.03.2021 for timestamp (1615993858)", async () => {
            let meta = await dusty.timestampToDate(1615993858)
            expect(meta[0].toNumber()).to.equal(2021)
            expect(meta[1].toNumber()).to.equal(3)
            expect(meta[2].toNumber()).to.equal(17)
        })

        it("returns 12.06.2086 for timestamp (3674678400)", async () => {
            let meta = await dusty.timestampToDate(3674678400)
            expect(meta[0].toNumber()).to.equal(2086)
            expect(meta[1].toNumber()).to.equal(6)
            expect(meta[2].toNumber()).to.equal(12)
        })

        it("returns 12.06.3086 for timestamp (35231587200)", async () => {
            let meta = await dusty.timestampToDate(35231587200)
            expect(meta[0].toNumber()).to.equal(3086)
            expect(meta[1].toNumber()).to.equal(6)
            expect(meta[2].toNumber()).to.equal(12)
        })
    })

    let price = web3.utils.toBN(web3.utils.toWei('10', 'gwei'))

    describe("Minting a char", async () => {    
        let ownerBalanceBefore
        let buyerBalanceBefore

        before(async ()=> {
            ownerBalanceBefore = await web3.eth.getBalance(accounts[0]);
            ownerBalanceBefore = web3.utils.toBN(ownerBalanceBefore)

            buyerBalanceBefore = await web3.eth.getBalance(accounts[1]);
            buyerBalanceBefore = web3.utils.toBN(buyerBalanceBefore)
        })

        let reciept
        let transaction

        it("creates a token", async () => {
            reciept = await dusty.claim(1912, 6, 23, "Alan", "crypto", "gay", "Birthday Alan Turing", { from: accounts[1], value: price })
            transaction = await web3.eth.getTransaction(reciept.tx);
        })

        it("transfers ownership to the caller", async () => {
            let owner = await dusty.ownerOf(1912, 6, 23)
            expect(owner).to.equal(accounts[1])
        })

        it("sets the note", async () => {
            let catchphrase = await dusty.catchphraseOf(1912, 6, 23)
            expect(catchphrase).to.equal("Birthday Alan Turing")
        })

        it("costs 10 gweo plus gas to mint", async () => {
            let buyerBalanceAfter = await web3.eth.getBalance(accounts[1])
            buyerBalanceAfter = web3.utils.toBN(buyerBalanceAfter)
            let gasCost = web3.utils.toBN(transaction.gasPrice * reciept.receipt.gasUsed)
            let expectedBuyerBalance = buyerBalanceBefore.sub(price).sub(gasCost)
            expect(buyerBalanceAfter.toString()).to.equal(expectedBuyerBalance.toString())
        })

        it("10 gwei are transferred to the owners account", async () => {
            let ownerBalanceAfter = await web3.eth.getBalance(accounts[0])
            ownerBalanceAfter = web3.utils.toBN(ownerBalanceAfter)
            let expectedOwnerBalance = ownerBalanceBefore.add(price)
            expect(ownerBalanceAfter.toString()).to.equal(expectedOwnerBalance.toString())
        })

        it("prevents it from being minted again", async() => {
            await expectRevert(
                dusty.claim(1912, 6, 23, "noop", "snort", "glop", "Met my dog", { from: accounts[2], value: price }),
                "Reason given: ERC721: token already minted."
            )
        })
    })

    describe("Trying to mint a char without paying", async () => {
        it("fails", async () => {
            await expectRevert(
                dusty.claim(2000, 1, 1, "NewYer", "Yor", "yar", "The millenium!"),
                "claiming a Character costs 10 Gwei"
            )
        })
    })

    describe("Trying to mint a future dusty", async () => {
        it("fails for one day in the future", async () => {
            let pendingBlock = await web3.eth.getBlock("pending")
            let tomorrow = new Date((pendingBlock.timestamp + 86400) * 1000)
            await expectRevert(
                dusty.claim(tomorrow.getFullYear(), tomorrow.getMonth()+1, tomorrow.getDate(), "Tomorrow never dies!", "Tomorrow never dies!", "Tomorrow never dies!", "Tomorrow never dies!", { from: accounts[2], value: price }),
                "a date from the future can't be your birthday!"
            )
        })
        it("fails for one month in the future", async () => {
            let pendingBlock = await web3.eth.getBlock("pending")
            let today = new Date((pendingBlock.timestamp) * 1000)
            await expectRevert(
                dusty.claim(today.getFullYear(), today.getMonth()+2, today.getDate(), "In a months time …", "In a years time …", "In a years time …", "Flaky time test!", { from: accounts[2], value: price }),
                "a date from the future can't be your birthday!"
            )
        })
        it("fails for one year in the future", async () => {
            let pendingBlock = await web3.eth.getBlock("pending")
            let today = new Date((pendingBlock.timestamp) * 1000)
            await expectRevert(
                dusty.claim(today.getFullYear()+1, today.getMonth()+1, today.getDate(), "In a years time …", "In a years time …", "In a years time …", "In a years time …", { from: accounts[2], value: price }),
                "a date from the future can't be your birthday!"
            )
        })
    })

    describe("Changing the catchphrase of a dusty", async () => {
        it("works if you are the owner of this dusty", async () => {
            await dusty.changeCatchphraseOf(0, "This is the beginning")
            let catchphrase = await dusty.catchphraseOf(0)
            expect(catchphrase).to.equal("This is the beginning")

            // await dusty.changeCatchphraseOf(1986, 6, 12, "HBD2ME")
            // catchphrase = await dusty.catchphraseOf(1986, 6, 12)
            // expect(catchphrase).to.equal("HBD2ME")
        })

        it("reverts if you aren't the owner of this dusty", async () => {
            await expectRevert(
                dusty.methods["changeCatchphraseOf(uint256,string)"](0, "this will fail", { from: accounts[1] }),
                "only the owner of this char can change its catchphrase"
            )
            let catchphrase = await dusty.catchphraseOf(0)
            expect(catchphrase).to.equal("This is the beginning")

            await expectRevert(
                dusty.changeCatchphraseOf(1986, 6, 12, "this will fail", { from: accounts[1] }),
                "only the owner of this dusty can change its catchphrase"
            )
            catchphrase = await dusty.catchphraseOf(1986, 6, 12)
            expect(catchphrase).to.equal("HBD2ME")
        })
    })

    describe("Changing the BaseURI", async () => {
        it("works if you are the owner of the contract", async () => {
            await dusty.setBaseURI("https://www.test.io/")
            let tokenURI = await dusty.tokenURI(0)
            expect(tokenURI).to.equal("https://www.test.io/0")
        })

        it("reverts if you are not the owner of the contract", async () => {
            await expectRevert(
                dusty.setBaseURI("https://www.test.io/", { from: accounts[1] }),
                "caller is not the owner"
            )
        })
    })
})
