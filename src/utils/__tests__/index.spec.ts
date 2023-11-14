import { describe, it, expect } from 'vitest'
import { encrypt, decrypt } from '../crypto'
import { sleep } from '../sleep'

describe('加密和解密', () => {
  let str = '123'
  let key = '321'
  it('加密', () => {
    let result = encrypt(str, key)
    console.log(result)
    expect(result).toContain('eVdfWFoWVltHXEBU')
  })
  it('解密', () => {
    let result = decrypt('eVdfWFoWVltHXEBU', key)
    expect(result).toContain(str)
  })
})

describe('延迟', () => {
  it('延迟1000毫秒', async () => {
    let num = await sleep(1000)
    expect(num).toBe(1000)
  })
})
