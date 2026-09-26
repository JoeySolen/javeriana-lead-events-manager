/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

const script = readFileSync('public/theme-init.js', 'utf8')

describe('tema antes de cargar React', () => {
  it.each([
    ['dark', false, 'dark'],
    ['light', true, 'light'],
    ['system', true, 'dark'],
    ['invalid', false, 'light'],
    [null, true, 'dark'],
  ])('aplica %s con sistema oscuro=%s', (saved, systemDark, expected) => {
    const root = { dataset: { theme: '' } }
    runInNewContext(script, {
      window: {
        localStorage: { getItem: () => saved },
        matchMedia: () => ({ matches: systemDark }),
      },
      document: {
        documentElement: root,
        querySelector: () => ({ setAttribute: () => {} }),
      },
    })
    expect(root.dataset.theme).toBe(expected)
  })

  it('usa el sistema si no se puede leer localStorage', () => {
    const root = { dataset: { theme: '' } }
    runInNewContext(script, {
      window: {
        localStorage: {
          getItem: () => {
            throw new Error('blocked')
          },
        },
        matchMedia: () => ({ matches: true }),
      },
      document: {
        documentElement: root,
        querySelector: () => ({ setAttribute: () => {} }),
      },
    })
    expect(root.dataset.theme).toBe('dark')
  })
})
