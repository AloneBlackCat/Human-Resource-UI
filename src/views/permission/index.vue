<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0,1)">添加权限</el-button>
      <el-table border :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" align="center" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button size="mini" type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-popconfirm title="确定删除这条内容吗?" @onConfirm="delPermission(row.id)">
              <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="750px" :title="showTitle" :visible.sync="showDialog" @close="btnCancel">
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
          <el-switch v-model="permissionFrom.enVisible" :active-value="'1'" :inactive-value="'0'" size="mini" />
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
import { getPermissionList, addPermission, delPermission, getPermission, updatePermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      permissionFrom: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
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
              callback(new Error('已有权限名称'))
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
              callback(new Error('权限标识重复'))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.permissionFrom.id ? '编辑权限点' : '新增权限点'
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
    addPermission(pid, type) {
      this.permissionFrom.type = type
      this.permissionFrom.pid = pid
      this.showDialog = true
    },
    btnOK() {
      this.$refs.permissionFrom.validate(async isOK => {
        if (isOK) {
          if (this.permissionFrom.id) {
            // 编辑
            await updatePermission(this.permissionFrom)
            this.$message.success('权限数据修改成功')
          } else {
            await addPermission(this.permissionFrom)
            this.$message.success('新增权限点成功')
          }
          this.getPermissionList()
          this.btnCancel()
        }
      })
    },
    // 清空数据
    btnCancel() {
      this.permissionFrom = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      }
      this.$refs.permissionFrom.resetFields()
      this.showDialog = false
    },
    // 删除权限点
    async delPermission(id) {
      try {
        await delPermission(id)
        this.$message.success('成功删除权限点')
        this.getPermissionList()
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 修改权限点
    async editPermission(id) {
      this.permissionFrom = await getPermission(id)
      this.showDialog = true
    }
  }
}
</script>

<style scoped>
.bth-add {
  margin: 10px;
}
</style>
