<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope" width="300px">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加角色"
      v-model="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改角色"
      v-model="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      v-model="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        v-if="tree"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      // 所有权限数据
      rightsList: [],
      // 添加角色对话框。初始为false
      addDialogVisible: false,
      //编辑对话框
      editDialogVisible: false,
      // 添加角色表单
      addForm: {
        // 角色名
        roleName: "",
        // 角色描述
        roleDesc: ""
      },
      // 编辑角色表单
      editForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 15, message: '角色描述的长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 控制分配权限的对话框
      setRightDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      tree: true,
      // 当前即将分配权限的角色id
      roleId: ''

    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      } else {
        this.roleList = res.data
      }
    },
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$axios.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加用户成功')
            // 操作成功，关闭对话框
            this.addDialogVisible = false
            this.getRoles()
          }
        }
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$axios.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('查询此条用户信息失败')
      } else {
        this.editForm = res.data
      }
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editRolesInfo () {
      this.$refs.editFormRef.validate(async validate => {
        if (!validate) {
          return
        } else {
          const { data: res } = await this.$axios.put(`roles/${this.editForm.roleId}`, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
          if (res.meta.status !== 200) {
            return this.$message.error('更新角色信息失败')
          } else {
            this.$message.success('更新角色信息成功')
            // 关闭对话框
            this.editDialogVisible = false
            // 刷新数据列表
            this.getRoles()
          }
        }
      })
    },
    async removeRolesById (id) {
      // 返回值用async await优化
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (confirmResult != 'confirm') {
        return this.$message.info('已经取消删除')
      } else {
        const { data: res } = await this.$axios.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户信息失败')
        } else {
          this.$message.success('已经删除该用户信息')
          this.getRoles()
        }
      }
    },
    // 根据id删除权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      } else {
        const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户权限失败')
        } else {
          this.$message.success('已经删除该权限')
          // 接口返回了当前角色删除后的数据,role是形参
          role.children = res.data
        }
      }
    },
    //展示分配权限的对话框
    async showSetRightDialog (role) {
      // 对话框中获取所有权限的数据
      this.roleId = role.id
      const { data: res } = await this.$axios.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      } else {
        this.rightsList = res.data
        console.log(this.rightsList)
      }
      //递归获取三级节点的id
      // this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下三级角色权限的id，并保存在defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是最低一级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        // ...展开运算符
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')

      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      } else {
        this.$message.success('分配权限成功')
        this.getRoles()
        this.setRightDialogVisible = false
      }

    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>