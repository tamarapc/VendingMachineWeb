var moneyInserted = 0;

$(document).ready(function(){

    
    loadMoney();
    
    
    $('#dollar').click(function(){
        moneyInserted += 1;
        loadMoney(moneyInserted.toFixed(2));
    });
    
    $('#quarter').click(function(){
        moneyInserted += 0.25;
        loadMoney(moneyInserted.toFixed(2))
    });
    
    $('#dime').click(function(){
        moneyInserted += 0.10;
        loadMoney(moneyInserted.toFixed(2))
    });
    
    $('#nickel').click(function(){
        moneyInserted += 0.05;
        loadMoney(moneyInserted.toFixed(2))
    });
    
        loadItems();
    
});



function loadItems(){
    clearItems();
    var items = $('#items');
    
    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function (data, status){
            $.each(data, function(index, item){
                var name = item.name;
                var price = item.price;
                var qty = item.quantity;
                var id = item.id;
                index += 1;
                
                var button = '<button class="select-btn" onclick="loadMessages('+ id +')" type="button" style="width: 33%; border-radius: 25px;">';
                    button += '<p>'+ name + '</p>';
                    button += '<p>$' + price + '</p>';
                    button += '<p>' + qty + '</p></button>';
                items.append(button);
                $('#displayMessages').empty();       
            });
            
            
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service.  Please try again later.'));
        }
    });
}

function clearItems(){
    $('#items').empty();
}

function loadMoney(){
    clearMoney();
    
//    var table = '<table><tr><button type="button" onclick="loadMoney('moneyInserted += 1')"';
//        table = 'id="dollar" style="width: 45%; border-radius: 25px;">Dollar</button>';
//        table = '<button type="button" onclick="loadMoney('moneyInserted += 0.25')"' ;
//        table = 'id="quarter" style="width: 45%; border-radius: 25px;">Quarter</button>'
//        table = '</tr><tr><button type="button"  onclick="loadMoney('moneyInserted += 0.10')"'; 
//        table = 'id="dime" style="width: 45%; border-radius: 25px;">Dime</button>';
//        table = '<button type="button" onclick="loadMoney('moneyInserted += 0.05')"';
//        table = ' id="nickel" style="width: 45%; border-radius: 25px;">Nickel</button></tr></table>';
    
    $('#moneyInserted').append('<p>$ ' + moneyInserted.toFixed(2) + '</p>');
    
}

function clearMoney(){
    $('#moneyInserted').empty();
}

function clearMessages(){
    $('#displayMessages').empty();
}

function loadMessages(id){
    clearMessages();
    var messages = $('#displayMessages');
    var item = '<p> Item: ' + id + '</p>';
    
    var button = '<button type="button" id="makePurchase" onclick="makePurchase('+ id + ', ' + moneyInserted + ')" style="width: 90%; border-radius: 25px;">Make Purchase</button>'
                    
    
    messages.append(item, button);


    
}



function makePurchase(id){
    clearMessages();
    var messages = $('#displayMessages');
    
        $.ajax({
        type: 'POST',
            url: 'http://tsg-vending.herokuapp.com/money/'+ moneyInserted.toFixed(2) + '/item/' + id,
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function(data, status) {
                $('#errorMessages').empty();
                var item = '<p> Item: ' + id + '</p>';
                messages.append(item);
                returnChange(data, status);
                moneyInserted = 0;
                
            },
            error: function(request, status, error) {
            messages.append(request.responseJSON.message);
        
            }
    });
}

function returnChange(data, status){
    clearChange();
    var change = $('#change');
    var quarters = data.quarters;
    var dimes = data.dimes;
    var nickels = data.nickels;
    var pennies = data.pennies;
    var toReturn = '<p>Quarters: '+ quarters + '</p>';
        toReturn += '<p>Dimes: '+ dimes + '</p>';
        toReturn += '<p>Nickels: '+ nickels + '</p>';
        toReturn += '<p>Pennies: '+ pennies + '</p>';
    change.append(toReturn);
    moneyInserted= 0;
    loadMoney(moneyInserted);
    
    
}

function clearChange(){
    $('#change').empty();
}