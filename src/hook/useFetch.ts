// https://api.github.com/users/chendj001
import { ref } from 'vue'
const headers = {
  Authorization: 'token ' + localStorage.getItem('token')
}
export const isCache = ref(false)
const getCache = () => {
  return isCache.value ? 'no-cache' : 'default'
}
let user = 'chendj001'

/**
 * 获取用户信息
 * @param userName 用户英文名
 * @returns
 */
export const getUser = async (userName: string = user) => {
  return await fetch(`https://api.github.com/users/${userName}`, {
    method: 'GET',
    headers,
    cache: getCache()
  }).then((res) => {
    if (res.status == 200) {
      return res.json()
    } else {
      return undefined
    }
  })
}

export interface Repo {
  /**
   * 仓库名
   */
  name: string
  [x: string]: any
}
/**
 * 个人所有仓库
 * @param userName
 * @returns
 */
export const getRepos = async (userName: string = user) => {
  return await fetch(`https://api.github.com/users/${userName}/repos`, {
    method: 'GET',
    headers,
    cache: getCache()
  }).then((res) => {
    if (res.status == 200) {
      return res.json() as any as Repo[]
    } else {
      return undefined
    }
  })
}

export interface CreateRepo {
  /**
   * 仓库名
   */
  name: string
  /**
   * 描述
   */
  description?: string
  /**
   * 网址
   */
  homepage?: string
}
/**
 * 创建新仓库
 */
export const createRepo = async ({
  name,
  description,
  homepage
}: CreateRepo) => {
  return await fetch('https://api.github.com/user/repos', {
    body: JSON.stringify({
      name: name,
      description: description || '',
      homepage: homepage || '',
      private: false,
      is_template: true
    }),
    method: 'POST',
    headers,
    cache: getCache()
  }).then((res) => {
    if (res.status == 201) {
      return res.json() as any as Repo
    } else {
      return undefined
    }
  })
}

/**
 * 删除仓库
 */
export const deleRepo = async (repo: string, userName: string = user) => {
  return await fetch(`https://api.github.com/repos/${userName}/${repo}`, {
    method: 'DELETE',
    headers,
    cache: getCache()
  }).then((res) => {
    if (res.status == 204) {
      return true
    } else {
      return undefined
    }
  })
}

let tpl = `name: ci

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          # 选择要使用的 node 版本
          node-version: '14'

      # 缓存 node_modules
      - name: Cache dependencies
        uses: actions/cache@v2
        id: yarn-cache
        with:
          path: |
            **/node_modules
          key: \${{ runner.os }}-yarn-\${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            \${{ runner.os }}-yarn-

      # 如果缓存没有命中，安装依赖
      - name: Install dependencies
        if: steps.yarn-cache.outputs.cache-hit != 'true'
        run: yarn --frozen-lockfile

      # 运行构建脚本
      - name: Build frontend
        run: npm install
      - name: Build frontend
        run: npm run build-only

      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为Vite项目的默认输出目录
          build_dir: ./dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`

function stringToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)))
}
export const updateFile = async (repo: string, userName: string = user) => {
  return await fetch(
    `https://api.github.com/repos/${userName}/${repo}/contents/.github/workflows/ci.yml`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: '上传action文件',
        content: stringToBase64(tpl)
      }),
      cache: getCache()
    }
  ).then((res) => {
    if (res.status == 201) {
      return res.json()
    } else {
      return undefined
    }
  })
}
export const lookFile = async (repo: string, userName: string = user) => {
  // https://api.github.com/repos/chendj001/update/contents/.github/workflows
  return await fetch(
    `https://api.github.com/repos/${userName}/${repo}/contents/.github/workflows`,
    {
      method: 'GET',
      headers,
      cache: getCache()
    }
  ).then((res) => {
    if (res.status == 200) {
      return res.json()
    } else {
      return undefined
    }
  })
}

export const deleFile = async (repo: string, userName: string = user) => {
  let prepo = await lookFile(repo, userName)

  return await fetch(
    `https://api.github.com/repos/${userName}/${repo}/contents/.github/workflows/ci.yml`,
    {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        message: '删除action文件',
        sha: prepo.find((item) => item.name == 'ci.yml').sha
      }),
      cache: getCache()
    }
  ).then((res) => {
    if (res.status == 200) {
      return res.json()
    } else {
      return undefined
    }
  })
}

export const createDeployment = async () => {
  return await fetch(`https://api.github.com/repos/chendj89/v12/actions/workflows/ci.yml/dispatches`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ref: 'main',
    }),
    cache: getCache()
  }).then((res) => {
    if (res.status == 201) {
      return res.json()
    } else {
      return undefined
    }
  })
}
