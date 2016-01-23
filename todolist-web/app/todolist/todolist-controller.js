function TodoListController($scope, TodoListService) {
    console.log('TodoListController');

    function init(tasks) {
        $scope.tasks = tasks;
        $scope.taskLabel = null;

    }

    function refresh() {
        return TodoListService.query().then(init);
    }

    $scope.createTask = (label) => TodoListService.create(label).then(refresh);
    $scope.completeTask = (task) => TodoListService.complete(task.id).then(refresh);
    $scope.deleteTask = (task) => TodoListService.delete(task.id).then(refresh);
    $scope.completeAll = () => TodoListService.completeAll().then(refresh);

    refresh();
}

export default TodoListController;
