/**
 * App的通用配置
 */
const options = {

    // 样式配置
    styles: {
        // 样式名前缀
        prefix: 'app-',

        // 布局选项
        layout: {

            breakpoints: {

                // 宽度节点
                width: {
                    xs: 480,
                    sm: 768,
                    md: 992,
                    lg: 1200,
                    xl: 1600,
                    xxl: Number.MAX_SAFE_INTEGER
                },

                // 高度节点
                height: {
                    xs: 480,
                    sm: 768,
                    md: 992,
                    lg: 1200,
                    xl: 1600,
                    xxl: Number.MAX_SAFE_INTEGER
                }
            }
        },

        // 字体大小
        fontSizeBase: 16,
        fontSizeSmall: 14,

        // 表格样式
        table: {
            // 单元格宽度
            width: {
            }
        },

        // 表单样式
        form: {
            // 布局
            layout: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 21,
                    offset: 1
                },
                md: {
                    span: 18,
                    offset: 3
                },
                lg: {
                    span: 14,
                    offset: 5
                }
            }
        },

        // 对话框样式
        modal: {

            // 宽度样式
            width: {

                // 最大宽度
                max: {
                    xs: 440,
                    sm: 720,
                    md: 940,
                    lg: 1000,
                    xl: 1200,
                    xxl: 1600
                },

                // 响应式宽度 - 容器宽度占比
                responsive: {
                    xs: .9,
                    sm: .9,
                    md: .9,
                    lg: .9,
                    xl: .9,
                    xxl: .9
                },

                // 固定宽度
                fixed: {
                    xs: {
                        small: 260,
                        normal: 340,
                        large: 420
                    },
                    sm: {
                        small: 480,
                        normal: 580,
                        large: 680
                    },
                    md: {
                        small: 480,
                        normal: 680,
                        large: 880
                    },
                    lg: {
                        small: 480,
                        normal: 680,
                        large: 880
                    },
                    xl: {
                        small: 480,
                        normal: 680,
                        large: 880
                    },
                    xxl: {
                        small: 680,
                        normal: 880,
                        large: 1080
                    }
                }
            },

            // 高度样式
            height: {

                // 最大高度
                max: {
                    xs: 440,
                    sm: 720,
                    md: 940,
                    lg: 1000,
                    xl: 1200,
                    xxl: 1600
                },

                // 响应式高度 - 容器高度占比
                responsive: {
                    xs: .9,
                    sm: .9,
                    md: .9,
                    lg: .9,
                    xl: .9,
                    xxl: .9
                }
            }
        },

        // iview 相关样式
        iview: {

            card: {
                header: {
                    height: 51
                }
            }
        }

    }
}

// 表格宽度
for (let i = 1; i <= 50; ++i) {
    options.styles.table.width[`w_${i}`] = options.styles.fontSizeBase * i
}

// 操作宽度
for (let i = 1; i <= 5; ++i) {
    options.styles.table.width[`label_actions_${i}`] = options.styles.table.width[`w_${4 + i * 2}`]
    options.styles.table.width[`button_actions_${i}`] = options.styles.table.width[`w_${4 + i * 3}`]
}

// 其它宽度
options.styles.table.width.ip = options.styles.table.width.w_16
options.styles.table.width.mobile = options.styles.table.width.w_11
options.styles.table.width.img = options.styles.table.width.w_8
options.styles.table.width.avatar = options.styles.table.width.w_5
options.styles.table.width.date = options.styles.table.width.w_9
options.styles.table.width.datetime = options.styles.table.width.w_11
options.styles.table.width.price = options.styles.table.width.w_8
options.styles.table.width.default = options.styles.table.width.w_10

// 数据类型的默认列宽度
options.styles.table.width.dataTypeDefaults = {
    string: options.styles.table.width.w_12,
    integer: options.styles.table.width.w_8,
    datetime: options.styles.table.width.datetime
}

export default options