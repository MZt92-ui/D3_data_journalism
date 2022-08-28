
// ===========================================
// Set up SVG element & chart area
var svgWidth = 800;
var svgHeight = 500;

var margin = {top:20,right:40,bottom:60,left:50}

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// ===========================================
// Import data from the data.csv file & Draw charts
d3.csv("../assets/data/data.csv").then(function(rawdata){

    // format the data to numerical values
    rawdata.forEach(function(row){
        row.healthcare = +row.healthcare;
        row.poverty = +row.poverty;
    });

    // create axes and append axes in the chart
    var xscale = d3.scaleLinear().domain(d3.extent(rawdata, d => d.poverty)).range([0,chartWidth]);
    var yscale = d3.scaleLinear().domain(d3.extent(rawdata, d => d.healthcare)).range([chartHeight,0]);

    var b_axis = d3.axisBottom(xscale);
    var l_axis = d3.axisLeft(yscale);

    chartGroup.append("g")
        .attr("transform",`translate(0, ${chartHeight})`)
        .call(b_axis);
    
    chartGroup.append("g")
        .call(l_axis);

    // append data points into the chart
    var circleGroup = chartGroup.selectAll("circle")
        .data(rawdata)
        .enter()
        .append("circle")
        .attr("cx", d => xscale(d.poverty))
        .attr("cy", d => yscale(d.healthcare))
        .attr("r","10")
        .attr("class","stateCircle")
    
    chartGroup.selectAll(null)
        .data(rawdata)
        .enter()
        .append("text")
        .attr("x", d => xscale(d.poverty))
        .attr("y",d => yscale(d.healthcare))
        .attr("class", "stateText")
        .attr("alignment-baseline", "middle")
        .text(function(d){
            return d.abbr;
        })


    // create Tooltips into datapoints
    var tooltip = d3.tip()
    .attr("class","d3-tip")
    .offset([10,10])
    .html(function(d){
        return (`${d.state} <br>Poverty: ${d.poverty}% <br>Heathcare: ${d.healthcare}%`);
    })

    chartGroup.call(tooltip);

    circleGroup.on("mouseover", function(d){
        tooltip.show(d, this);
    }).on("mouseout",function(d){
        tooltip.hide(d);
    });


    // more readability with more formats
    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("font-weight","bold")
    .text("In Poverty (%)");


    chartGroup.append("text")
    .attr("transform", `translate(-35, ${chartHeight / 2})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("writing-mode", "vertical-lr")
    .attr("font-weight","bold")
    .text("Lacks Heathcare (%)");

}).catch(function(error){
    console.log(error);
});