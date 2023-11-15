<script setup lang="ts">
import { ref } from 'vue'
import {
  getUser,
  getRepos,
  createRepo,
  isCache,
  deleRepo,
  updateFile,
  deleFile,
  createDeployment
} from './hook/useFetch'
import { decrypt } from './utils/crypto'
const oUser: any = ref({})
const oRepo: any = ref([])
const ogetUser = async () => {
  const user = await getUser()
  if (user) {
    oUser.value = user
    ogetRepos()
  }
}
const ogetRepos = async () => {
  const repos = await getRepos()
  if (repos) {
    oRepo.value = repos
  }
}
const ocreateRepo = async () => {
  let repo: any = prompt('请输入仓库名', '')
  if (repo) {
    if (oRepo.value) {
      const hasRepo = oRepo.value.find((item) => item.name == repo)
      if (hasRepo) {
        alert(`${repo}已存在仓库`)
        return
      }
    }
    let newRepo = await createRepo({
      name: repo
    })
    if (newRepo) {
      isCache.value = true
      ogetRepos()
      isCache.value = false
    }
  }
}
const odeleRepo = async (repoName: string) => {
  let sure: any = confirm(`是否确定删除仓库${repoName}`)
  if (sure) {
    if (oRepo.value) {
      const hasRepo = oRepo.value.find((item) => item.name == repoName)
      if (!hasRepo) {
        alert(`${repoName}仓库不存在`)
        return
      }
    }
    await deleRepo(repoName)
    isCache.value = true
    await ogetRepos()
    isCache.value = false
  }
}
const oupdateFile = async (repoName: string) => {
  if (oRepo.value) {
    const hasRepo = oRepo.value.find((item) => item.name == repoName)
    if (!hasRepo) {
      alert(`${repoName}仓库不存在`)
      return
    }
  }
  updateFile(repoName)
}
const odeleFile = async (repoName: string) => {
  if (oRepo.value) {
    const hasRepo = oRepo.value.find((item) => item.name == repoName)
    if (!hasRepo) {
      alert(`${repoName}仓库不存在`)
      return
    }
  }
  deleFile(repoName)
}
const input1 = ref('')
const input2 = ref('')
const input3 = () => {
  if (input1.value && input2.value) {
    let token = decrypt(input1.value, input2.value)
    localStorage.setItem('token', token)
  }
}
const ocreateDeployment=()=>{
  let sure: any = confirm(`是否确定部署`)
  if(sure){
    createDeployment()
  }
}
</script>

<template>
  <div>
    更新token:
    <input type="text" v-model="input1" />
    <input type="text" v-model="input2" />
    <button @click="input3">更新</button>
  </div>
  <div style="padding: 50px">
    <input type="checkbox" v-model="isCache" />
    <pre>
      用户: {{ oUser.name }}
      头像:<img style="width:40px;height:40px;" :src="oUser.avatar_url"/>
    </pre>
    <pre>
      <div v-for="item in oRepo" :key="item.id">{{item.name}} 
        <button @click="odeleRepo(item.name)">删除</button> 
        <button @click="oupdateFile(item.name)">上传</button>
        <button @click="odeleFile(item.name)">删除action</button>
      </div>
    </pre>
    <div>
      <button @click="ogetUser">用户信息</button>
      <button @click="ogetRepos">仓库</button>
      <button @click="ocreateRepo">创建新仓库</button>
      <button @click="ocreateDeployment">部署</button>
    </div>
  </div>
</template>
