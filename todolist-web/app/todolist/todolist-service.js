class TodoListService {

    constructor($http) {
        this.$http = $http;
    }

    query() {
        return this.$http.get('/api/todo')
            .then((response) => response.data);
    }

    create(label) {
        return this.$http.post('/api/todo', { name: label })
            .then((response) => response.data);
    }

    complete(id) {
        return this.$http.post(`/api/todo/${id}/complete`, {})
            .then((response) => response.data);
    }

    completeAll() {
        return this.$http.post('/api/todo/complete', {})
            .then((response) => response.data);
    }

    delete(id) {
        return this.$http.delete(`/api/todo/${id}`)
            .then((response) => response.data);
    }

}

export default TodoListService;
