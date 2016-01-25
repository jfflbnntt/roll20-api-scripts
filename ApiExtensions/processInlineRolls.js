// general function for processing inlien rolls and tables
function processInlinerolls(msg) {
	if(_.has(msg,'inlinerolls')){
		return _.chain(msg.inlinerolls)
		.reduce(function(m,v,k){
			var ti=_.reduce(v.results.rolls,function(m2,v2){
				if(_.has(v2,'table')){
					m2.push(_.reduce(v2.results,function(m3,v3){
						m3.push(v3.tableItem.name);
						return m3;
					},[]).join(', '));
				}
				return m2;
			},[]).join(', ');
			m['$[['+k+']]']= (ti.length && ti) || v.results.total || 0;
			return m;
		},{})
		.reduce(function(m,v,k){
			return m.replace(k,v);
		},msg.content)
		.value();
	} else {
		return msg.content;
	}
}