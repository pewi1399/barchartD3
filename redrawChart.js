//function picks up selection from initialziation and updates bound data
//no reactive support for creating new rects or changing axis in current build
// takes a data argument as input default "data1.csv"
function redraw(){

d3.csv("data1.csv", function(error, data) {
  if (error) throw error;

// have some fun scrambling data
for(var i = 0; i < data.length; i++){
	data[i].No = data[i].No * (Math.random()*Math.random()*10);
};


// recalculate arrays
  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.ages.forEach(function(d) { d.y0 /= y0; d.y1 /= y0; });
  });

//bind new data to existing containers
//containers = d3.selectAll(".container")
//	.data(data);

var newdata = []; // store their names within a local array

for(var i = 0; i < data.length; i++){
	for (var j = 0; j < 2; j ++){
	newdata.push(data[i].ages[j]);
	}
}
  
//update and redraw data
d3.selectAll(".bars")
	.data(newdata)
	.transition()
	.duration(2000)
  	.attr("width",function(d){return x(d.y1) - x(d.y0);}) //set width of each piece here
  	.attr("x", function(d){return x(d.y0);}); // set starting point of each piece along x.axis

    
// rects cannot hold a text element
// bind labels to text nodes instead
d3.selectAll(".barlabels")
  .data(newdata)
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
	.transition()
 	.duration(2000)
  	.text(function(d){return d.name + " " + Math.round((d.y1 -d.y0)*100) + "%";})
  .attr("text-anchor", function(d){ 
    if(d.name == "Yes"){
      return "start";
      } else{
      return "end";
      }})
//.duration(3000)
//        .tween("text", function(d) {
//            var i = d3.interpolate(this.textContent, d),
//                prec = (d + "").split("."),
//                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
//
//            return function(t) {
//                this.textContent = Math.round(i(t) * round) / round;
//            };
//        });

});
}

