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
