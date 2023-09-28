import { setFailed, saveState, getState } from '@actions/core'
import getInputs from './inputs'
import installPnpm, { updatePnpmHome } from './install-pnpm'
import setOutputs from './outputs'
import pnpmInstall from './pnpm-install'
import pruneStore from './pnpm-store-prune'

async function main() {
  const inputs = getInputs()
  const isPost = getState('is_post')
  if (isPost === 'true') return pruneStore(inputs)
  saveState('is_post', 'true')
  if (!inputs.skipPnpmInstall) {
    await installPnpm(inputs)
    console.log('Installation Completed!')
  } else {
    updatePnpmHome(inputs.dest)
  }
  setOutputs(inputs)
  pnpmInstall(inputs)
}

main().catch(error => {
  console.error(error)
  setFailed(error)
})
