/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  bars=document.getElementById("aBarChart");
  var c= bars.children;
  var l= c.length;
  let increment = 30;
  for(let i=0; i<l;i++)
      {
      c[i].setAttribute('width',increment)
      increment+=20;
    }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  console.log(data);
  // Set up the scales
  // TODO: The scales below are examples, modify the ranges and domains to suit your implementation.
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 140]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 140]);
  let iScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 120]);
    let jjScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.a)])
      .range([0, 240/19*d3.max(data,d=> d.a)]);

      let jyScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 240/19*d3.max(data,d=> d.b)]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let sel = d3.select('#aBarChart');
  sel.selectAll("rect")
      .data(data)
      .join("rect")
      .transition()
  .duration(1000)
      .attr("width",d => {return aScale(d.a);})
      .attr("height", 18)
      .attr("x", 0 )
      .attr("y", (d,i)=> i*20)
      .attr("transform","scale(-1,1)")
      .delay(function(d,i){ return(i*100);});
  //  sel.exit().remove();

  // TODO: Select and update the 'b' bar chart bars
  let sel_b = d3.select('#bBarChart');
  sel_b.selectAll("rect")
          .data(data)
          .join("rect")
          .transition()
      .duration(1000)
          .attr("width",d => {return bScale(d.b);})
          .attr("height", 18)
          .attr("x", 0 )
          .attr("y", (d,i)=> i*20)
          .delay(function(d,i){return(i*100);});
  // TODO: Select and update the 'a' line chart path using this line generator

  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.a));

    line_a = d3.select('#aLineChart');
    line_a.data(data)
          .join("path")

        //  .attr("transform","translate(0,100)")
        .style("opacity", 0)
        .transition()
        .duration(2000)
         .style("opacity", 1)
          .attr("transform","scale(2,2)")
          .attr("d", d => {return aLineGenerator(data);});



  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3.line()
                          .x((d, i) => iScale(i))
                          .y(d => aScale(d.b));

  line_b = d3.select('#bLineChart');
  line_b.data(data)
        .join("path")
        .style("opacity", 0)
        .transition()
        .duration(2000)
         .style("opacity", 1)
        .attr("d", d => {return bLineGenerator(data);})
                              //  .attr("transform","translate(0,100)")
        .attr("transform","scale(2,2)");
  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

    area_a = d3.select('#aAreaChart');
    area_a.data(data)
          .join("path")
          .transition()
      .duration(2000)
      .style("opacity", 0)
          .attr("d", d => {return aAreaGenerator(data);})
           .style("opacity", 1)
          .attr("transform","translate(300,150)")
          .attr("transform","scale(1,1)");

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.b));

    area_a = d3.select('#bAreaChart');
    area_a.data(data)
          .join("path")
          .transition()
      .duration(2000)
      .style("opacity", 0)
          .attr("d", d => {return bAreaGenerator(data);})
          .style("opacity", 1)
          .attr("transform","translate(300,150)")
          .attr("transform","scale(1,1)");
      area_a.exit().remove();

  // TODO: Select and update the scatterplot points
    let scatterplot = d3.select('#scatterplot');
    let tot =scatterplot.selectAll('g')
      .attr("transform","translate(20,20)");
    let circles = scatterplot.selectAll("circle").data(data)
        .join("circle")
        .attr("cx", (d) => { return jjScale(d.a); })
        .attr("cy", (d) => { return 300-jyScale(d.b); })
        .attr("transform","translate(20,-30)")
        .attr("r", 3);
/*
    scatterplot.selectAll("circle")
.data(data)
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr("cx", function (d) { return jjScale(d.a); } )
    .attr("cy", function (d) { return 300-jyScale(d.b); } );*/
  //  let tt = circles.selectAll("title")
    //    .data(data);
      //  .append("title")
    //    tt.text(function(d) { return ""+d.a+","+d.b });
 //tt.exit().remove();
//let coordinates = d3.mouse(this);


    circles.on("click", function(d) {
            let coordinates = d3.mouse(this);
            console.log("Data points: ("+d.a+", "+d.b+") ");
        });

 circles.on("mouseover", function(d){
   circles.append("title").text(function(d) {
          return d.a+","+d.b });
 })
        const plotDimensionX = 240;
        const plotDimensionY = 240;
        const plot = d3.select('#scatterplot').attr('transform', `translate(20,20)`)


        const xScale = d3.scaleLinear().domain([0, 19]).range([0, plotDimensionX])
        const yScale = d3.scaleLinear().domain([0, 20]).range([plotDimensionY, 0])


    //    const xAxisGroup = plot.append('g').classed('x-axis', true).attr('transform', `translate(0, ${plotDimensionY})`)
    //    const yAxisGroup = plot.append('g').classed('y-axis', true);
    const xAxisGroup = plot.select('#x-axis').attr('transform', `translate(20,260)`)
        const yAxisGroup = plot.select('#y-axis');


        const xAxisScale = d3.axisBottom(xScale);
        const yAxisScale = d3.axisLeft(yScale);
        xAxisGroup.call(xAxisScale);
        yAxisGroup.call(yAxisScale);
  // ****** TODO: PART IV ******
  let rid = document.getElementById("aBarChart");
  let c= rid.children;
  let len = c.length;
  for(let i=0; i< len; i++)
  {
        c[i].addEventListener("mouseover", function() {
               c[i].style.fill = "#AAC0AF";
             });
      c[i].addEventListener("mouseout", function(){
               c[i].style.fill ="#c7001e";
             });

}
let rid2 = document.getElementById("bBarChart");
let c2= rid2.children;
let len2 = c2.length;
for(let i=0; i< len2; i++)
{
      c2[i].addEventListener("mouseover", function() {
             c2[i].style.fill = "#AAC0AF";
           });
    c2[i].addEventListener("mouseout", function(){
             c2[i].style.fill ="#086fad";
           });

}
// scatter plots hover
let svgk = d3.select('#scatterplot');

let ll = svgk.select('.line-chart');
let lk = ll.selectAll('#regression-line');
  lk.data(data)
  .join("line")
  .attr("x1", d => {return 40;})
  .attr("y1", d => {return 200;})
  .attr("x2", d => {return 200;})
  .attr("y2", d => {return 80;})
  ;


}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  }
   catch (error) {
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
