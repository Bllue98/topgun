// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },
  {
    title: 'Talents',
    path: '/talents',
    icon: 'tabler:mail'
  },
  {
    title: 'Rarities',
    path: '/rarities',
    icon: 'tabler:star'
  },
  {
    title: 'Effects',
    path: '/effects',
    icon: 'tabler:sparkles'
  },
  {
    title: 'Costs',
    path: '/costs',
    icon: 'tabler:coin'
  },
  {
    title: 'Report',
    path: '/report',
    icon: 'tabler:mail'
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'tabler:shield'
  }
]

export default navigation
