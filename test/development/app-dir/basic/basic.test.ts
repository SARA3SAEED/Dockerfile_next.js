import { nextTestSetup } from 'e2e-utils'
import { describeVariants as describe, waitFor } from 'next-test-utils'
import { sandbox, waitForHydration } from 'development-sandbox'

describe.each(['default', 'turbo'])('basic app-dir tests', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should reload app pages without error', async () => {
    const { session, cleanup, browser } = await sandbox(next, undefined, '/')
    await session.assertNoRedbox()

    browser.refresh()

    await waitFor(750)
    await waitForHydration(browser)

    for (let i = 0; i < 15; i++) {
      await session.assertNoRedbox()
      await waitFor(1000)
    }

    await cleanup()
  })
})
