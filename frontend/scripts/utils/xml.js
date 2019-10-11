export function parseXml(xmlString) {
	var xmlDoc = null

	// 支持IE浏览器
	if (!window.DOMParser && window.ActiveXObject) {
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM']
		for (var i = 0; i < xmlDomVersions.length; i++) {
			try {
				xmlDoc = new ActiveXObject(xmlDomVersions[i])
				xmlDoc.async = false
				xmlDoc.loadXML(xmlString)
				break
			} catch (e) {}
		}
	}
	// 支持Mozilla浏览器
	else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
		try {
			var domParser = new DOMParser()
			xmlDoc = domParser.parseFromString(xmlString, 'text/xml')
		} catch (e) {}
	} else {
		return null
	}

	return xmlDoc
}

export function getXmlValue(xmlString, node) {
	var xmlObj = parseXml(xmlString)
	try {
		var xmlValue = xmlObj.getElementsByTagName(node)
		if (xmlValue.length == 0) {
			return xmlString
		} else {
			return xmlValue[0].firstChild.nodeValue
		}
	} catch (error) {
		return xmlString
	}
}
