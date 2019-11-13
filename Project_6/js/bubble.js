//    {"phrase":"minimum wage","category":"economy/fiscal issues","d_speeches":"9","r_speeches":"0","total":"9","percent_of_d_speeches":"39.13","percent_of_r_speeches":"0","chi2":"10.56521739","pval":"0.001152355","position":-39.13,"index":0,"x":110.35734760175804,"y":0,"vy":0,"vx":-7.677489467869409e-212,"sourceX":110.35734760175804,"sourceY":0,"moveX":110.35734760175804,"moveY":0,"correctedY":0}
class Bubble{
  constructor(stateData,tableobj){
    this.stateData= stateData;
    this.stateHeaders = ["phrase","",""];
 this.tableob = tableobj;
 this.indicator=0;
 this.circleattr;
 this.flag=0;
  }
  change_color(selectedIndices,circleattr){
    circleattr.attr("fill-opacity",0.5)
    circleattr
        .filter((_, i) => {
          //console.log(selectedIndices.includes(i));
            return selectedIndices.includes(i);
        })
   .attr("fill-opacity",1);
  }

change_color_on_end(circleattr){
  circleattr.attr("fill-opacity",1)
}

create_brush(){//circleattr,indicator
let that=this;

  console.log("now in create brush");
  const width1 = 800;
  const height1 = 900;
  let selectedIndices=[];
    const brushGroup = d3.select("#svg1")
          .append("g")
          .classed("brush", true);
       const brush = d3.brush().extent([[0, 0], [900, 1200]])
        //  .on("start", this.updateChart())
      //  .on("end",()=>{
        //  console.log("brushing ended");
    //  that.change_color_on_end(that.circleattr)
  //  that.tableob.remove_table();
  //  that.tableob.create_table();
    //d3.event.stopPropagation();



          .on("brush", function () {
            console.log("ind",that.indicator);
            const selection = d3.brushSelection(this);
             selectedIndices = [];
            if (selection) {
              //console.log(selection);
                const [[left, top], [right, bottom]] = selection;
                that.stateData.forEach((d, i) => {
                  if(that.indicator==1){
                    console.log("indicator=1");
                    if (
                        d.moveX >= left &&
                        d.moveX <=right &&
                        d.moveY+120 >= top &&
                        d.moveY+120<= bottom
                    ) {
                      //console.log("data-i",i);
                        selectedIndices.push(i);

                    }
                  }//indc if
                  else {
                    if (
                        d.sourceX >= left &&
                        d.sourceX <=right &&
                        d.sourceY+120 >= top &&
                        d.sourceY+120 <= bottom
                    ) {
                      //console.log("data-i",i);
                        selectedIndices.push(i);

                    }
                  }
                  that.tableob.update_table_tree(selectedIndices);

                  }
                )
            }
              //circleattr.classed("circles", false);

                 if (selectedIndices.length > 0) {

                        // .classed("circles", true).attr("fill","black");
                         that.change_color(selectedIndices,that.circleattr)
                 }
                 else{
                   console.log("not selected");

                 }

               }



             ).on("end",function(){

               if(selectedIndices.length!=0){
                 that.change_color_on_end(that.circleattr)
                  that.tableob.remove_table();
                  that.tableob.create_table();
                  //that.tableob.update_table_tree(selectedIndices);
                 console.log(selectedIndices);
                 selectedIndices=[];
                 console.log(selectedIndices);
                 console.log("onend");

              //  that.tableob.create_table()
            }

             });



          brushGroup.call(brush);


}



updateChart(){
console.log("chart updated");
}


  create_bubble()
  {
    let that=this;
  //  let indicator=0;

    console.log("now in create_bubbles")
    console.log(that.stateData[0]["sourceX"]);
    let min = d3.min(that.stateData,function(d){
      //console.log(d["sourceX"]);
      return Math.min(d["sourceX"]);
        });
    console.log("minimum",min);

   let max = d3.max(that.stateData,function(d){
     //console.log(d["sourceX"]);
     return Math.max(d["sourceX"]);
       });
    console.log("maximum",max);
    let svg = d3.select("#svg1");

    let xScale = d3.scaleLinear()
                  .domain([-50,60])
                  .range([min,max]);
                //  .nice()
                //  .ticks();

    //X-axis
    let xAxis = d3.axisBottom();

     xAxis.scale(xScale);
     svg.select("g").append("g").call(xAxis).attr("transform", "translate(0,10)");

     const circleScale = d3.scaleLinear()
           .domain([
             d3.min(that.stateData.map(d => +d["total"])),
             d3.max(that.stateData.map(d => +d["total"]))
           ])
           .range([3, 12]);
    const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
    const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);
    // Define the div for the tooltip
    var div = d3.select(".view1").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

   let circle = svg.append("g").classed("g-all",true)
                    .selectAll("circle")
                    .data(that.stateData)
                    .join("circle")
                    .classed("circles",true);
      that.circleattr = circle.attr("cx",d=> (d["sourceX"]))
                              .attr("cy",d=>(d["sourceY"]))
                              .attr("r",d=>circleScale(d["total"]))
                              .attr("transform", "translate(0,120)")
                              .attr("fill", function(d){return colors(d["category"]) })
                              .style("stroke","black")
                              .on("mouseover", function(d){
                                div.transition()
                                                .duration(200)
                                                .style("opacity", .9);

                                            div.html(function(){
                                              let x;
                                              d['position']=Math.round(d["position"]*100)/100;

                                              if(d["position"]>=0){
                                                  d['position']="+"+ d['position'];
                                                x="percent_of_r_speeches";
                                              }
                                              else{
                                                x="percent_of_d_speeches"
                                              }

                                              return "<h2>"+d["category"]+"</h2>"+"R"+d["position"]+"<br/>"+"In "+d[x]+"% of speeches"
                                            }).style('font-size', '10px')

                                                .style("left", (d3.event.pageX) + "px")
                                                .style("top", (d3.event.pageY - 1) + "px");
                     d3.select(this)
                     	  .transition()
                     	  .duration(1000)
                     	  .attr('stroke-width',3)

                              })
                              .on("mouseout", function(d) {
                                         div.transition()
                                             .duration(500)
                                             .style("opacity", 0);
                                             d3.select(this)
                     .transition()
                     .duration(500)
                     .attr('stroke-width',1)

                                     });


                              let pt = d3.select("#svg1").select(".g-all");
                              let  text= pt.selectAll("text")
                                      .data(categories)
                                      .join("text")
                                      .attr('x',50).attr('y',100);

      //line y axis
      //let svg = d3.select("#svg1");

      let line = svg.select("line")
                    .join("line").classed("liney",true);
          line.attr("x1", 385.5)
                .attr("y1", 23)
                 .attr("x2", 385.5)
                  .attr("y2", 180).attr('stroke',"#B8B8B8");





      //bees chart
      let t_button =d3.select("#button2")
                      .on("click",function(d){
                        that.indicator=1;
console.log(that.indicator);
                        that.update_bubble(that.indicator)});
                        //this.create_brush(circleattr,indicator);


  }

  update_bubble(indicator){
    let that=this;
    console.log("now in update bubble");
    const circleScale = d3.scaleLinear()
          .domain([
            d3.min(this.stateData.map(d => +d["total"])),
            d3.max(this.stateData.map(d => +d["total"]))
          ])
          .range([3, 12]);
    const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
    const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);

    var div = d3.select(".view1").select(".tooltip");


    let circle_new = d3.selectAll(".circles").data(this.stateData).transition().duration(1000)
    .attr("cx",d=> d["moveX"])
                            .attr("cy",d=>d["moveY"])
                            .attr("r",d=>circleScale(d["total"]))
                            .attr("transform", "translate(0,120)")
                            .attr("fill", function(d){return colors(d["category"]) });
let circle_n = d3.selectAll(".circles");
    let t_button =d3.select("#button2")
                   .on("click",function(d){that.clear_bubble()});

                   let svg = d3.select("#svg1").select(".g-all");
                   let  text= svg.selectAll("text")
                           .data(categories)
                           .join("text")
                           .attr('x',50).attr('y',100).transition().duration(1000);

                   let text_attr = text.attr("x", 50 )
                                  .attr("y", function(d,i) {
                                    if(i==5){
                                       i=5.3;}
                                    return i*120+90; })
                                  .text( function (d,i) { return d; })
                                 .attr("font-family", "sans-serif")
                                 .attr("font-size", "15px")
                                  .attr("fill", "#696969");


                                  let ex_button = d3.select("#button3").on("click",function(d){

if(that.flag==0){
                                    let svg_ex = d3.select(".view1").select("#svg1");
                                    //svg_ex.attr("opacity",);
                                    console.log("extreme");
                                    let c = d3.selectAll(".circles").attr("opacity",0.5);//.attr("cx",26.920504490731886).attr("cy",129.9606781328506).attr("fill","blue");
                                    //c.append("circle").attr("cx",26.920504490731886).attr("cy",129.9606781328506).attr("r",5).attr("fill","blue");
                               let c1=d3.select("circle:nth-child(3)").attr("fill","blue").attr("stroke","black").attr("opacity",1);//.attr("tooltip","hekllo");
                               d3.select("circle:nth-child(11)").attr("fill","red").attr("stroke","black").attr("opacity",1);

                                let rec=d3.select("#svg1")//.append("svg").attr("width",100).attr("height",100);
                              let t=  rec.append("g").attr("class","ex")
                                .append("rect")
                                .attr("x",26.920504490731886)
                                .attr("y",129.9606781328506)
                                .attr("width",520)
                                .attr("height",50)
                                .attr("fill","white").attr("stroke","black");

                                rec.select(".ex").append("text").attr("x",50).attr("y",160)
        .attr("color", "black").text(function(){
          return "Democratic speeches mentioned climate 49.11% more"
        }).attr("font-family", "sans-serif")
        .attr("font-size", "20px")
         .attr("fill", "black");

         rec.select(".ex").append("line").attr("x1",27).attr("y1",250).attr("x2",27).attr("y2",150).attr("stroke","black");
rec.append("g").attr("class","ex2").append("rect")
.attr("x",355.920504490731886)
.attr("y",250.9606781328506)
.attr("width",520)
.attr("height",50)
.attr("fill","white").attr("stroke","black");

rec.select(".ex2").append("line").attr("x1",875.920504490731886).attr("y1",250.9606781328506).attr("x2",875.920504490731886).attr("y2",360.9606781328506).attr("stroke","black");


rec.select(".ex2").append("text").attr("x",360).attr("y",280)
.attr("color", "black").text(function(){
return "Republican speeches mentioned prison 52.33% more"
}).attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "black");
that.flag=1;
}
if(that.flag==1){
let t = d3.selectAll("g").select(".ex").remove();
let t2=d3.selectAll("g").select(".ex2").remove();
}

})// onclick



let svgl = d3.select("#svg1")
        let line = svgl.select(".liney");
            line.attr("x1", 385.5)
                  .attr("y1", 23)
                   .attr("x2", 385.5)
                    .attr("y2", 960).attr('stroke',"#B8B8B8").transition().duration(1000);
console.log(circle_new);
        //this.create_brush(circle_n,indicator);


  }
clear_bubble(){
      let that=this;
      console.log("now in clear ");
//let t_button =d3.select(".switch")
  //             .on("click",function(d){that.create_bubble()});
  const circleScale = d3.scaleLinear()
        .domain([
          d3.min(this.stateData.map(d => +d["total"])),
          d3.max(this.stateData.map(d => +d["total"]))
        ])
        .range([3, 12]);
  const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
  const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);


  var div = d3.select(".tooltip");

  let circle_new = d3.selectAll(".circles").data(this.stateData).transition().duration(1000)
  .attr("cx",d=> d["sourceX"])
                          .attr("cy",d=>d["sourceY"])
                          .attr("r",d=>circleScale(d["total"]))
                          .attr("transform", "translate(0,120)")
                          .attr("fill", function(d){return colors(d["category"]) });


//let circle_n = d3.selectAll(".circles");
      let svg = d3.select("#svg1").select(".g-all");
      let  text= svg.selectAll("text").transition().duration(1000).attr('x',50).attr('y',100).remove();


  let t_button =d3.select("#button2")
                 .on("click",function(d){that.update_bubble()});

    //this.create_brush(circleattr);


}

}
