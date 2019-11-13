
d3.json("./data/words.json").then(data=>{
  console.log(data);
  let tab = new Table(data);

    tab.create_table();
    tab.update_table();
  let bub = new Bubble(data,tab);
  bub.create_brush();

  bub.create_bubble();
  //bub.create_brush();



})
