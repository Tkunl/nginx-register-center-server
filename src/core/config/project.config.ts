import { readFileSync } from 'fs'
import { load } from 'js-yaml'
import { join } from 'path'

const YAML_CONFIG_FILENAME = 'config.yaml'

export function projectConfig() {
  return load(readFileSync(join('src', YAML_CONFIG_FILENAME), 'utf8')) as Record<string, unknown>
}
