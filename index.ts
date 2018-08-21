import axios from 'axios'
import Promise from 'bluebird'
import fs from 'fs-extra'
import { each, entries, sample, size } from 'lodash'
import path from 'path'
import { PNG } from 'pngjs'
import URL from 'url'
import yargsParser from 'yargs-parser'

import { IIMageInfo } from './types'

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
    const infoLink = URL.resolve(`http://${HOST}/`, p.replace('.png', '.json'))

    const { data: image } = await axios.get<ArrayBuffer>(imageLink, {
      responseType: 'arraybuffer',
    })

    const { data: info } = await axios.get<IIMageInfo>(infoLink)

    await fs.outputFile(path.resolve(__dirname, './tmp', p), image)

    await fs.outputJson(
      path.resolve(__dirname, './tmp', p.replace('.png', '.json')),
      info,
      { spaces: 2 },
    )

    const source = await createPNG(image)
    await fs.ensureDir(path.resolve(__dirname, './result'))

    console.log(source)

    each(entries(info.frames), ([k, f]) => {
      const { x, y, w, h } = f.frame

      const dest = new PNG({ width: w, height: h })

      source.bitblt(dest, x, y, w, h)

      dest
        .pack()
        .pipe(
          fs.createWriteStream(path.resolve(__dirname, './result', `${k}.png`)),
        )
    })
  })
}

const createPNG = (source: ArrayBuffer): Promise<PNG> =>
  new Promise((resolve, reject) => {
    new PNG().parse(new Buffer(source), (error, data) => {
      if (error) {
        reject()
      }
      resolve(data)
    })
  })

main()
