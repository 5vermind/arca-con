import { NextApiRequest, NextApiResponse } from 'next'
import Playwright from 'playwright'
import AdmZip from 'adm-zip'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query
  const browser = await Playwright.chromium.launch({
    headless: true,
    channel: 'chrome',
  })
  const page = await browser.newPage()
  await page.goto(`https://arca.live/e/${id}`)

  const videoUrl = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll<HTMLVideoElement>('.emoticons-wrapper video'),
    ).map(video => ({
      src: video['dataset']['src'],
      name: video['dataset']['id'],
    }))
  })

  const imgUrl = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll<HTMLImageElement>('.emoticons-wrapper img'),
    ).map(img => ({
      src: img['src'],
      name: img['dataset']['id'],
    }))
  })

  await browser.close()

  const zip = new AdmZip()

  const videoPromises = videoUrl.map(async ({ src, name }) => {
    const video = await (await fetch(`https:${src}`)).arrayBuffer()
    zip.addFile(`${name}.mp4`, Buffer.from(video))
  })

  const imgPromises = imgUrl.map(async ({ src, name }) => {
    const img = await (await fetch(src)).arrayBuffer()
    zip.addFile(`${name}.png`, Buffer.from(img))
  })

  await Promise.all([...imgPromises, ...videoPromises])

  res.status(200).send(zip.toBuffer())
}
