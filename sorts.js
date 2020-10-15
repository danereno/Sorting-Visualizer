async function verifySort(A){
    for(i = 0; i < A.length; i++){
        var elem = elements.item(i);
        elem.classList.add('verifying');
        if(A[i] > A[i+1]){
            console.log('sort failed');
            sortStatus.endSort();
            return;
        }
        await sleep(delay);
        elem.classList.remove('verifying');
    }
    sortStatus.endSort();
}

async function bubbleSort(A){
    let len = A.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (A[j] > A[j + 1]) {
                if(sortStatus.sorting) await swap(j, j+1, A);
                else return;
            }
        }
    }
}

async function insertionSort(A){
    var n = A.length;
    for(i = 1; i < n; i++){
        for(j = i; j > 0 && A[j-1] > A[j]; j--){
            if(sortStatus.sorting === true) await swap(j, j-1, A);
            else return;
        }
    }
}

async function partition(A, lo, hi){
    var pivot = A[hi];
    var i = lo;
    for(j = lo; j < hi; j++){
        if(A[j] < pivot){
            if(sortStatus.sorting) await swap(i, j, A);
            else return;
            i++;
        }
    }
    if(sortStatus.sorting) await swap(i, hi, A);
    else return;
    return i;
}

async function quickSort(A, lo, hi){
    if(lo < hi){
        var p = await partition(A, lo, hi);
        await quickSort(A, lo, p-1);
        await quickSort(A, p+1, hi)
    }
}

async function gnomeSort(A){
    var pos = 0;
    var len = A.length;
    while(pos < len){
        if(pos == 0 || A[pos] >= A[pos-1]){
            pos++;
        }
        else{
            if(sortStatus.sorting) await swap(pos, pos-1, A);
            else return;
            pos--;
        }
    }
}

async function oddEvenSort(A){
    var sorted = false;
    var len = A.length;
    while(!sorted){
        sorted = true;
        for(i = 1; i < len-1; i += 2){
            if(A[i] > A[i+1]){
                if(sortStatus.sorting) await swap(i, i+1, A);
                else return;
                sorted = false;
            }
        }
        for(i = 0; i < len-1; i += 2){
            if(A[i] > A[i+1]){
                if(sortStatus.sorting) await swap(i, i+1, A);
                else return;
                sorted = false;
            }
        }
    }
}

async function cocktailSort(A){
    var len = A.length;
    do{
        var swapped = false;
        for(i = 0; i <= len-2; i++){
            if(A[i] > A[i+1]){
                if(sortStatus.sorting) await swap(i, i+1, A);
                else return;
                swapped = true;
            }
        }
        if(!swapped)
            break;
        swapped = false;
        for(i = len-2; i >= 0; i--){
            if(A[i] > A[i+1]){
                if(sortStatus.sorting) await swap(i, i+1, A);
                else return;
                swapped = true;
            }
        }
    }while(swapped);
}