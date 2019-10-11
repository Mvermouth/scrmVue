/**
 * 默认列表操作
 */

import AppRoutes from '../../../configs/AppRoutes'

export default domain => {

    return {

        // 刷新
        'view': {
            title: '刷新',
            icon: 'ivu-icon ivu-icon-refresh',
            type: 'success',
            onAction: $list => $list.load()
        },

        // 添加
        'create': {
            title: '添加',
            icon: 'ivu-icon ivu-icon-plus',
            type: 'info',
            onAction: $list => App.push(AppRoutes.Domain.create(domain))
        },

        // 批量删除
        'delete': {
            title: '删除',
            icon: 'ivu-icon ivu-icon-trash-b',
            type: 'error',
            selection: true,
            onAction: ($list, rows) => {
                const ids = rows.map(it => it[domain.primaryKey])
                $list.$Modal.confirm({
                    title: '确认删除',
                    content: '是否删除选择的数据？',
                    loading: true,
                    onOk: async () => {
                        try {
                            await domain.batchDelete(ids)

                            $list.$Modal.remove()
                            $list.$Notice.success({ title: '删除成功' })

                            $list.deselect(ids)

                            App.event.$emit(domain.events.Delete)

                        } catch (e) {
                            $list.$Modal.remove()
                        }
                    }
                })
            }
        }



    }
}