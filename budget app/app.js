var budgetController = (function () {   // module1  IIFE   // data privacy

    var Expense = function (id, description, value) {  // function constructor
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        }
        else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }


    var Income = function (id, description, value) {  // function constructor
        this.id = id;
        this.description = description;
        this.value = value;


    }
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach((cur) => {
            sum = sum + cur.value;

        });
        data.totals[type] = sum
    }

    var data = {     // object
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    return {     // return object   (having public functions)
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }
            else {
                ID = 0;
            }
            if (type == 'exp') {
                newItem = new Expense(ID, des, val)
            }
            else if (type == 'inc') {
                newItem = new Income(ID, des, val)
            }
            data.allItems[type].push(newItem)
            return newItem;

        },

        deleteItem: function (type, id) {
            console.log(type, id)

            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            var index = ids.indexOf(id);   //*********** returrns -1 if id not found
            if (index !== -1) {
                data.allItems[type].splice(index, 1);  //**************  splice(starting index, no. of elements)
            }
        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc')

            data.budget = data.totals.inc - data.totals.exp

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage()
            })
            return allPerc;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            }
        },

        testing: function () {
            console.log(data)
        }
    }

})();

//***********************************************
var UIcontroller = (function () {  // module2 iife

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }
    var formatNumber = function (num, type) {
        num = Math.abs(num);
        num = num.toFixed(2);

        var numSplit = num.split('.');
        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);  // substr(index from where to start, length) 
        }
        dec = numSplit[1];
        type === 'exp' ? sign = '-' : sign = '+'
        return sign + ' ' + int + '.' + dec;

    };
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomesContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentge%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert html into Dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml) //********** */ added as last child 
        },

        deleteListItem: function (selectorId) {
            var el = document.getElementById(selectorId);   // *******we cant delete a child directly in js, first select parent
            el.parentNode.removeChild(el)    // then remove child

        },
        clearField: function () {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)   // returns list
            // convert list to array
            var fieldsArray = Array.prototype.slice.call(fields)
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            })
            document.querySelector(DOMstrings.inputDescription).focus()
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, obj.budget > 0 ? 'inc' : 'exp');
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';

                }
            })
        },
        displayMonth: function () {
            var now = new Date();
            var year = now.getFullYear();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            var month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year
        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus')
            })
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')

        },


        getDOMstrings: function () {
            return DOMstrings
        }
    }


})()


//**********************GLOBAL APP CONTROLLER************************************

var controller = (function (budgetCtrl, UICtrl) {   //module3   can also take parameters for interaction



    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings()
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {    // determing enter key press   .which is used for old browsers
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    };


    var updateBudget = function () {
        // cal budget
        budgetCtrl.calculateBudget()


        //ret budget
        var budget = budgetCtrl.getBudget();

        //dispay budget on ui
        UICtrl.displayBudget(budget);
        console.log(budget)
    }

    var updatePercentages = function () {
        //1. claculate %
        budgetCtrl.calculatePercentages();

        //2. read % from budget controller
        var percentages = budgetCtrl.getPercentages()

        //3. update ui with new %ages
        UICtrl.displayPercentages(percentages)
    }


    var ctrlAddItem = function () {
        var input, newItem;
        //1. get input data
        input = UICtrl.getInput();
        console.log(input)

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. add item to budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value)

            //3. add new item to UI

            UICtrl.addListItem(newItem, input.type)

            //4. clear fields
            UICtrl.clearField()

            //5. calculate budget and update it
            updateBudget();

            //6.  calculate and update percentages
            updatePercentages()
        }

    }

    var ctrlDeleteItem = function (event) {
        var itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            spliiID = itemID.split("-");
            type = spliiID[0];
            ID = parseInt(spliiID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID)

            // 2. delete item from ui
            UICtrl.deleteListItem(itemID)

            // 3. update and show budget
            updateBudget()

            // 4. update percentages
            updatePercentages();
        }
    }

    return {
        init: function () {
            console.log("APP has started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({ budget: 0, totalInc: 0, totalExp: 0, percentage: -1 });

            setupEventListeners()
        }
    }



})(budgetController, UIcontroller)

controller.init()  // without it nothing is going to tke place