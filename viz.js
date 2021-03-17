// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 50, left: 60},
    width  = 1000 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class","xAxis")

svg.select(".xAxis")
    .call( g => g.append("text")
        .attr("x", 180)
        .attr("y", 37)
        .attr("fill","#4d4d4d")
        .style("font-size","18px")
        .style("font-weight","bold")
        .text("Area under cultivation (ha)"));

svg.append("g")
    .attr("class","yAxis")

svg.select(".yAxis")
    .call( g => g.append("text")
        .attr("x", 175)
        .attr("y", 0)
        .attr("fill","#4d4d4d")
        .style("font-size","18px")
        .style("font-weight","bold")
        .text("Yield in 2019 (hg/ha)"));

d3.select("svg")
    .append("g")
    .attr("class", "annotation-group")

d3.select("svg")
    .append("g")
    .attr("class", "annotation-zoomed-group")

var tooltip = d3.select("svg")
    .append("g")
    .attr("class", "tooltip")


// Tooltip creation
tooltip
    .append("rect")
    .attr("width", 285)
    .attr("height", 170)
    .attr("x", 10)
    .attr("y", -100)
    .style("stroke","black")
    .style("fill","white")
    .style("fill-opacity", 1)

tooltip
    .append("text")
    .attr("class", "tooltip-title")
    .text("Hello there")
    .attr("x", 20)
    .attr("y", -72)

tooltip
    .append("text")
    .attr("class", "tooltip-area")
    .text("Area")
    .attr("x", 20)
    .attr("y", -45)

tooltip
    .select(".tooltip-area")
    .append("tspan")
    .attr("x", 20)
    .attr("dy", 17)
    .text("Harvested (ha): ")

tooltip
    .append("text")
    .attr("class", "tooltip-yield")
    .text("Yield (hg/ha): ")
    .attr("x", 20)
    .attr("y", 0)

tooltip
    .append("text")
    .attr("class", "tooltip-production")
    .text("Production")
    .attr("x",  20)
    .attr("y", 30)

tooltip
    .select(".tooltip-production")
    .append("tspan")
    .attr("x", 20)
    .attr("dy", 17)
    .text("(tonnes):")
    
tooltip
    .append("text")
    .attr("class", "tooltip-area-value")
    .attr("x", 130)
    .attr("y", -28)
    .text("103,452,634")
    
tooltip
    .append("text")
    .attr("class", "tooltip-yield-value")
    .attr("x", 130)
    .attr("y", 7)
    .text("103,452,634")
    
tooltip
    .append("text")
    .attr("class", "tooltip-production-value")
    .attr("x", 130)
    .attr("y", 47)
    .text("103,452,634")



var textContent = {
    0: "<h1>Crops and their Yields</h1><div class='desc'> Not all crops are made equally - in this visualisation we learn about how the yields surrounding different crops dictate the amount of land under cultivation to meet the crop's demand.<br><br>To clarify, yield refers to the <b>amount of the crop produced per unit area of harvested land</b>. As such, higher yielding crops require less land to meet the same demands, thus governing the distribution of our agricultural lands.<br><br>A prime example of this is sugar cane which has the highest production amounts, while requiring less than a tenth of the land in comparison the next three highest production crops.<br><br>Another factor which determines how much land is cultivated is the global demand for the crop. That's why staples like wheat, rice, maize see much higher areas under cultivation when compared to other crops having similar yield levels.<br><br> In our chart we see how the crops differed in their yields and cultivation areas in 2019. The circle's <b>size denotes the total production</b> for the crop.<br><br><b>Click to get a better view of the bottom left cluster</b>",
    1: "<h1>The Less Common</h1><div class='desc'>All the crops in this part of the chart contribute to a much smaller part of global production. In fact, these 150+ crops together, only just manage to beat out the production total of the top 4 production crops.<br><br><b>Click to return to the original visualisation</b><br><br>",
}

d3.select(".header").html(textContent[0])

//Read the data
d3.csv("crop_data.csv", 

function(data){
    return {
        crop: data.crop,
        area: +data.area.replaceAll(",",""),
        production: +data.production.replaceAll(",",""),
        yield: +data.yield.replaceAll(",","")
    }
},
drawViz)
    
function drawViz(dataset, xUpperBound = null, yUpperBound = null) {

    if(!xUpperBound) var xUpperBound = d3.max(dataset, d=> d.area)
    if(!yUpperBound) var yUpperBound = d3.max(dataset, d=> d.yield)

  // Add X axis
    var x = d3.scaleLinear()
        .domain([0, xUpperBound])
        .range([ 0, width ])
        .nice();

    d3.select(".xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .tickFormat(d3.format(".2s")));

  // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, yUpperBound])
        .range([ height, 0])
        .nice();

    svg.select(".yAxis")
        .transition()
        .duration(1000)
        .attr("class","yAxis")
        .call(d3.axisLeft(y))

    
    var radiusScale = d3.scaleLinear()
        // Use only the current visible data for radius scale
        .domain(d3.extent(dataset.filter(d => (d.yield <= yUpperBound) && (d.area <= xUpperBound)), d => d.production))
        .range([5,40])

  // Add dots
    var circles = svg
        .selectAll("circle")
        .data(dataset, d=> d.crop)

    circles.enter()
        .append("circle")
        .merge(circles)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(d.area); } )
        .attr("cy", function (d) { return y(d.yield); } )
        .attr("r", d => radiusScale(d.production) )
        .style("fill", "#F2DDA4")
        .style("stroke", "#EE964B")
        .style("stroke-width", 2)
        .style("fill-opacity", 0.70)
        .style("stroke-opacity", 0.60)

    d3.selectAll("circle")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    function moveTooltip(current, mouseX, mouseY){
        var translateX = 0, translateY = 0;

        if(current.data()[0].area > xUpperBound / 2)
        {translateX = mouseX - 170; }
        else
        { translateX = mouseX + 100; }

        if(current.data()[0].yield > yUpperBound / 2)
        {translateY = mouseY + 100; }
        else
        { translateY = mouseY  - 50; }

        d3.select(".tooltip")
            .attr("transform", `translate(${translateX}, ${translateY})`)  
    }

    function mouseover(){
        d3.select(".tooltip").transition().style("display", "block")

        var [mouseX, mouseY] = d3.mouse(this)
        var currentCircle = d3.select(this)

        moveTooltip(currentCircle, mouseX, mouseY)
        
        // highlight current circle
        currentCircle.style("stroke","#222")

        d3.selectAll(".tooltip text.tooltip-title").text(currentCircle.data()[0]["crop"])
        d3.selectAll(".tooltip text.tooltip-area-value").text(currentCircle.data()[0]["area"].toLocaleString())
        d3.selectAll(".tooltip text.tooltip-production-value").text(currentCircle.data()[0]["production"].toLocaleString())
        d3.selectAll(".tooltip text.tooltip-yield-value").text(currentCircle.data()[0]["yield"].toLocaleString())
    }

    function mousemove(){
        var [mouseX, mouseY] = d3.mouse(this)
        var currentCircle = d3.select(this)

        moveTooltip(currentCircle, mouseX, mouseY)
    }

    function mouseleave(){
        var currentCircle = d3.select(this)

        // Remove highlight
        currentCircle.style("stroke","#EE964B")
        d3.select(".tooltip").style("display", "none")
    }

    d3.select("body")
        .on("click", function(d){
            
            var check = (d3.select(".annot-large").style("opacity") == 1)

            if(check){
                var xUpperBound = 40000000;
                var yUpperBound = 400000;

                d3.select(".header").html(textContent[1])
                d3.select(".infoTable").transition().duration(1000).style("opacity", 1)
                d3.selectAll(".annot-large").transition().duration(1000).style("opacity", 0)
                d3.selectAll(".annotation-zoomed-group").transition().duration(1000).style("opacity", 1)

                zoomedFlag = 1;
                drawViz(dataset, xUpperBound, yUpperBound)
            }

            else{
                d3.select(".header").html(textContent[0])
                d3.select(".infoTable").style("opacity", 0)
                d3.selectAll(".annot-large").transition().duration(1000).style("opacity", 1)
                d3.selectAll(".annotation-zoomed-group").style("opacity", 0)

                zoomedFlag = 0;
                drawViz(dataset)
            }
        })

        // Annotations for circles
        const type = d3.annotationLabel

        const annotations = [
        {
            note: {label: "Maize"},
            data: { area: 197204250, yield: 58238 },
            className: "annot-large",
            dy: 0.5
        },
        {
            note: {label: "Rice"},
            data: { area: 162055938, yield: 46618 },
            className: "annot-large",
            dy: -1
        },
        {
            note: {label: "Wheat"},
            data: { area: 215901958, yield: 35468 },
            className: "annot-large",
            dy: -1
        },
        {
            note: {label: "Soybeans"},
            data: { area: 120501628, yield: 27690 },
            className: "annot-large",
            dy: -1
        },
        {
            note: {label: "Sugar cane"},
            data: { area: 26777041, yield: 727978 },
            className: "annot-large",
            dy: -1
        },
        {
            note: {label: "Sugar beet"},
            data: { area: 4609434, yield: 625191 },
            className: "annot-large",
            dx: 50,
            dy: 0
        },
        {
            note: {label: "Mushrooms and Truffles"},
            data: { area: 104342, yield: 1140327 },
            className: "annot-large",
            dx: 60,
            dy: 0
        },
        ]

        const makeAnnotations = d3.annotation()
            .editMode(false)
            .notePadding(15)
            .type(type)
            .disable(["connector"])
            .accessors({
                x: d => x(d.area) + margin.left,
                y: d => y(d.yield) + margin.top
            })
            .accessorsInverse({
                date: d =>  x.invert(d.x),
                close: d => y.invert(d.y)
            })
            .annotations(annotations)

            d3.select(".annotation-group")
            .call(makeAnnotations)

        const typeZoomed = d3.annotationLabel

        const annotationsZoomed = [
        {
            note: { label: "Cotton seed"},
            data: { area: 38640608, yield: 25374 },
            dx: 0,
            dy: -1,
        },
        {
            note: { label: "Oil palm fruit"},
            data: { area: 28312612, yield: 150058 },
            dx: 0,
            dy: -1,
        },
        {
            note: { label: "Cucumbers and gherkins"},
            data: { area: 5001402, yield: 393497 },
            dx: 0,
            dy: 0,
        },
        {
            note: { label: "Tomatoes"},
            data: { area: 5030545, yield: 359337 },
            dx: 0,
            dy: 6,
        },
        {
            note: { label: "Potatoes"},
            data: { area: 15340986, yield: 213619 },
            dx: 0,
            dy: 0,
        },
        {
            note: { label: "Green Coffee"},
            data: { area: 11120498, yield: 9024 },
            dx:  0,
            dy: -70,
        },
        {
            note: { label: "Tobacco"},
            data: { area: 3619118, yield: 18473 },
            dx:  50,
            dy: -40,
        },
        {
            note: { label: "Tobacco"},
            data: { area: 6017384, yield: 179925 },
            dx:  0,
            dy: 0,
        },

        ]

        const makeAnnotationsZoomed = d3.annotation()
            .editMode(false)
            .notePadding(0)
            .type(typeZoomed)
            .accessors({
                x: d => x(d.area) + margin.left,
                y: d => y(d.yield) + margin.top
            })
            .accessorsInverse({
                date: d =>  x.invert(d.x),
                close: d => y.invert(d.y)
            })
            .annotations(annotationsZoomed)

            d3.select(".annotation-zoomed-group")
            .call(makeAnnotationsZoomed)

}