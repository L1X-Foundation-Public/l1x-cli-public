import {expect, test} from '@oclif/test'

describe('Wallet Create', () => {
  test
  .stdout()
  .command(['wallet create'])
  .it('Creates Random Wallet containing address and privateKey', ctx => {
    expect(ctx.stdout).to.contains("Wallet Created Successfully")
  })

})
