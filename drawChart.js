d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Fraga"; }));


// create sub array holding widths
  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.ages.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
  });

  // vilken domän har y axeln?
  //Ordinal
  //argumentet anger värden och ordning
  y.domain(data.map(function(d) { return d.Fraga; }).sort());

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


//place nodes on y axis using top element in array
var containers = svg.selectAll(".container")
      .data(data)
      .enter().append("g")
  .attr("class", "container")
  .attr("transform", function(d) { return "translate( 0," + y(d.Fraga) +" )"; });
  
//place filter data and set width using child array 
var bars = containers.selectAll(".bars")
  .data(function(d) { return d.ages; })
  .enter()
  .append("rect")
  .attr("class", "bars")
  .attr("width",function(d){return x(d.y1) - x(d.y0);}) //set width of each piece here
  .attr("height", y.step())
  .attr("x", function(d){return x(d.y0);}) // set starting point of each piece along x.axis
  .attr("stroke", "white")
  .style("fill", function(d){
    if(d.name == "Yes"){
      return "dodgerblue";
    } else {
      return "lightgrey";
    }});
    
// rects cannot hold a text element
// bind labels to text nodes instead
var texts = containers.selectAll(".barlabels")
  .data(function(d){return d.ages;})
  .enter()
  .append("text")
  .attr("class", "barlabels")
  .attr("x", function(d){ 
    if(d.name == "Yes"){
      return x(0.025);
      } else{
      return x(0.975);
      }})
  .attr("y", y.step()/2)
  .attr("opacity", function(d){
	if(d.y0 == 0 & d.y1 == 0 || d.y0 == 1 & d.y1 == 1){
	return 0;
	}else{
	return 1;
	}
	})
  .text(function(d){return Math.round((d.y1 -d.y0)*100) + "%";})
  .attr("text-anchor", function(d){ 
    if(d.name == "Yes"){
      return "start";
      } else{
      return "end";
      }})

});

