import '../../../../scripts/common/app'
import AppRoutes from '../../../../configs/AppRoutes'
import formItems from './table/form-item'
import ImageText from '../../../../models/matter/imageText'
import View from '../../../../views/domain/page.vue'

new Vue({
	el: '#app',
	render: h => {
		const v = h(View, {
			props: {
				display: 'grid',
				formItems,
				defaultCriterias:
					[
						{
							filterType: 'EQ',
							property: 'type',
							value: 'imageText'
						}
					],
				domain: ImageText,
				actions: [
					{
						upload: {
							title: '新建图文素材',
							type: 'primary',
							unauthorize: true,
							onAction: ($list, rows) => {
								App.push(AppRoutes.Matter.createImageText())
							}
						}
					}
				],
				renderGrid: (h, ctx, $grid) => {
					return <div class='image-text-item'>
						<div class='ctime'>{dateformat(new Date(ctx.row.ctime), 'yyyy-mm-dd HH:MM:ss')}</div>
						<div class='title'>{ctx.row.name}</div>
						<div class='img'><img src={ctx.row.url}></img></div>
						<div class='abstract'>{ctx.row.metaData.description}</div>
					</div>
				}
			}
		})
		return <card>{v}</card>
	}
})

