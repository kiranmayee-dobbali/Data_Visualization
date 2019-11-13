//    {"phrase":"minimum wage","category":"economy/fiscal issues","d_speeches":"9","r_speeches":"0","total":"9","percent_of_d_speeches":"39.13","percent_of_r_speeches":"0","chi2":"10.56521739","pval":"0.001152355","position":-39.13,"index":0,"x":110.35734760175804,"y":0,"vy":0,"vx":-7.677489467869409e-212,"sourceX":110.35734760175804,"sourceY":0,"moveX":110.35734760175804,"moveY":0,"correctedY":0}


class Table{

  constructor(stateData){
    this.stateData= stateData;
    this.stateHeaders = ["phrase","frequency","percentages","total"];
    /** To be used when sizing the svgs in the table cells.*/
    this.cell = {
        "width": 70,
        "height": 30,
        "buffer": 15
    };

    this.bar = {
        "height": 30
    };
    /** Setup the scales*/
    this.freqScale = d3.scaleLinear()
        .range([0,this.cell.width * 2]);
        let maxdPercent = d3.max(this.stateData,function(d){
          return d['percent_of_d_speeches'];
        })
    this.percentScale = d3.scaleLinear()
          .range([0,this.cell.width*2]).domain([-100,100]);
    this.assending=false;

  }

  create_table(){
    let that = this;
    let freqScale = this.freqScale;
    let perScale = this.percentScale;
    //Update Scale Domains
    let maxFreq= d3.max(this.stateData,function(d){
     return d['total']/50;
    })
    this.freqScale.domain([0,maxFreq]);

    let maxdPercent = d3.max(this.stateData,function(d){
      return d['percent_of_d_speeches'];
    })
    console.log(maxdPercent);
    //this.percentScale.domain([-100,100]);


       let axis = d3.axisTop()
           .scale(this.freqScale);

           let freqaxis = d3.select("#frequencyid")
               .append("svg")
               .attr("width", this.cell.width * 2 + 20)
               .attr("height", this.cell.height)
               .append("g")
               .attr("transform", "translate(10, 18)")
               .call(axis.ticks(3));
               const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
               const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);

               //Percentages
               //axis
               let paxis = d3.axisTop()
                   .scale(this.percentScale);

                   let peraxis = d3.select("#percentageid")
                       .append("svg")
                       .attr("width", this.cell.width * 2 + 20)
                       .attr("height", this.cell.height)
                       .append("g")
                       .attr("transform", "translate(10, 18)")
                       .call(paxis.ticks(5));




                      let table = d3.select("#matchTable");

                        let tr=  table.select("tbody").selectAll("tr").data(that.stateData)
                          .join('tr');
                          let td = d3.select("tbody").selectAll("tr").classed('trdata',true);
                          let td2 = td.selectAll('td').data(that.stateHeaders).join('td')
                          .attr('class',function(d){
                            return d
                          });

                      let tdbar=tr.select('.frequency');
                      console.log(tdbar);
                      let bars = tdbar.selectAll('svg')
                                      .data(function(d){
                                      //  console.log(d);
                                        return [d];
                                      })
                                      .join('svg')
                                      .attr("width", this.cell.width*2)
                                        .attr("height", this.cell.height);

                      //rectangles
                        let rect = bars.append('rect')
                                        .attr("width",function(d){
                                          return d.total*2;
                                        })
                                        .attr("height", this.bar.height-2).attr("fill", function(d){return colors(d["category"]) });

////

let tdbar_per = tr.select('.percentages');
let pbars = tdbar_per.selectAll('svg')
                      .data(function(d){
                        return [d];
                      })
                      .join('svg')
                      .attr("width", this.cell.width*2)
                        .attr("height", this.cell.height);




  let prect = pbars.append('rect')
                .attr("width",function(d){
                  return (d.percent_of_d_speeches);
                })
                .attr("height", this.bar.height-3).attr("fill","#6f99d1" ).attr("transform","translate(80,0) scale(-1,1)")
                .classed("left",true);


    let prectr = pbars.append('rect')
                  .attr("width",function(d){
                    return d.percent_of_r_speeches;
                  })
                  .attr("height", this.bar.height-3).attr("fill","red").attr("transform","translate(80,0)").classed("right",true);

                  //ngram data
                  tr.select('.phrase').text(d=>d['phrase']);

                  //total populate

                  tr.select('.total').text(d=>d['total']);



/////////
let head=d3.select("#matchTable").select("thead").select("tr");
let t= head.selectAll("th").data(this.stateHeaders)
                  .on("click",(d)=>{
                     console.log("d",d);
                    console.log("prssed");
                    if (this.assending) {
                     this.check(d);
                        this.assending = false;
                    } else {
                      this.check2(d);

                        this.assending = true;
                    }
                    this.update_table();

                  });

  }

  check(d){
    if (d == "phrase") {
        this.stateData.sort(function (a, b) {
                return a["phrase"] < b["phrase"] ? -1 : 1        })
    } else {
        this.stateData.sort(function (a, b) {
            return a["total"] - b["total"];
        })
    }

  }
  check2(d){
    if (d == "phrase") {
        this.stateData.sort(function (a, b) {
            return b["phrase"] < a["phrase"] ? -1 : 1
        })
    } else {
        this.stateData.sort(function (a, b) {
            return b["total"] - a["total"];
        })
    }

  }




  update_table(){
    let that = this;
    let freqScale = this.freqScale;
    let perScale = this.percentScale;
    const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
    const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);

    console.log("table data",that.stateData);
    console.log("now in update table");
    //Create table rows

    console.log("state dtatata",that.stateData);
//add td to rows
let table = d3.select("#matchTable");

  let tr=  table.select("tbody").selectAll("tr")
  .data(that.stateData);
//  .join('tr');
//   let td = d3.select("tbody").selectAll("tr").classed('trdata',true);
//   let td2 = td.selectAll('td').data(that.stateHeaders).join('td')
//   .attr('class',function(d){
//     return d
//   });

  //ngram data
  tr.select('.phrase').text(d=>d['phrase']);

  //total populate

  tr.select('.total').text(d=>d['total']);

//add axis to frequency




//bars for freq


//let tr1=  table.select("tbody").selectAll("tr")
//.data(that.stateData);
let bars =tr.select('.frequency').select('svg');

//rectangles
  let rect = bars.select('rect')
                  .attr("width",function(d){
                    return d.total*2;
                  })
                  .attr("height", this.bar.height-2).attr("fill", function(d){return colors(d["category"]) });


console.log(rect);

let tdbar_per = tr.select('.percentages');
let pbars = tdbar_per.selectAll('svg')
                      .data(function(d){
                        return [d];
                      })
                      //.join('svg')
                      .attr("width", this.cell.width*2)
                        .attr("height", this.cell.height);




  let prect = pbars.select('.left')
                .attr("width",function(d){
                  return (d.percent_of_d_speeches);
                })
                .attr("height", this.bar.height-3).attr("fill","#6f99d1" ).attr("transform","translate(80,0) scale(-1,1)");


    let prectr = pbars.select('.right')
                  .attr("width",function(d){
                    return d.percent_of_r_speeches;
                  })
                  .attr("height", this.bar.height-3).attr("fill","red").attr("transform","translate(80,0)");










  }
  update_table_tree(d){
  //console.log(d);
  //console.log("state",that.stateData[1]);
  let that = this;
  let table = d3.select("#matchTable");
  const categories = ["economy/fiscal issues","energy/environment","crime/justice","education","health care","mental health/substance abuse"];
  const colors = d3.scaleOrdinal().domain(categories).range(["blue", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8","#33FF39"]);

  let list_data=[]
  for(let i=0;i<d.length;i++)
  {
    let ele=d[i];
    list_data.push(that.stateData[ele]);
  }
  console.log(list_data)

  let tr=  table.select("tbody").selectAll("tr");
tr.remove();

  let tr2=  table.select("tbody").selectAll("tr").data(list_data)
    .join('tr').classed('trdata',true);
    let td2 = tr2.selectAll('td').data(that.stateHeaders).join('td')
    .attr('class',function(d){
      return d
    });




    let tdbar=tr2.select('.frequency');
    let bars = tdbar.selectAll('svg')
                    .data(function(d){
                    //  console.log(d);
                      return [d];
                    })
                    .join('svg')
                    .attr("width", this.cell.width*2)
                      .attr("height", this.cell.height);

    //rectangles
      let rect = bars.append('rect')
                      .attr("width",function(d){
                        return d.total*2;
                      })
                      .attr("height", this.bar.height-2).attr("fill", function(d){return colors(d["category"]) });

                      let tdbar_per = tr2.select('.percentages');
                      let pbars = tdbar_per.selectAll('svg')
                                            .data(function(d){
                                              return [d];
                                            })
                                            .join('svg')
                                            .attr("width", this.cell.width*2)
                                              .attr("height", this.cell.height);

                                              let freqScale = this.freqScale;
                                              let perScale = this.percentScale;
                                              //Update Scale Domains
                                              let maxFreq= d3.max(this.stateData,function(d){
                                               return d['total']/50;
                                              })
                                              this.freqScale.domain([0,maxFreq]);

                                              let maxdPercent = d3.max(this.stateData,function(d){
                                                return d['percent_of_d_speeches'];
                                              })


                        let prect = pbars.append('rect')
                                      .attr("width",function(d){
                                        return (d.percent_of_d_speeches);
                                      })
                                      .attr("height", this.bar.height-3).attr("fill","#6f99d1" ).attr("transform","translate(80,0) scale(-1,1)")
                                      .classed("left",true);


                          let prectr = pbars.append('rect')
                                        .attr("width",function(d){
                                          return d.percent_of_r_speeches;
                                        })
                                        .attr("height", this.bar.height-3).attr("fill","red").attr("transform","translate(80,0)").classed("right",true);


                                        //ngram data
                                        tr2.select('.phrase').text(d=>d['phrase']);

                                        //total populate

                                        tr2.select('.total').text(d=>d['total']);

//                                        let axis = d3.axisTop()
  //                                          .scale(this.freqScale);


                                        /*    let freqaxis = d3.select("#frequencyid")
                                                .append("svg")
                                                .attr("width", this.cell.width * 2 + 20)
                                                .attr("height", this.cell.height)
                                                .append("g")
                                                .attr("transform", "translate(10, 18)")
                                                .call(axis.ticks(3));

                                                //Percentages
                                                //axis
                                                let paxis = d3.axisTop()
                                                    .scale(this.percentScale);

                                                    let peraxis = d3.select("#percentageid")
                                                        .append("svg")
                                                        .attr("width", this.cell.width * 2 + 20)
                                                        .attr("height", this.cell.height)
                                                        .append("g")
                                                        .attr("transform", "translate(10, 18)")
                                                        .call(paxis.ticks(5));
*/



  }

  remove_table(){
    let table = d3.select("#matchTable");

    let tr=  table.select("tbody").selectAll("tr");
  tr.remove();
  let th = table.select("thead").selectAll("tr").select("#frequencyid").selectAll("svg");
  th.remove();
  let th2 = table.select("thead").selectAll("tr").select("#percentageid").selectAll("svg");
  th2.remove();

//this.update_table();
  }

}
