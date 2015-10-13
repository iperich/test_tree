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
    <a ng-show="!show_add_" href="#" ng-click="show_add_=true;focus_=true">New Root Node</a>
    <span ng-show="show_add_" >Name: <input focus-me="focus_" ng-blur="show_add_=false" name="add_" ng-model="add_" ng-keyup="($event.keyCode == 13) && (add_node(''));"><input type="button" ng-click="add_node('');" value="Add"/></span>
    
    <div dynamic="tree_view"></div>
    
</div>
    </body>
</html>