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

mainApp.directive('ngConfirmClick', function ($window) {
  var i = 0;
  return {
    restrict: 'A',
    priority:  1,
    compile: function (tElem, tAttrs) {
      var fn = '$$confirmClick' + i++,
          _ngClick = tAttrs.ngClick;
      tAttrs.ngClick = fn + '($event)';

      return function (scope, elem, attrs) {
        var confirmMsg = attrs.confirmClick || 'Are you sure?';

        scope[fn] = function (event) {
          if($window.confirm(confirmMsg)) {   //               <----- confirm 
            scope.$eval(_ngClick, {$event: event});
          }
        };
      };
    }
  };
});



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
                                    children:[]},
                                    {name:'nodo 2.1.2',
                                    value:'hola 2.1.2',
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
        
   $scope.add_node=function(node_string) {
      var indexes=node_string.split("_");
      
      var parent_string="$scope.tree.nodes";
      
      if (node_string!='') {
         for (i = 0; i < indexes.length; i++) { 
            index=indexes[i];
            parent_string=parent_string+'['+index+'].children';
         }
      }
      
      var parent=eval(parent_string);
      
      parent.push({name:eval('$scope.add_'+node_string),
                  value:'hola 1',
               children:[]
                  });
      eval('$scope.show_add_'+node_string+'=false');
      
      
      
      $scope.treeDisplay($scope.tree.nodes,0);
      
      //abrir nodos
      node_to_open="$scope.children_";
      for (i = 0; i < indexes.length; i++) { 
         index=indexes[i];
         node_to_open=node_to_open+index+'_';
         eval(node_to_open+'=true');
      }
      
      console.log(node_string+'-s'+parent_string);
      
   };
    
    /*
     *function del_node:  delete nodes
     *inputs:  nodestring_ node to delete in form "nodeIndex_subnodeIndex_sub-subnodeIndex etc"
     *          ej: del_node('2_1_0')
     */
   $scope.del_node=function(node_string){
      
      var indexes=node_string.split("_");
      
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
     *function edit_node:  change node name
     *inputs:   parent_node: parent node
     *          name: name of node to delete
     *          
     */
   $scope.edit_node=function(node_string){
      console.log("here");
      var indexes=node_string.split("_");
      
      var node_array_string="$scope.tree.nodes";
      
      for (i = 0; i < indexes.length-1; i++) { 
         index=indexes[i];
         node_array_string=node_array_string+'['+index+'].children';
      }
      
      var node=eval(node_array_string);
      
      var new_name=eval('$scope.edit_'+node_string);
      console.log('$scope.edit_'+node_string);
      node[indexes[indexes.length-1]].name=new_name;
      eval('$scope.show_edit_'+node_string+'=false');
      console.log()
      
      $scope.treeDisplay($scope.tree.nodes,0)
    }
    
    
    

    
    
    
    
    /*
    *funcion para dibujar el arbol
    *
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
            if (parent!="") {
               $scope.children_=true;
            }
            $scope.tree_view = $scope.tree_view + '<div style="padding-left:30px;" ng-show="children_'+parent+'">';
            
            // mostrar [+] y [-]
            
            if (current.children && current.children.length > 0) {
               $scope.tree_view = $scope.tree_view + '<a href="#" ng-show="children_'+parent+i+'_" ng-click="children_'+parent+i+'_=false">[-]</a>';
               $scope.tree_view = $scope.tree_view + '<a href="#" ng-show="!children_'+parent+i+'_" ng-click="children_'+parent+i+'_=true">[+]</a>';
            };
            
            // mostrar el nombre del nodo
            
            $scope.tree_view = $scope.tree_view + '<span ng-show="!show_edit_'+parent+i+'">'+current.name+'</span><span ng-show="show_edit_'+parent+i+'">';
                                
            //mostrar lo necesario para editar el nombre (input y button)                    
                                                
            $scope.tree_view = $scope.tree_view + '<input type="text" ng-model="edit_'+parent+i+'" name="edit_'+parent+i+'" ng-keyup="$event.keyCode == 13 && edit_node(\''+parent+i+'\')"><input type="button" ng-click="edit_node(\''+parent+i+'\')" value="Save"> </span>';
            
            //mostrar controles
            
            $scope.tree_view = $scope.tree_view + '<a href="#" ng-show="!show_edit_'+parent+i+'" ng-click="show_edit_'+parent+i+'=true">[Edit]</a><a href="#" ng-click="del_node(\''+parent+i+'\');" ng-confirm-click="Sure?">[Delete]</a><a href="#" ng-show="!show_add_'+parent+i+'" ng-click="show_add_'+parent+i+'=true");">[Add children]</a> <br>';
            
            $scope.tree_view = $scope.tree_view + '<span ng-show="show_add_'+parent+i+'"><input type="text" ng-model="add_'+parent+i+'" name="add_'+parent+i+'" ng-keyup="$event.keyCode == 13 && add_node(\''+parent+i+'\')"><input type="button" ng-click="add_node(\''+parent+i+'\')" value="Add"> </span>';
            
            parentid = current.id == null ? '0' : current.id;
            eval('$scope.edit_'+parent+i+'="'+current.name+'"');
            current.index = i;
            if (current.children && current.children.length > 0) {
                $scope.treeDisplay(current.children,depth+1,parent+i+'_');
            };
            $scope.tree_view = $scope.tree_view + "</div>";
        };
      console.log($scope.tree_view);
      $sce.trustAsHtml($scope.tree_view);
    };
    
    $scope.treeDisplay($scope.tree.nodes); 

});