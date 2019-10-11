<template>
    <card>
        <tabs type="card" value="newTask">
            <tab-pane label="新建群发" name="newTask">
				<card>
                	<domain-create :formItems="fromItems"></domain-create>
				</card>
            </tab-pane>
            <tab-pane label="群发记录" name="taskList">
				<card>
					<domain-page v-bind="timelineProps"></domain-page>
				</card>
            </tab-pane>
        </tabs>
    </card>
</template>
<script>
import fromItems from './form/form-items'
import DomainCreate from '../../../../views/domain/create.vue'
import DomainPage from '../../../../views/domain/page.vue'
import TaskColumns from '../../timeline/create/table/columns'
import Task from '../../../../models/marketing/task'
export default {
	components: {
		DomainCreate,
		DomainPage
	},
	data() {
		return {
			type: 'newTask',
			fromItems: fromItems,
			timelineProps: {
				domain: Task,
				columns: TaskColumns
			}
		}
	},
	methods: {
		onForm() {}
	}
}
</script>

