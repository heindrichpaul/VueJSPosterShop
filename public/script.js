var PRICE = 9.99;
var LOADNUM = 10;
var app = new Vue({
    el: "#app",
    data: {
        price: PRICE,
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: "anime",
        search: "",
        loading: false
    },
    computed: {
        noMoreItems: function() {
            return (this.items.length === this.results.length && this.results.length > 0);
        }
    },
    methods: {
        appendItems: function() {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOADNUM);
                this.items = this.items.concat(append)
            }
        },
        onSubmit: function() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http.get("/search/".concat(this.newSearch))
                    .then(function(res) {
                        this.results = res.data;
                        this.appendItems();
                        this.loading = false;
                    });
                this.search = this.newSearch;

            }
        },
        addItem: function(index) {
            var item = this.items[index];
            this.total += PRICE;
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].quantity++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    quantity: 1,
                    price: PRICE,
                    title: item.title
                })
            }
        },
        inc: function(item) {
            item.quantity++;
            this.total += PRICE;
        },
        dec: function(item) {
            item.quantity--;
            this.total -= PRICE;
            if (item.quantity <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function() {
        this.onSubmit();

        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function() {
            vueInstance.appendItems();
        });
    }
});
