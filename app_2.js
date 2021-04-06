// plotyly needs arrays for x and y
// three steps: trace, layout, plotly.plot for each graph
// using same three keys for each graph  three arrays
// how are we going to get the data  look at json - how do we figure out what is in json
// lets read it in and do a console log to see what is in the json file

// d3.json("samples.json").then((data)=>{
//   console.log(data);
// })

//three arrays with 153 things stored at three keys
//names keys array will go in drop down
//samples key has severyal keys with data we need for charts
//how do we approach this problem
//need to create variables  --  can get bubble chart from plotly.com
//sample-values is the size array
//when the person makes a selection we want to run a filter
//when the code loads we need to load our charts so create a function that loads the charts when called in the code
//will load the first id in the list


//CHARTS
function loadCharts(id) {

  console.log(id) //see if it is choosing our intended id value from our variable id assignment below
  // now that we have the id we can build our charts
  // but it doesn't have data to refer to so we need to add the d3json to the function
  d3.json("samples.json").then((data) => {

    console.log(data);

    var selectedData = data.samples.filter(obj => obj.id == id) //as it loops through all these objects  / rows/ we just want the obj from the row the person selected
    console.log(selectedData); //see if we have isolated the data object we want to find
    //we only want the key:values for the data for the selected id and only the first 10

    var otuids_slice = selectedData[0].otu_ids.slice(0,10).map(x => `OTU ${x}`).reverse();
    var samplevalues_slice = selectedData[0].sample_values.slice(0,10).reverse();
    var otulabels_slice = selectedData[0].otu_labels.slice(0,10).reverse();

    console.log(otuids_slice);
    console.log(samplevalues_slice);
    console.log(otulabels_slice);

    var otuids = selectedData[0].otu_ids;
    var samplevalues = selectedData[0].sample_values;
    var otulabels = selectedData[0].otu_labels;

    console.log(otuids);
    console.log(samplevalues);
    console.log(otulabels);
    //let's check to see if this is three arrays of data
    //selectedData is not an object, it is an array that holds one thing why is it an array  - samples is an array and we did a filter on it so it returns an array, but it happens to only have one thing in it
    //we have to get it out of the array so we need to index into the array [0]
    //directions say top 10 data points - but do not need to sort - just take first ten


    //BUILD HORIZONTAL BAR CHART 
    //find what variables are appropriate for x, y and text  use example from plotyly
    //.slice(0,10)
    //.map for the labels OTU instead of just the number in the array numbers  the y is the number  do on otuids map

    // Create your trace.
    var tracebar = {
      x: samplevalues_slice,
      y: otuids_slice,
      type: "bar",
      orientation: 'h',
      text: otulabels_slice
    };

    // Create the data array for our plot
    var data = [tracebar];

    // Define the plot layout
    var layout = {
      title: "Microbial Species",
      xaxis: { title: "Amount" },
      yaxis: { title: "Type" }
    };

    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", data, layout);

    //BUILD BUBBLE CHART INSIDE FUNCTION 
    //us plotly for code for bubble chart
    //need three variable arrays
    //this is not just top ten so may want to do the slice on the plotylydata 
    var tracebubble = {
      x: otuids,
      y: samplevalues,
      mode: 'markers',
      marker: {
        color: otuids,
        size: samplevalues,
        text: otulabels
      }
    };

    var data = [tracebubble];

    var layout = {
      title: 'Marker Size and Color',
      showlegend: false,
      margin: {
        t: 30,
        l: 150
      }
    };

    Plotly.newPlot('bubble', data, layout);


    //BUILD DEMOGRAPHIC PANEL DATA 
    //where is data coming from? see big json file  metadata key it has the object data needed for the panel
    //loop through this object and print the key:value 
    //can do it as a table with rows and columns or simpler is just APPEND the 'h5' tag with the key and value
    //still have to filter the meta data
    

  });

}

function buildTable(id) {
  d3.json("samples.json").then((data) => {  
  var selectedMetaData = data.metadata.filter(obj => obj.id == id)[0]
  var panel = d3.select("#sample-metadata")
  panel.html("")
  Object.entries(selectedMetaData).forEach (([key,value]) => {
    panel.append("h6").text(`${key}: ${value}`);
  });
  
    })
    }
//DROPDOWN

// look at html  for ids for charts  and drop down  selDataset need d3 reference to drop down
//selDataset is a id use hashtag not period  period is for a class div
//we need to append the names key for our drop down  let's console log names to see if it is pulling the correct information
d3.json("samples.json").then((data) => {
  console.log(data);

  console.log(data.names); //need to loop through this array with a for each

  var dropdown = d3.select("#selDataset");

  data.names.forEach((dataobj) => { //this should loop through the names in the data set and for each value in the array it should store the data value

    dropdown.append("option").text(dataobj).property("value", dataobj); //calling this data as we loop through the array and appending to the drop down
  }) //you can see this added in the html with the <option></option> 
  //we want the information in the drop down to be associated with a value not just the exact text 
  //we can make it something else through the property we can assign the property of a value
  //our text(data) is a property of the html element we are appending on to so we need to add .property("value", data)

  var id = data.names[0];  //index into the array of names and choose the first one

  loadCharts(id)
  buildTable(id)
});

//what do we do next  - 940 is the first thing in the data that loads
//we need to think of what 'id' means in our function
//we need to assign values to our id variable  do the var id = data.names [0]
//we are doing all our charting inside this funtion of loadcharts hold space there for charts inside the function
//next, go to what will we do when someone chooses a different id number
//in html 'optionChanged' is assigned   if we have a function called optionChange in the html it is passing in the changed id 
//this gives us the selected value   - so create the function in app so it will execute
//we want a function that updates the charts when a new option is changed
//we can just call our function from above to load charts but this time load it with the new selected id 
function optionChanged(selectedID) {

  loadCharts(selectedID)
  buildTable(selectedID)

}

//loadCharts is outside the promise so it doesn't have any data to refer to we need to add the data source to the function.
//without a filter it is going to bring back all the data instead of just the things we need for the chart



//per Bill the directions do not mean we need to sort them for the highest ten; just take the first ten -- so don't do this step below
// //5. sort the data samples by the values high to low
//       var sortID = data.samples.sort((a,b)=>b.samplevalues - a.samplevalues);
//       console.log(sortID);
// //6. get the firest ten samples from the sorted data
//       sliceData = sortID.slice(0,10);
// //7.reverse the data per plotly requirements  - don't understand this
//       reverseData = sliceData.reverse()
