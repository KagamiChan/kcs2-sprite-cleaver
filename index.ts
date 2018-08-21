import axios from 'axios'
import Promise from 'bluebird'
import fs from 'fs-extra'
import { sample, size } from 'lodash'
import path from 'path'
import URL from 'url'
import yargsParser from 'yargs-parser'

const argv = yargsParser(process.argv.slice(2))

const SERVERS = ['203.104.209.102']

const HOST = sample(SERVERS)

const main = async () => {
  if (!size(argv._)) {
    console.log('Nothing happened')
    return
  }

  await Promise.map(argv._, async (p: string) => {
    if (!p.endsWith('png')) {
      return
    }
    const imageLink = URL.resolve(`http://${HOST}/`, p)
    const metaLink = URL.resolve(`http://${HOST}/`, p.replace('.png', '.json'))

    const { data: image } = await axios.get(imageLink, {
      responseType: 'arraybuffer',
    })

    const { data: meta } = await axios.get(metaLink)

    await fs.outputFile(path.resolve(__dirname, './tmp', p), image)

    await fs.outputJson(
      path.resolve(__dirname, './tmp', p.replace('.png', '.json')),
      meta,
      { spaces: 2 },
    )
  })
}

main()
