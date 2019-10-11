import '../../../../scripts/common/app'

import Profile from '../../../../models/im/profile'
import Employee from '../../../../models/erp/employee'
import formItems from './form/form-items'

import View from '../../../../views/domain/update.vue'

(async() => {
	const employeeId = App.data.domain.extra.employeeId
	const defaultOptions = []
	if (employeeId) {
		try {
			const employeeData = await Employee.retrieve(employeeId)
			defaultOptions.push({ value: employeeId, label: `${employeeData.sn}(${employeeData.name})` })
		} catch (error) {
			console.log('profile has employee but not retrieve employee:', employeeId)
		}
	}
	const retrieve = async id => {
		const defaults = App.data.domain
		if (defaults.extra) {
			defaults.employeeId = defaults.extra.employeeId
			defaults.paymentPassword = defaults.extra.paymentPassword
			defaults.loginPassword = defaults.extra.loginPassword
			defaults.remark = defaults.extra.remark
			defaults.banned = defaults.extra.banned || false
			defaults.autoApprovedFriend = defaults.extra.autoApprovedFriend || false
			defaults.registeredDate = defaults.extra.registeredDate
		}
		if (defaults.extra && defaults.extra.bank) {
			defaults.bankName = defaults.extra.bank.bank
			defaults.bankCardNo = defaults.extra.bank.bankCardNo
			defaults.bankCardAccount = defaults.extra.bank.bankCardAccount
			defaults.bankBindMobile = defaults.extra.bank.bankBindMobile
			defaults.idCardName = defaults.extra.bank.idCardName
			defaults.idCardNo = defaults.extra.bank.idCardNo
		}
		if (defaults.tags && defaults.tags.length > 0) {
			defaults.tags = _.map(defaults.tags, it => { return { name: it, show: true } })
		}
		return defaults
	}

	const update = async data => {
		const extra = {}
		if (data.employeeId) {
			extra.employeeId = data.employeeId
		} else {
			extra.employeeId = null
		}
		if (data.remark) {
			extra.remark = data.remark
		}
		if (data.paymentPassword) {
			extra.paymentPassword = data.paymentPassword
		}
		if (data.loginPassword) {
			extra.loginPassword = data.loginPassword
		}
		const bank = {}
		if (data.bankName) {
			bank.bank = data.bankName
		}
		if (data.bankCardNo) {
			bank.bankCardNo = data.bankCardNo
		}
		if (data.bankCardAccount) {
			bank.bankCardAccount = data.bankCardAccount
		}
		if (data.bankBindMobile) {
			bank.bankBindMobile = data.bankBindMobile
		}
		if (data.idCardName) {
			bank.idCardName = data.idCardName
		}
		if (data.idCardNo) {
			bank.idCardNo = data.idCardNo
		}
		extra.bank = bank
		extra.registeredDate = data.registeredDate
		extra.banned = data.banned
		extra.autoApprovedFriend = data.autoApprovedFriend
		const tags = data.tags.map(it => { return it.name })
		const updateParams = {
			id: data.id,
			tags: tags,
			extra: extra
		}
		const val = await Profile.update(updateParams)
		return val
	}

	new Vue({
		el: '#app',
		data: {
			defaultOptions: defaultOptions
		},
		render: h => {
			const v = h(View, {
				props: {
					domain: Profile,
					formItems,
					formProps: {
						labelWidth: 130
					},
					defaults: retrieve,
					update
				}
			})
			return App.target === 'dialog' ? v : <card>{v}</card>
		}
	})
})()

