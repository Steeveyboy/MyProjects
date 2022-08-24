
// var myForm = $('#myForm');

function get_names(){
  let name = $('#searchText')[0].value;
    console.log(name);
}

function chart_name(){
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Conway's Chart of Life"
      },
      data: [{
        type: "line",
            indexLabelFontSize: 16,
        dataPoints: datem
      }],
      axisY: {
        title: "Population"
      }, 
      axisX: {
          title: "Generation"
      }
    });
    chart.render();
  }
