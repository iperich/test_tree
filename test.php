<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.11/angular.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.11/angular-sanitize.js"></script>
        <script src="app.js"></script>
    </head>
    <body>
    <div ng-app="mainApp" ng-controller="mainController">
    <br><br>
    <a ng-show="!show_add_root" href="#" ng-click="show_add_root=true">New Root Node</a>
    <span ng-show="show_add_root">Name: <input name="add_" ng-model="node_name" ng-keyup="$event.keyCode == 13 && add_node(tree.nodes);"><input type="button" ng-click="add_node(tree.nodes);" value="Add"/></span>
    
    <div dynamic="tree_view"></div>
    
</div>
    </body>
</html>