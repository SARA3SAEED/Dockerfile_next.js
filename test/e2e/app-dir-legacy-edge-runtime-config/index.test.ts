import { nextTestSetup } from 'e2e-utils'

describe('app-dir edge runtime config', () => {
  const { next, isNextDev, skipped } = nextTestSetup({
    files: __dirname,
    skipStart: true,
    skipDeployment: true,
  })

  if (skipped) {
    return
  }

  it('should warn the legacy object config export', async () => {
    let error
    await next.start().catch((err) => {
      error = err
    })
    if (isNextDev) {
      expect(error).not.toBeDefined()
      await next.fetch('/legacy-runtime-config')
    } else {
      expect(error).toBeDefined()
    }

    expect(next.cliOutput).toContain('Page config in ')
    expect(next.cliOutput).toContain(
      // the full path is more complex, we only care about this part
      'app/legacy-runtime-config/page.js is deprecated. Replace `export const config=…` with the following:'
    )
    expect(next.cliOutput).toContain('- `export const runtime = "edge"`')
    expect(next.cliOutput).toContain(
      '- `export const preferredRegion = ["us-east-1"]`'
    )
  })
})
