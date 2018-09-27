//run the jquery function once the page loaded
$(document).ready(function(){
    //global variable the holds the fetched data from json file
    var products;
    // tracks the size of products that we will show - default value is 10
    var listSize = 10;

    /////  Helper Methods ////////

    /// load the products to the HTML DOM
    // using this function we will update the current UI
    // products: an array of products
    // isSorted: a flag that checks if we use this function for sorting 
    // size = number of products to show - default is listSize(10)
    function loadProductsUI(products, isSorted, size = listSize) {
        // reset the listSize once we update the UI to keep track of last changes
        listSize = size;

        // if isSorted flag is on sort the passing array of product
        if (isSorted){
            products.sort(sort_by('price', false, parseInt));
        }

        //using jQuery build the html tags for each product and update the UI
        var item = '<div class="container" >';
            //for (var i in products){ 
            for(var i=0;i<size;i++){
                //for (var columns in row)
                if ((parseInt(i)) % 3 == 0 && (parseInt(i) >= 2)){
                    item += '</div>';
                }
                if ((parseInt(i)+1) % 3 == 0 || i == 0){
                    item += '<div class="row">';
                }
                item += '<div class="col-sm-4">';
                item += '<div class="panel panel-primary">';
                item += '<div class="panel-heading">'+products[i].title+'</div>';
                item += '<div class="panel-body"><img src="'+products[i].image+ '" class="img-responsive" style="width:80%" alt="Image"></div>';
                item += '<div class="panel-body">'+products[i].Color+'</div>';
                item += '<div class="panel-footer">Retail Price = '+products[i].retail_price+'</div>';
                item += '<div class="panel-footer">Price = '+products[i].price+'</div>';
                item += '</div>';
                item += '</div>';
            };
            item += '</div>';
        $('#productList').html(item);
    }
    // Load the JSON file from server
    function loadProductsFromJson(){
        //create a http request
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        //check if everything is ok 
        
        if (this.readyState == 4 && this.status == 200) {
            products = JSON.parse(this.responseText);
            loadProductsUI(products,false,10)
        } 
    };
    
    xmlhttp.open("GET", "../assets/data.json", true);
    xmlhttp.send();
    }

    //sort helper 
    var sort_by = function(field, reverse, primer){

        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};
     
        reverse = !reverse ? 1 : -1;
     
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
          } 
     }

    // Button controllers 
    $('#sort').click(function() {
        loadProductsUI(products,true);
    });

    //Add 10 more products to show
    $('#next').click(function() {
        loadProductsUI(products,false, listSize + 20);
        if (listSize > 10) {
            $('#pre').prop("disabled",false);
        }
    });

    //10 less products to show
    $('#pre').click(function() {
        var s = listSize - 15
        if (s > 0){
            loadProductsUI(products,false, listSize - 15);
        }
        if (listSize > 10) {
            $('#pre').prop("disabled",false);
        }
    });

    $('#colorOption').on('change', function() {

        var color = $(this).val();

        var productsOfColor =  products.filter(function(product) {
            return product.Color == color;
        });
        console.log(productsOfColor)
        loadProductsUI(productsOfColor,false)
    });

     /////  Method that will call when html page loads ////////  
     // load the data from server
     loadProductsFromJson(); 
});