<template>
  <div>
    <h1>Todo List - DAPP</h1>
    <h3>Account: {{account}}</h3>
    <v-text-field label="Task" v-model=newTaskCont></v-text-field>
    <v-btn @click="createTask">Add Task</v-btn>

    <h3>Tasks</h3>
    <v-data-table :loading="loading" :headers="headers" :items="tasks" class="elevation-1"></v-data-table>
    <v-text-field v-model="id" label="ID"></v-text-field>
    <v-btn @click="toggleCompleted">Complete/In-Complete</v-btn>
  </div>
</template>

<script>
  import Web3 from 'web3'
  import json from '~/build/contracts/TodoList.json'
  import TruffleContract from 'truffle-contract'

  export default {
    data() {
      return {
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Task',
            value: 'content'
          },
          {
            text: 'Complete',
            value: 'complete'
          }
        ],
        web3Provider: null,
        account: null,
        web3: null,
        contracts: {},
        loading: true,
        tasks: [],
        newTaskCont: '',
        id: 0
      }
    },
    created() {
      console.log('created')
      this.load()
    },
    methods: {
      async load() {
        await this.loadWeb3()
        await this.loadAccount(this)
        await this.loadContract(this)
        await this.renderTasks(this)
        this.loading = false
      },
      async loadWeb3() {
        this.web3 = window.web3
        // console.log('web3', this.web3)
        if (typeof this.web3 !== 'undefined') {
          this.web3Provider = this.web3.currentProvider
          this.web3 = new Web3(this.web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          console.log('ethereum', window.ethereum)
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({
              /* ... */ })
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({
            /* ... */ })
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      loadAccount: async (parent) => {
        // Set the current blockchain account
        let accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })
        console.log('Account', accounts)
        parent.account = accounts[0];
        console.log('0 Account', parent.account)
      },
      loadContract: async (parent) => {
        // Create a JavaScript version of the smart contract
        parent.contracts.TodoList = TruffleContract(json)
        parent.contracts.TodoList.setProvider(parent.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        parent.todoList = await parent.contracts.TodoList.deployed()
        console.log('contract todoList', parent.todoList)
      },
      render: async (parent) => {
        // Prevent double render
        if (parent.loading) {
          return
        }

        // Update app loading state
        parent.loading = true

        // Render Account
        console.log('Render Account', parent.account)

        // Render Tasks
        await parent.renderTasks(parent)

        // Update loading state
        parent.loading = false
      },

      renderTasks: async (parent) => {
        // Load the total task count from the blockchain
        const taskCount = await parent.todoList.taskCount()
        parent.tasks = []
        for (var i = 1; i <= taskCount; i++) {
          // Fetch the task data from the blockchain
          const task = await parent.todoList.tasks(i)
          let taskJson = {
            id: task[0].toNumber(),
            content: task[1],
            complete: task[2]
          }
          console.log('Task', taskJson)
          parent.tasks.push(taskJson)
        }
      },

      async createTask() {
        this.loading = true
        await this.todoList.createTask(this.newTaskCont, {
          from: this.account
        })
        this.loading = false
        this.newTaskCont = ''
        this.renderTasks(this)
      },

      async toggleCompleted() {
        if (this.id > 0) {
          this.loading = true
          const taskId = this.id
          await this.todoList.toggleCompleted(taskId, {
            from: this.account
          })
          this.renderTasks(this)
          this.loading = false
        }
      }
    }
  }
</script>
