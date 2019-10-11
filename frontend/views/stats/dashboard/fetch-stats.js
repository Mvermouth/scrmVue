import Constant from "../../../configs/constant";
import Axios from "axios";

/**
 * 查询统计数据
 * 
 * @param {*} dashboardId 
 * @param {*} tileId 
 * @param {*} dataSources 
 * @param {*} query 
 * @param {*} baseUrl
 */
async function fetchStats(dashboardId, tileId, dataSources, query, baseUrl) {
	return Promise.all(
		dataSources.map((it, idx) => {
			switch (it.type) {
				case Constant.StatsDataSourceType.URL.value: {
					const method = it.method.toUpperCase()
					switch (method) {
						case 'GET': {
							return Axios.get(it.url).then(result => result.data.data);
						}
						case 'POST': {
							return Axios.post(it.url, it.body).then(result => result.data.data);
						}
					}
				}
				default: {
					return Axios.post(`${it.url || baseUrl}/${dashboardId}/${tileId}/${idx}`, query).then(result => result.data.data)
				}
			}
		})
	)
}

async function exportStats(dashboardId, tileId, dataSources, query, baseUrl) {
	const dataSource = dataSources[0]
	switch (dataSource.type) {
		case Constant.StatsDataSourceType.URL.value: {
			window.open(dataSource.exportUrl, '__blank')
			break
		}
		default: {
			window.open(`${dataSource.url || baseUrl}/${dashboardId}/${tileId}/0/export?q=${encodeURIComponent(JSON.stringify(query))}`, '__blank')
			break
		}
	}
}

export {
	fetchStats,
	exportStats
}