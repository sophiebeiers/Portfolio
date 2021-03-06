(function() {

  var margin = { top: 20, right: 10, bottom: 50, left: 10 }

  var width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

  var svg = d3.select("#graphic-3").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// make svg responsive
  function responsivefy(svg) {
      // get container + svg aspect ratio
      var container = d3.select(svg.node().parentNode),
          width = parseInt(svg.style("width")),
          height = parseInt(svg.style("height")),
          aspect = width / height;

      // add viewBox and preserveAspectRatio properties,
      // and call resize so that svg resizes on inital page load
      svg.attr("viewBox", "0 0 " + width  + " " + height)
          .attr("preserveAspectRatio", "xMinYMid")
          .call(resize);

      // to register multiple listeners for same event type,
      // you need to add namespace, i.e., 'click.foo'
      // necessary if you call invoke this function for multiple svgs
      // api docs: https://github.com/mbostock/d3/wiki/Selections#on
      d3.select(window).on("resize." + container.attr("id"), resize);

      // get width of container and resize svg to fit it
      function resize() {
          var targetWidth = parseInt(container.style("width"));
          svg.attr("width", targetWidth);
          svg.attr("height", Math.round(targetWidth / aspect));
      }
    }

  d3.queue()
    .defer(d3.csv, "./data/colors.csv")
    .await(ready)

    //  Setting up scales

    var widthScale = d3.scaleLinear()
        .domain([0, 23578])
        .range([0, width])

    var yPositionScale = d3.scaleBand()
      .domain(['BLACK', 'WHITE', 'BROWN', 'TAN', 'BLOND', 'GRAY',
      'BRINDLE', 'RUST', 'BLUE', 'FAWN'])
      .range([0, height])
      .padding(0.5)

    var colorScale = d3.scaleOrdinal()
        .domain(['BLACK', 'WHITE', 'BROWN', 'TAN', 'BLOND', 'GRAY',
        'BRINDLE', 'RUST', 'BLUE', 'FAWN'])
        .range(['black', 'white', '#663300', '#D2B48C', '#F1C40F',
        'grey', '#A0522D', '#b7410e', '#757e8e', '#E5AA70'])

  function ready(error, colors) {
    console.log(colors)


   // initial chart

   svg.selectAll('rect')
     .data(colors)
     .enter().append("rect")
     .filter(function(d) {return d.n > 1366})
     .attr("x", 0)
     .attr("y", function(d) {
       return yPositionScale(d.dominant_color)
     })
     .attr('width', function(d){
       return widthScale(d.n)
       })
     .attr("height", 25)
     .attr('fill', function(d){
       return colorScale(d.dominant_color)
       })
     .attr("stroke", function(d){
       if(d.dominant_color === "WHITE"){
         return 'black'
       } else {
         return 'transparent'
       }
       })
     .on("mouseover", function(d){
       d3.select(this)
       .style("cursor", "pointer")
       .attr("opacity", 0.7)
       d3.select('.infobox3 .dominant_color')
        .text('There are ' + d['n'] + ' primarily '+ d['dominant_color'] + ' dogs in NYC.')
       d3.select(".infobox3").style('visibility', 'visible')
       .style('font-size', "18px")
       .style('background-color', '#f2ea91')
     })

      .on("mouseout", function(){
        d3.select(this)
        .attr("opacity", 1)
        d3.select(".infobox3").style('visibility', 'hidden')

     })

// adding text
    svg.selectAll(".text")
 	  .data(colors)
 	  .enter()
 	  .append("text")
    .filter(function(d) {return d.n > 1366})
 	  .attr("class","label")
    .attr("x", 2)
 	  .attr("y", function(d) { return yPositionScale(d.dominant_color) + 8; })
 	  .attr("dy", ".75em")
 	  .text(function(d) { return d.dominant_color; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", function(d){
      if(d.dominant_color === "BLACK"){
        return 'white'
      } else {
        return 'black'
      }
    })











  }

})()
