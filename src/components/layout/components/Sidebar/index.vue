<!--
 * @Description: 
 * @Author: linZengFa
 * @Date: 2019-11-14 14:15:58
 * @LastEditTime: 2019-11-19 11:13:19
 * @LastEditors: 
 -->
<template>
  <div>
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        unique-opened
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        >
        <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>  
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import variables from '@/styles/variables.scss'
export default {
  name: 'Index',
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'permission_routers']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {}
}
</script>
