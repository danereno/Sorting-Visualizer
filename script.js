"use strict";
const arraySizes = [8, 16, 32, 64, 128, 256, 512];
const sortDelays = [500, 200, 50, 10, 4, 4, 4];
var internalArray = [];
var delay = 0;
var elements;

var $ = function(id){ return document.getElementById(id); };
var sleep = function(milliseconds){ return new Promise(resolve => setTimeout(resolve, milliseconds)); }

var sortStatus = {
    inputs: ["sort", "stop", "random", "slider", "shuffle", "reverse"], 
    sorting: false,
    startSort: function(){
        for(var i = 0; i < this.inputs.length; i++){
            if(this.inputs[i] == "stop")
                $(this.inputs[i]).disabled = false;
            else
                $(this.inputs[i]).disabled = true;
        }
        this.sorting = true;
    },
    endSort: function(){
        for(var i = 0; i < this.inputs.length; i++){
            if(this.inputs[i] == "stop")
                $(this.inputs[i]).disabled = true;
            else
                $(this.inputs[i]).disabled = false;
        }
        this.sorting = false;
    }
};

async function swap(i, j, arr){
    var elem1 = elements.item(i);
    var elem2 = elements.item(j);

    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    var color1 = elem1.style.background;
    var color2 = elem2.style.background;

    elem1.classList.add("comparing");
    elem2.classList.add("comparing");

    await sleep(delay);

    temp = elem1.style.height;
    elem1.style.height = elem2.style.height;
    elem2.style.height = temp;

    elem1.style.background = color2;
    elem2.style.background = color1;

    elem1.classList.remove("comparing");
    elem2.classList.remove("comparing");
}

async function sortArray(){
    if(document.querySelector('input[name="sortSelection"]:checked') == null){
        alert("Select a sorting algorithm")
        return;
    }
    else{
        var selected = document.querySelector('input[name="sortSelection"]:checked').id;
        sortStatus.startSort();
    }

    switch(selected){
        case "bubble":
            await bubbleSort(internalArray);
            break;
        case "insertion":
            await insertionSort(internalArray);
            break;
        case "quick":
            await quickSort(internalArray, 0, internalArray.length-1);
            break;
        case "gnome":
            await gnomeSort(internalArray);
            break;
        case "odd-even":
            await oddEvenSort(internalArray);
            break;
        case "cocktail":
            await cocktailSort(internalArray);
            break;
        default:
            break;
    }

    if(sortStatus.sorting)
        verifySort(internalArray);
}

function stopSort(){
    sortStatus.endSort();
}

function fillArray(){
    internalArray = [];
    $("array").innerHTML = "";
    var sliderVal = Number($("slider").value);
    var arraySize = arraySizes[sliderVal];
    delay = sortDelays[sliderVal];
    var minVal = 10;
    var maxVal = $("array").clientHeight;
    var spectrum = createSpectrum(arraySize);

    for(var i = 0; i < arraySize; i++){
        internalArray[i] = Math.floor(Math.random() * (maxVal - minVal) ) + minVal;
    }
    internalArray.sort((a, b) => a - b);

    for(var i = 0; i < arraySize; i++){
        var element = document.createElement("div");
        element.classList.add("arrayElement");

        element.style.height = internalArray[i] + "px";
        element.style.background = spectrum[i];
        $("array").appendChild(element);
    }
    elements = $("array").children;
    shuffleArray();
}

function shuffleArray(){
    for(var i = internalArray.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * i);
        
        var temp = internalArray[i];
        internalArray[i] = internalArray[j];
        internalArray[j] = temp;

        temp = elements.item(i).style.background;
        elements.item(i).style.background = elements.item(j).style.background;
        elements.item(j).style.background = temp;
    }
    for(var i = 0; i < internalArray.length; i++){
        elements.item(i).style.height = internalArray[i] + "px";
    }
}

function reverseArray(){
    var start = 0;
    var end = internalArray.length-1;
    while(start < end){
        var temp = internalArray[start];
        internalArray[start] = internalArray[end];
        internalArray[end] = temp;

        temp = elements.item(start).style.background;
        elements.item(start).style.background = elements.item(end).style.background;
        elements.item(end).style.background = temp;

        start++;
        end--;
    }
    for(var i = 0; i < internalArray.length; i++){
        elements.item(i).style.height = internalArray[i] + "px";
    }
}

//https://github.com/d3/d3-scale-chromatic
function createSpectrum(n){
    var colorScale = d3.scaleSequential()
        .domain([0, n])
        .interpolator(d3.interpolateRainbow);

    var spectrum = [];
    for(var i = 0; i < n; i++){
        spectrum[i] = colorScale(i);
    }
    return spectrum;
}

window.onload = function(){
    fillArray();
    $("sort").addEventListener("click", sortArray);
    $("stop").addEventListener("click", stopSort);
    $("random").addEventListener("click", fillArray);
    $("shuffle").addEventListener("click", shuffleArray);
    $("reverse").addEventListener("click", reverseArray);
}