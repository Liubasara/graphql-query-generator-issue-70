import { globSync } from 'glob'
import path from 'path'

function getGqlFiles() {
  const files = globSync('**/*.gql')
  const relativeFiles = files.map(file => path.relative(__dirname, file))
  return relativeFiles
}

export const schema = getGqlFiles()
