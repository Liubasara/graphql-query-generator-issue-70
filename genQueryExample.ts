import { generateRandomQuery } from 'ibm-graphql-query-generator'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { buildSchema, print } from 'graphql'
import { schema as allSchemasPath } from './allSchemas'
import { dirname, resolve, basename } from 'path'

const dirName = __dirname

async function writeToFile(path: string, content: string) {
  try {
    const dir = dirname(path)

    await mkdir(dir, { recursive: true })

    await writeFile(path, content, { flag: 'w' })
  } catch (error) {
    console.error(`Error writing file: ${error}`)
  }
}

;(async () => {
  await Promise.all(
    allSchemasPath.map(path => {
      return (async () => {
        const schemaStr = (await readFile(path)).toString()
        const filename = basename(path)
        const targetName = `Q${filename.charAt(0).toUpperCase() + filename.slice(1)}`
        const { queryDocument } = generateRandomQuery(buildSchema(schemaStr), {
          providePlaceholders: true,
          considerUnions: true,
          considerInterfaces: true
        })

        const queryStr = print(queryDocument)
        await writeToFile(resolve(dirName, 'dist', 'query', targetName), queryStr)
      })()
    })
  )
})()
