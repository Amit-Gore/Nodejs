angular.module('crm_app',[])

.controller('mainController',function(){
    var vm = this;
    // define variables and objects on this
 // this lets them be available to our views

 // define a basic variable
 vm.message = 'Hey there! Come and see how good I look!';

 // define a list of items
 vm.computers = [
 { name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
 { name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
 ];
// information that comes from our form
 vm.computerData = {};

 vm.addComputer = function() {

 // add a computer to the list
 vm.computers.push({
 name: vm.computerData.name,
 color: vm.computerData.color,
 nerdness: vm.computerData.nerdness
 });

 // after our computer has been added, clear the form
 //vm.computerData = {};
 };    
    
});
     