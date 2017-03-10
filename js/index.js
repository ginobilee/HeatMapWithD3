window.onload=function(){
	const url='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
	const data=d3.json(url,function(data){
			const logs=data.monthlyVariance;
			const maxTemp=Math.ceil(d3.max(logs,function(d){return d.variance;})),minTemp=Math.floor(d3.min(logs,function(d){return d.variance;}));
			//console.log(minTemp);
			const margin={left:80,top:150,right:30,bottom:130},
			width=screen.width-100-margin.left-margin.right,
			height=800-margin.top-margin.bottom;
			const chart=d3.select(".chart")
												.attr("width",width+margin.left+margin.right)
												.attr("height",height+margin.top+margin.bottom)
											.append("g")
												.attr("transform","translate("+margin.left+","+margin.top+")");
			//console.log('width:'+width);
			
			//add color scale
			const c=d3.hsl(245,45,88),csWidth=520,colorArr=d3.range(minTemp,maxTemp,1),hStart=150,hEnd=-50;
			const colorScale=d3.scaleLinear()//this is a color scale location 
														.domain([minTemp,maxTemp])
														.range([0,csWidth]);
			const hScale=d3.scaleLinear()//this is a color scale for h in hsl
														.domain([minTemp,maxTemp])
														.range([hStart,hEnd]);
			const colorWidth=csWidth/colorArr.length;
			const colors=chart.append("g")
														.attr("transform","translate("+(width/2)+","+(height+margin.top-100)+")");										
			colors.selectAll("rect")
						.data(colorArr)
						.enter()
					.append("rect")
						.attr("transform",function(d,i){return "translate("+colorScale(d)+",0)"})
						.attr("width",colorWidth)
						.attr("height",20)
						.style("fill",function(d){let h=hScale(d);return d3.hsl(h,1,0.45);})
						.style("stroke","#000")
						.style("stroke-width",0.5);
			const colorAxes=d3.axisBottom(colorScale);	
			colors.append("g")
							.attr("transform","translate(0,20)")
							.call(colorAxes)
							.append("text")
								.attr("x",width/2+20)
								.attr("y",35)
								.attr("text-anchor","end")
								.style("font-size","15px")
								.style("fill","black")
								.text("This scale is a variance relative to the Jan 1951-Dec 1980 average,which is estimated absolute temperature ℃: 8.66 +/- 0.07.");
																	
			//construct x scale
			const xScale=d3.scaleBand()
													.range([0,width])
													.domain(logs.map(function(d){return d.year}));
			const minYear=d3.min(logs,function(d){return d.year}),maxYear=d3.max(logs,function(d){return d.year}),yearArr=d3.range(minYear,maxYear,23);
			const yearScale=d3.axisBottom(xScale)
														.tickSizeOuter(0)
														.tickValues([...yearArr,2015]);
			chart.append("g")
							.attr("transform","translate(0,"+height+")")
							.call(yearScale);
			const fragWidth=xScale.bandwidth();	
			//console.log('fragWidth:'+fragWidth);
			
			//construct y scale
			const yScale=d3.scaleBand()
												.rangeRound([0,height])
												.domain(logs.map(function(d){return d.month}));
			const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			const monthScale=d3.scaleBand()
														.rangeRound([0,height])
														.domain(months);
			const yAxes=d3.axisLeft(monthScale)
														.tickSizeOuter(0);
			chart.append("g")
							.attr("transform","translate(0,0)")
							.attr("class","y axis")
							.call(yAxes)
						.append("text")
							.attr("transform","rotate(-90)")
							.attr("x",-220)
							.attr("y",-45)
							.style("font-size","25px")
							.style("fill","black")
							.text("Months");
																
			//console.log(yScale(12));
			const fragHeight=yScale.bandwidth();
			
			//initiate tips
			const valFormat=d3.format(".2f");
			const tip = d3.tip()
											.attr('class', 'd3-tip')
											.offset([-10, 0])
											.html(function(d) { return "<strong>Year:"+d.year+"<br />Month:"+months[d.month-1]+"<br /></strong> <span style='color:red'>Temperature:" + valFormat(d.variance+8.66) + "℃</span>"; });
			chart.call(tip);
			const rects=chart.append("g")
													.selectAll("rect")
														.data(logs)
														.enter()
													.append("rect")	
														//.attr("class","frag")
														.attr("width",fragWidth)
														.attr("height",fragHeight)
														.attr("x",function(d){return xScale(d.year)})
														.attr("y",function(d){return yScale(d.month)})
														.style("fill",function(d){let h=hScale(d.variance);return d3.hsl(h,1,0.45);})
														.on('mouseover', tip.show)
		      									.on('mouseout', tip.hide);		
	});
}