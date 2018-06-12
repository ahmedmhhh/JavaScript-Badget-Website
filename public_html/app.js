var budgetController = (function (){
    var Expense = function (id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var Income = function (id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal =function (type){
        var sum =0;
        data.allItems[type].forEach(function (cur){
            sum = sum + cur.value;
        });
        data.totals[type]=sum ;
    };
    var data = {
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    return {
      addItem:function (type,des,val){
          var newItem,ID;
          
          if(data.allItems[type].length>0){
          ID = data.allItems[type][data.allItems[type].length-1].id+1;
          }else{
              ID = 0;
          }
          if(type==='exp'){
              newItem = new Expense(ID,des,val);
          }else if(type==='inc'){
              newItem = new Income(ID,des,val);
          }
          data.allItems[type].push(newItem);
          return newItem;
      },
        calculateBudget:function (){
          calculateTotal('exp');
          calculateTotal('inc');
      
          data.budget = data.totals.inc - data.totals.exp;
          if(data.totals.inc>0){
          data.percentage = Math.round((data.totals.exp/data.totals.inc)*100); 
          }else{
              data.percentage = -1;
          }
          
        },
        getBudget :function (){
            return {
                budget:data.budget,
                totalInc :data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }  
        },
      testing:function (){
          console.log(data);
      }
    };
})();

var UIController = (function (){
    
    var DOMStrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list'
    };
    
    return {
        getinput:function (){
            return {
             type : document.querySelector(DOMStrings.inputType).value,
             description : document.querySelector(DOMStrings.inputDescription).value,
             value :parseFloat( document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function(obj,type){
            //create HTML string with placholder
            var html,newHTML,element;
            
            if(type==='inc'){
            element = DOMStrings.incomeContainer;    
            html= '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){   
            element = DOMStrings.expensesContainer;    
            html= '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
            } 
            //replace actual data
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%',obj.description);
            newHTML = newHTML.replace('%value%',obj.value);
            //insert the html
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
            
        },
        
      
        clearFields:function (){
          var fields,fArray;
          fields = document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
          fArray = Array.prototype.slice.call(fields);
          fArray.forEach(function (current,index,array){
              current.value = "";
          });
          fArray[0].focus();
        },
        
        displayBadget:function (){
            
        },
        
        getDOMStrings:function (){
            return DOMStrings;
        }
    }
})();

var Controller = (function (budgetCtrl,UI){
    
    var setupEventListeners = function (){
        
       
    document.querySelector(DOM.inputButton).addEventListener('click',Additem);
    
    document.addEventListener('keypress',function (event){
        if(event.keyCode===13||event.which===13){
            Additem();
        }
    });
    };
    
    var updateBudget = function (){
        
      //calculate
      budgetCtrl.calculateBudget();
      //return
      var budget = budgetCtrl.getBudget();  
      //display
      console.log(budget);
    };
    
    var DOM = UI.getDOMStrings();
    
    var Additem = function (){
       var input,newitems;
       //get input 
       input = UI.getinput();
       console.log(input);
       if(input.description!==""&&!isNaN(input.value)&&input.value>0){
       //add budget controller
       newitems = budgetController.addItem(input.type,input.description,input.value);
       //UI
       UI.addListItem(newitems,input.type);
       //create fields
       UI.clearFields();
       //calculate budget
        updateBudget();
       //display
       }
    };
    
    return {
        init:function (){
            console.log('Application has started');
            setupEventListeners();
        }
    };
   
})(budgetController,UIController);

Controller.init();