/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object;
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData; //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .range([0,this.cell.width * 2]);

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
            .range([0,this.cell.width]);

            /**Color scales*/
            /**For aggregate columns*/
            /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = d3.scaleLinear()
            .range(["#feebe2","#690000"]);

            /**For goal Column*/
            /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = d3.scaleThreshold()
            .range(["#cb181d","#034e7b"]);
            this.increment=false;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        let that = this;
        // ******* TODO: PART II *******

        //Update Scale Domains

        let maxGoals = d3.max(that.teamData, function(d){
          return Math.max(d.value[that.goalsMadeHeader], d.value[that.goalsConcededHeader]);
        });
        let maxTotalGames = d3.max(this.tableElements, function (d) {
            return d.value.TotalGames;
        })

        //Update Scale Domains
        this.goalScale.domain([0,maxGoals]);
        this.gameScale.domain([0,maxTotalGames]);

        this.aggregateColorScale.domain([0,maxTotalGames]);
        this.goalColorScale.domain([0]);

        // Create the x axes for the goalScale.
        let axis = d3.axisTop()
            .scale(this.goalScale);

        //add GoalAxis to header of col 1.
        let goalaxis = d3.select("#goalHeader")
            .append("svg")
            .attr("width", this.cell.width * 2 + 20)
            .attr("height", this.cell.height)
            .append("g")
            .attr("transform", "translate(10, 18)")
            .call(axis);

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        this.tableHeaders.splice(0, 0, "Team");
       let head = d3.select("thead").select("tr");
        let td = head.selectAll("th, td")
            .data(this.tableHeaders)
            .on("click",(d)=>
          {
            this.collapseList();

            if (this.assending) {
             this.check(d);
                this.assending = false;
            } else {
              this.check2(d);

                this.assending = true;
            }
            this.updateTable();
          })

        // Clicking  headers should also trigger collapseList() and updateTable().


    }


check2(d){
  if (d == "Team") {
      this.tableElements.sort(function (a, b) {
           return b.key.localeCompare(a.key);

      })
  } else if (d == "Result") {
      this.tableElements.sort(function (a, b) {
          return b.value.Result.ranking - a.value.Result.ranking;
      })
  } else {
      this.tableElements.sort(function (a, b) {
          return b.value[d] - a.value[d];
      })
  }
}
     check(d){
       if (d == "Team") {
           this.tableElements.sort(function (a, b) {
               return a.key.localeCompare(b.key);
           })
       } else if (d == "Result") {
           this.tableElements.sort(function (a, b) {
               return a.value.Result.ranking - b.value.Result.ranking;
           })
       } else {
           this.tableElements.sort(function (a, b) {
               return a.value[d] - b.value[d];
           })
       }
     }
    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {

        let goalScale = this.goalScale;
        let gameScale = this.gameScale;
        let aggregateColorScale = this.aggregateColorScale;
        let goalColorScale = this.goalColorScale;

        // ******* TODO: PART III *******
        //Create table rows

let tablerow = d3.select("tbody").selectAll("tr")
     .data(this.tableElements)
     .join('tr').attr("class", function (d) {
         return d.value.type == "aggregate" ? "aggregate" : "game";
     })
     .on("mouseover", d => this.tree.updateTree(d))
     .on("mouseout", d => this.tree.clearTree());



console.log("table elements",this.tableElements);
        let tablehead = tablerow.selectAll("th")
            .data(function (d) {
              return [d];   })
        .join('th')
        .text(function (d) {
          if(d.value.type == "game"){
            return "x"+d.key;
         }
          else{
            return d.key;
         }
        })
        .on("click", d => this.updateList(d));

        let td = tablerow.selectAll("td")
            .data(function (d, i) {
                let list_t = [];
                if (d.value.type == "aggregate") {
                    list_t.push({type: "aggregate", vis: "goals", value: {delta: d.value["Delta Goals"],
                                                                          conceded: d.value["Goals Conceded"],
                                                                          made: d.value["Goals Made"]}});
                    list_t.push({type: "aggregate", vis: "texts", value: d.value.Result.label});

                    list_t.push( {type: "aggregate", vis: "bars", value: d.value.Wins});

                   list_t.push({type: "aggregate", vis: "bars", value: d.value.Losses});

                    list_t.push({type: "aggregate", vis: "bars", value: d.value.TotalGames});
                }
                 else {
                    let gmade = d.value["Goals Made"];
                    let gconceded = d.value["Goals Conceded"];
                    let gdelta = gmade - gconceded;

                    list_t.push({type: "game", vis: "goals", value: {delta: gdelta,
                       conceded: gconceded, made: gmade}});

                    list_t.push({type: "game", vis: "texts", value: d.value.Result.label});

                    list_t.push({type: "game", vis: "null"});
                    list_t.push({type: "game", vis: "null"});
                    list_t.push({type: "game", vis: "null"});
                }
                return list_t;
            })
            td = td.join('td');

        let tdbar = td.filter(function (d, i) {
            return d.type == "aggregate" && d.vis == "bars";
        })
            .attr("style", "padding: 2px 2px 2px 0px");

        let bars = tdbar.selectAll("svg")
            .data(function (d) {
                return [d];
            }).join('svg')
            .attr("width", this.cell.width)
            .attr("height", this.cell.height);

        let rect = bars.selectAll("rect")
            .data(function (d) {
                return [d];
            }).join('rect')
            .attr("width", function (d) {
                return gameScale(d.value);
            })
            .attr("height", this.bar.height-2)
            .attr("fill", function (d) {
                return aggregateColorScale(d.value)
            })

        let barstext = bars.selectAll("text")
            .data(function (d) {
                return [d];
            }).join('text')
            .attr("x", function (d) {
                return gameScale(d.value) - 10;
            })
            .attr("y", this.cell.height / 2 + 5)
            .attr("class", "label")
            .text(function (d) {
                return d.value;
            })

        let empty = td.filter(function (d, i) {
            return d.type == "game" && d.vis == "null";
        })
        empty.select("svg").remove();
/////////////////////////////////////////////////////////


        let tdgoal = td.filter(function (d) {
            return d.vis == "goals"
        })
            .attr("title", function (d) {
                return "Goals Made: "+d.value.made+","+
                       "Goals Conceded: "+d.value.conceded;      })

        let goals_svg = tdgoal.selectAll("svg")
            .data(function (d) {
                return [d];
            }).join('svg')
            .attr("width", this.cell.width * 2 + 20)
            .attr("height", this.cell.height)

        let goals = goals_svg.selectAll("g")
            .data(function (d) {
                return [d];
            }).join('g')
            .attr("transform", "translate(10, 0)")

        let goalsrect = goals.selectAll("rect")
            .data(function (d) {
                return [d];
            }).join('rect')
            .attr("x", function (d) {
                return goalScale(d3.min([d.value.made, d.value.conceded]));
            })
            .attr("y", d => d.type == "aggregate" ? 4: 7)
            .attr("width", function (d) {
                return goalScale(Math.abs( d.value.delta ));
            })
            .attr("height", d => d.type == "aggregate" ? this.bar.height - 8 : (this.bar.height - 14))
            .attr("fill", function (d) {
                return goalColorScale(d.value.delta);
            })
            .attr("class", "goalBar")



///////////////////////////////////////////////////////////////////
        let circle = goals.selectAll("circle")
            .data(function (d) {
                let temp = [];
                temp.push({type: d.type, value: d.value.conceded, made: false, delta: d.value.delta});
                temp.push({type: d.type, value: d.value.made, made: true, delta: d.value.delta});
                return temp;
            }).join("circle")
            .attr("cx", function (d) {
                return goalScale(d.value);
            })
            .attr("cy", this.bar.height / 2)
            .attr("r", d => d.type == "aggregate" ? (this.bar.height - 8) / 2 : (this.bar.height - 8) / 2)
            .attr("fill", function (d) {
                if (d.type == "aggregate") {
                    if (d.delta == 0)
                        return "#888888";
                    if (d.made)
                        return "#034e7b";
                    else
                        return "#cb181d";
                } else {
                    return "#ffffff";
                }
            })
            .attr("stroke", function (d) {
                if (d.type == "aggregate") {
                    return null;
                } else {
                    if (d.delta == 0)
                        return "#888888";
                    if (d.made)
                        return "#034e7b";
                    else
                        return "#cb181d";
                }
            })

        let results = td.filter(function (d) {
            return d.vis == "texts";
        })
            .style("min-width", this.cell.width * 2+"px")
            .text(function (d) {
                return d.value;
            })

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
     updateList(i) {
         // ******* TODO: PART IV *******

         if (i.value.type == "game")
             return;

         for(let k=0; k < this.tableElements.length; k++){
           if(this.tableElements[k].key == i.key && this.tableElements[k].value.type == "aggregate" ){
              if(this.tableElements[k+1].value.type == "game"){
                while (k+1 < this.tableElements.length && this.tableElements[k+1].value.type == "game") {
                    this.tableElements.splice(k+1, 1);

             }

            }
              else {
                for(let m= 0; m <i.value.games.length ; m++){
                  this.tableElements.splice(k+m+1, 0, i.value.games[m]);
              }
           }
              break;
                     }

         //Only update list for aggregate clicks, not game clicks

     }
     this.updateTable();

}
    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

        for (let i = this.tableElements.length - 1; i >= 0; i--) {
            if (this.tableElements[i].value.type == "game") {
                this.tableElements.splice(i, 1);
            }
        }
    }


}
