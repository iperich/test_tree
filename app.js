var mainApp = angular.module("mainApp", ['ngSanitize']);

//define directiva "dynamic" que permite html sin filtrar dentro. 


mainApp.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(tree_view) {
        ele.html(tree_view);
        $compile(ele.contents())(scope);
      });
    }
  };
});

/*
 * Define directiva ng-confirm-click (pa arreglar después con un
 * alert bonito con css)
 *
 */

mainApp.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);



mainApp.controller("mainController", function($scope,$sce) {
   $scope.show_root=false;
   $scope.tree_view="";
   $scope.tree = {
        nodes:[
               {name:'nodo 1',
               value:'hola 1',
               children:[]},
               {name:'nodo 2',
               value:'hola 2',
               children:[
                         {name:'nodo 2.1',
                         value:'hola 2.1',
                         children:[{name:'nodo 2.1.1',
                                    value:'hola 2.1.1',
                                    children:[]}
                                  ]}
                        ]},
               {name:'nodo 3',
               value:'hola 3',
               children:[
                        {name:'nodo 3.1',
                        value:'hola 2.1',
                        children:[]}
                        ]},
               {name:'nodo 4',
               value:'hola 4',
               children:[]}
               ]
         };

         
    /*
     *function add_node:  add nodes
     *inputs:   parent_node: parent node
     *          name: name of node to delete
     *          
     */
        
   $scope.add_node=function(parent_node,node_name) {
      parent_node.push({name:$scope.node_name,value:'test'});
      $scope.node_name="";
      $scope.show_add_root=false;
      $scope.treeDisplay($scope.tree.nodes,0)
   };
    
    /*
     *function del_node:  delete nodes
     *inputs:   parent_node: parent node
     *          name: name of node to delete
     *          
     */
   $scope.del_node=function(node_string){
      
      var indexes=node_string.split(".");
      
      var parent_string="$scope.tree.nodes";
      
      for (i = 0; i < indexes.length-1; i++) { 
         index=indexes[i];
         parent_string=parent_string+'['+index+'].children';
      }
      
      var parent=eval(parent_string);
      console.log(indexes.length-1);
      
      parent.splice(indexes[indexes.length-1],1);
      
      
      
      $scope.treeDisplay($scope.tree.nodes,0)
    }
    
    /*
    //funcion recursiva para recorrer el arbol completo
    */
    
    
    $scope.treeDisplay = function (input,depth,parent) {
        depth=depth || 0 ;
        parent=parent || "";
        if (depth==0) {
          $scope.tree_view="";
          var whereami="";
        }
        for (var i = 0, l = input.length; i < l; i++) {
            
            var current = input[i];
            var depth_view="";
            for(var j = 0; j < depth; j++){
                depth_view=depth_view+"--";
            }
            $scope.tree_view = $scope.tree_view + (depth_view+current.name+'<a href="#" ng-click="del_node(\''+parent+i+'\');" ng-confirm-click="Sure?">Delete</a> <br>');
            parentid = current.id == null ? '0' : current.id;
            current.index = i;
            if (current.children && current.children.length > 0) {
                $scope.treeDisplay(current.children,depth+1,parent+i+'.');
            };
        };
      console.log($scope.tree_view);
      $sce.trustAsHtml($scope.tree_view);
    };
    
    $scope.treeDisplay($scope.tree.nodes); 

});