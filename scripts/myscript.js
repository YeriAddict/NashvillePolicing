// Dimensions
var margin = {top: 20, right: 50, bottom: 62, left: 70},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Add svg object to the page
var svg = d3.select("#plot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Handle the data
d3.csv("https://raw.githubusercontent.com/YeriAddict/NashvillePolicing/main/nashville_drivers_searched.csv", function(data) {

    // List of violation types
    var groups = d3.map(data, function(d){return(d.group)}).keys()
    
    // List of columns
    var dataset = [data.columns[1]]
    var stackedData = d3.stack()
        .keys(dataset)
        (data)

    // X axis (with the violation types)
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    var xAxis = d3.axisBottom(x)
        .tickFormat(function(d) {
            return d;
        });
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("font-size", "11px")
        .attr("transform", "rotate(-20)");

    // Y axis (count the number of stops)
    var y = d3.scaleLinear()
        .domain([0, 205000])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Count");

    // Initial color of the plots
    var color = d3.scaleOrdinal()
        .domain(dataset)
        .range(['#0047AB'])

    // Tooltip
    var tooltip = d3.select("#plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // Handle mouse actions when hovering on the bar plot
    var mouseover = function(d) {
        tooltip
            .html("Count: " + d.data.count + "<br>" + "Drivers searched: " + d.data.driver_searched + "%")
            .style("opacity", 1)
        d3.select(this).transition().attr('fill', "#0096C7");
    }
    var mousemove = function(d) {
        tooltip
        .style("left", (d3.mouse(this)[0]+100) + "px")
        .style("top", (d3.mouse(this)[1]+400) + "px")
    }
    var mouseleave = function(d) {
        tooltip
        .style("opacity", 0)
        d3.select(this).transition().attr('fill', "#0047AB");
    }

    // Show the bars
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x(d.data.group); })
            .attr("y", function(d) { return y(d.data.count); })
            .attr("height", function(d) { return y(d[0]) - y(d.data.count); })
            .attr("width",x.bandwidth())
            .attr("stroke", "blue")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
})