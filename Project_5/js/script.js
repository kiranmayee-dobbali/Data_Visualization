    /**
     * Loads in the table information from fifa-matches-2018.json
     */
/*
d3.json('data/fifa-matches-2018.json').then( data => {

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
/*   d3.csv("data/fifa-tree-2018.csv").then(csvData => {

        //Create a unique "id" field for each game
        csvData.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);
        console.log("data",data);
        table.createTable();
        table.updateTable();
    });
});
*/

// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

 d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

     /**
           * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
//      */
         let ranking = {
            "Winner": 7,
            "Runner-Up": 6,
            "Third Place": 5,
            "Fourth Place": 4,
            "Semi Finals": 3,
            "Quarter Finals": 2,
            "Round of Sixteen": 1,
            "Group": 0
            };
          function findtag(d){
     for(let name in ranking) {
         if (ranking[name] == d) {
             return name;
         }
     }
 };

    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {
      let teamData = d3.nest()
               .key(d => d.Team)
               .rollup(leaves => {

                    let goalsmade = d3.sum(leaves, d => d["Goals Made"]);
                   let goalsconceded = d3.sum(leaves, d => d["Goals Conceded"]);
                   let delta= goalsmade - goalsconceded;
                   let wins= d3.sum(leaves,  d => d.Wins );
                   let losses = d3.sum(leaves,  d => d.Losses );
                   let result= {"label": findtag(ranking[d3.max(leaves, k => k.Result)]), "ranking":ranking[d3.max(leaves, k => k.Result)]};
                   let total = leaves.length;
                   let type= "aggregate";


                   let games2 = [];
                   for (let i of leaves) {
                       let game = {};
                       game.key = i.Opponent;
                       game.value = {
                           "Delta Goals": [],
                           "Goals Conceded": i["Goals Conceded"],
                           "Goals Made": i["Goals Made"],
                           "Losses": [],
                           "Wins": [],
                           "Result": {"label": findtag(ranking[i.Result]), "ranking":ranking[i.Result]},
                           "type": "game",
                       };
                       games2.push(game);
                   }
                   let games = games2;
                   games.sort(function(x, y){
                     let a= x.value.Result.ranking;
                     let b =  y.value.Result.ranking;
                                    return d3.descending(a,b);
                                });
                   let obj = {
                       "Goals Made": goalsmade,
                       "Goals Conceded": goalsconceded,
                       "Delta Goals": delta,
                       "Wins": wins,
                       "Losses": losses,
                       "games": games,
                       "type": type,
                       "TotalGames": total,
                       "Result": result
                   };
                   return obj;
               })
               .entries(matchesCSV);
console.log(teamData);
//     // ******* TODO: PART I *******
        let tree = new Tree();
        tree.createTree(treeCSV);


        let table = new Table(teamData,tree);

         table.createTable();
         table.updateTable();
       });

 });
// ********************** END HACKER VERSION ***************************
