<template>
 <div>
<el-tree
  :data="data2"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]"
  :props="defaultProps"
  @check="changeState"
  >
</el-tree>
</div>
</template>

<script>
// import index from '@/views/manage/user/index'
import http from '@comm/service/interface.js'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  // props:['data2'],
  mounted () {
    this.getTree()
  },
  methods: {
    getTree () {
      if (this.$route.path === '/manage/person/department' || this.$route.path === '/manage/person/user') {
        http.groupTree({pid: 0}).then(res => {
          this.data2 = res.data
        })
      } else {
        http.permissionTree({pid: 0}).then(res => {
          this.data2 = res.data
        })
      }
    },
    changeState (data, node) {
      this.setNodeId(node.checkedKeys)
    },
    ...mapActions('manage', {
      setNodeId: 'setNodeId'
    })
  }
}
</script>
