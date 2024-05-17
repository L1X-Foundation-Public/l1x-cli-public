import {expect, test} from '@oclif/test'
import Wallet from 'ethereumjs-wallet'

describe('Wallet Import By Private Key', () => {

  let validWallet =  Wallet.default.generate();

  test
  .stderr()
  .command(['wallet import'])
  .catch(error => {
    expect(error.message).to.contain("Missing required flag privateKey")
  })
  .it('Gives Error if --privateKey not provided')


  test
  .stderr()
  .command(['wallet import', '--privateKey', generateRandomHexString(10)])
  .catch(error => {
    expect(error.message).to.contain("Invalid Private Key Length")
  })
  .it('Gives Error if --privateKey is of invalid length')

  test
  .stderr()
  .command(['wallet import', '--privateKey', "c588a90803706c1b046ac4174805e733c39c1e508daahj29f282411f32f4601f"])
  .catch(error => {
    expect(error.message).to.contain("Invalid Private Key")
  })
  .it('Gives Error if --privateKey is invalid')

  // Wallet Imported Successfully
  test
  .stdout()
  .command(['wallet import', '--privateKey', validWallet.getPrivateKeyString()])

  .it('Gives Success if --privateKey is valid', ctx => {
    expect(ctx.stdout).to.contains("Wallet Imported Successfully")
    expect(ctx.stdout).to.contains(validWallet.getAddressString())
    expect(ctx.stdout).to.contains(validWallet.getPrivateKeyString())

  });
  
})


function generateRandomHexString(length:number) {
  const characters = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < length * 2; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
}