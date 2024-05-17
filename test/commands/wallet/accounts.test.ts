import {expect, test} from '@oclif/test'

describe('Wallet List Accounts', () => {
  /* test
  .stderr()
  .command(['wallet accounts'])
  .catch(error => {
    expect(error.message).to.contain("Wallet store not created")
  })
  .it('Gives Error if Wallet store not created') */

  test
  .stdout()
  .command(['wallet create'])
  .command(['wallet accounts'])
  .it('Gives Success if List of Accounts is displayed', ctx => {
    expect(ctx.stdout).to.contains("Wallet Created Successfully")
  });
})
