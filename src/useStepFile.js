import { useState, useEffect } from 'react'

import { LoadStep } from './StepLoader'
import { convertObjectToGlb } from './convertObjectToGlb'

export function useStepFile({ url }) {
  const [obj, setObj] = useState(null)
  const [glb, setGlb] = useState(null)

  useEffect(() => {
    async function load() {
      setObj(null)
      setGlb(null)

      if (!url) {
        return
      }
      try {
        // const mainObject = LoadStep('https://github.com/kovacsv/occt-import-js/raw/main/test/testfiles/cax-if/as1_pe_203.stp')
        // const mainObject = await LoadStep('/as1_pe_203.stp')
        const mainObject = await LoadStep(url)
        console.log('mainObject', mainObject)
        setObj(mainObject)

        const glbUrl = await convertObjectToGlb(mainObject)
        console.log('glbUrl', glbUrl)
        setGlb(glbUrl)
      } catch (error) {
        console.error(error)
      }
    }
    load()
  }, [url])

  return {
    step: obj,
    glb
  }
}
