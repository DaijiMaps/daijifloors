import { LocLine, LocWords, locwords_json_encoder } from './fit-json'
import * as fs from 'fs'
import * as puppeteer from 'puppeteer'

const fit_text = async (
  page: puppeteer.Page,
  text: string,
  width: string
): Promise<LocWords> => {
  await page.click('.fit-clear')
  await page.type('.fit-text', text)
  await page.type('.fit-width', width)
  await page.click('.fit-start-stop')
  await page.waitForSelector('.result')

  //await page.content().then(console.log)

  const resultText = await page.$eval('.result-text', (e) => e.innerHTML)
  const resultFontSize = await page.$eval(
    '.result-font-size',
    (e) => e.innerHTML
  )

  const lines: LocLine[] = await page.$$eval('.result svg text tspan', (ee) =>
    ee.map((e) => ({
      text: e.innerHTML.replace(/&amp;/, '&'),
      fontSize: Number(e.getAttribute('font-size')),
      dy: Number(e.getAttribute('y')) - 50,
    }))
  )
  const locwords: LocWords = {
    text: resultText.replace(/&amp;/, '&'),
    fontSize: Number(resultFontSize),
    lines,
  }
  return locwords
}

export const fit_texts = async (
  texts: readonly string[],
  width: string
): Promise<LocWords[]> => {
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()

  await page.goto('https://localhost:5173/fit.html')

  await page.setViewport({ width: 1280, height: 900 })

  const results = []
  for (const text of texts) {
    const result = await fit_text(page, text, width)
    console.log(`fit: ${text}`)
    results.push(result)
  }

  await browser.close()

  return results
}

export const fit_main = async (args: string[], width: string) => {
  if (args.length < 2) {
    throw new Error()
  }
  const infile = args[0]
  const outfile = args[1]

  const texts_string = fs.readFileSync(infile, 'utf8')
  const texts = texts_string
    .trim()
    .split('\n')
    .map((s) => s.trim())

  const results = await fit_texts(texts, width)
  const json: Record<string, LocWords> = {}
  for (const loc of results) {
    json[loc.text] = loc
  }
  const s = locwords_json_encoder(json)
  fs.writeFileSync(outfile, s, 'utf8')
}
