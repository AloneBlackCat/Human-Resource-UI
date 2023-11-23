<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="showDialog = true">添加权限</el-button>
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" align="center" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text">添加</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="750px" title="新增权限点" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="permissionFrom" :model="permissionFrom" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="权限名称">
          <el-input v-model="permissionFrom.name" style="width:500px" size="mini" />
        </el-form-item>
        <el-form-item prop="code" label="权限标识">
          <el-input v-model="permissionFrom.code" style="width:500px" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="权限描述">
          <el-input v-model="permissionFrom.description" style="width:500px" size="mini" />
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch v-model="permissionFrom.enVisible" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确认</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      permissionFrom: {
        id: '',
        name: '',
        code: '',
        description: '',
        enVisible: 0,
        pid: ''
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          // 自定义校验
          validator: async(rule, value, callback) => {
            // value就是输入的编码
            let result = await getPermissionList()
            // 判断是否是编辑模式
            if (this.permissionFrom.id) {
              // 编辑场景
              result = result.filter(item => item.id !== this.permissionFrom.id)
            }
            // result数组中是否存在value值
            if (result.some(item => item.name === value)) {
              callback(new Error('已有该权限名称'))
            } else {
              callback()
            }
          }
        }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          // 自定义校验
          validator: async(rule, value, callback) => {
            // value就是输入的编码
            let result = await getPermissionList()
            // 判断是否是编辑模式
            if (this.permissionFrom.id) {
              // 编辑场景
              result = result.filter(item => item.id !== this.permissionFrom.id)
            }
            // result数组中是否存在value值
            if (result.some(item => item.code === value)) {
              callback(new Error('已有该权限标识'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const result = transListToTreeData(await getPermissionList(), 0) // 转换为树形结构
      this.list = result
    },
    btnOK() {
      this.$refs.permissionFrom.validate(isOK => {
        console.log(isOK)
      })
    },
    btnCancel() {
      this.$refs.permissionFrom.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
.bth-add {
  margin: 10px;
}
</style>
