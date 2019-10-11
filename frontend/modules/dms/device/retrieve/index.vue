<template>
    <div>
        <tabs size="small" @on-click="onTab" :value="tab">       
                <tab-pane  label="通讯录" name="contact">
                    <domain-page v-bind="contactPageProps"></domain-page>
                </tab-pane>
                <tab-pane  label="通话记录" name="dms">
                    <domain-page v-bind="callPageProps"></domain-page>
                </tab-pane>
                <!-- <tab-pane  label="应用列表" name="app">
                    <domain-page v-bind="appPageProps"></domain-page>
                </tab-pane> -->
                <!-- <tab-pane  label="短信列表" name="sms">
                    <domain-page v-bind="smsPageProps"></domain-page>
                </tab-pane> -->
        </tabs>
        <import-contact v-model="importModal"></import-contact>
    </div>
</template>
<script>
import DeviceLog from '../../../../models/dms/auditLog'
import DmsContact from '../../../../models/dms/contact'
import DmsApp from '../../../../models/dms/app'
import DmsCall from '../../../../models/dms/call'
import DmsSms from '../../../../models/dms/sms'
  
import ContactFormItems from './table/contact/form-items'
import ContactColumns from './table/contact/columns'

import CallFormItems from './table/call/form-items'
import CallColumns from './table/call/columns'
import SmsFormItems from './table/sms/form-items'
import SmsColumns from './table/sms/columns'
import AppFormItems from './table/app/form-items'
import AppColumns from './table/app/columns'
import DomainPage from '../../../../views/domain/page.vue'
import ImportContact from './import-contact.vue'
import { findComponentDownward } from "../../../../scripts/utils/ui"
const defaultSort = [
 	// {
	// 	'ignoreCase': false,
	// 	'property': 'ctime',
	// 	'type': 'DSC'
	// }
]

const importAction= {
        importContact: {
            title: "导入联系人",
            type: "info",
            unauthorize: true,
            onAction: function($list) {
              const orderListView = findComponentDownward(
                $list.$root,
                "DeviceDetailView"
              );
              orderListView.importContact();
            }
        }
}
export default {
    name: "DeviceDetailView",
	components: {
        'domain-page': DomainPage,
        'import-contact':ImportContact
	},
	data() {
		return {
            tab: 'contact',
            importModal:false,
            contactPageProps: {
                domain: DmsContact,
                columns: ContactColumns,
                formItems:ContactFormItems,
                actions: ['view',importAction],
                defaultCriterias: [],
                defaultSort:defaultSort
            },
            
            callPageProps: {
				domain: DmsCall,
                columns: CallColumns,
                formItems:CallFormItems,
                actions:['view'],
                defaultCriterias: [],
                defaultSort:defaultSort
            },
            appPageProps: {
				domain: DmsApp,
                columns: AppColumns,
                formItems:AppFormItems,
                actions:['view'],
                defaultCriterias: [],
                defaultSort:defaultSort
			},
            smsPageProps: {
				domain: DmsSms,
                columns: SmsColumns,
                formItems:SmsFormItems,
                actions:['view'],
                defaultCriterias: [],
                defaultSort:defaultSort
			}
		}
	},
	watch: {
		value() {}
	},
	mounted() {},

	methods: {
        onTab() {},
        importContact(criterias, sort) {
            this.importModal = true
        }
	}
}
</script>