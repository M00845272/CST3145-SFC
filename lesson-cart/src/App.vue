<template>
    <div id="app">
        <header>
            <div class="navbar navbar-expand-lg bg-dark navbar-dark app-header">
                <div class="navbar-header">
                    <h1>{{ sitename }}</h1>
                </div>
                <div class="nav navbar-nav navbar-right cart">
                    <button type="button" class="btn btn-primary btn-lg" v-if="canCheckout()" v-on:click="showCheckout">
                        <span class="glyphicon glyphicon-shopping-cart">{{ cartItemCount }}</span> Checkout
                    </button>
                    <button type="button" disabled="true" class="btn btn-primary btn-lg" v-else="canCheckout()"
                        v-on:click="showCheckout">
                        <span class="glyphicon glyphicon-shopping-cart">{{ cartItemCount }}</span> Checkout
                    </button>
                </div>
            </div>
        </header>
        <main>
            <component :is="currentView" :lessons="lessons" :cart="cart" :getImageSrc="getImageSrc" :URL="URL"
                @add-item-to-cart="addItemToCart" @load-lessons="loadLessons"
                @remove-from-cart="removeFromCart" @order-success="orderSuccess"></component>
        </main>
    </div>
</template>
<script>
import LessonList from "./components/LessonList.vue";
import Checkout from "./components/Checkout.vue";
export default {
    name: "App",
    data() {
        return {
            sitename: "LessonCart",
            cart: [],
            search: "",
            sortOption: "SUBJECT",
            sortOrder: "ASC",
            lessons: {},
            cart: [],
            URL: 'https://www.lessoncart.uk',
            currentView: LessonList,
            showLesson: true
        }
    },
    components: { LessonList, Checkout },
    methods: {
        loadLessons(search,sortOption,sortOrder) {
            let webstore = this;
            webstore.search = search;
            webstore.sortOption = sortOption;
            webstore.sortOrder = sortOrder;

            if (webstore.search == undefined || webstore.search == null || webstore.search == '') {
                webstore.getLessons();
            } else {
                webstore.searchLessons();
            }
        },
        getLessons() {
            let webstore = this;
            var sortField = webstore.sortOption;
            var selectedSortOrder = webstore.sortOrder;
            let lessonsURL = webstore.URL + "/lessons/20/" + sortField.toLowerCase() + "/" + selectedSortOrder.toLowerCase()
            fetch(lessonsURL).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            console.log(json);
                            webstore.lessons = json;
                        }
                    )
                }
            );
        },
        searchLessons() {
            let webstore = this;
            webstore.lessons = [];
            var sortField = webstore.sortOption;
            var selectedSortOrder = webstore.sortOrder;
            let serachKeyword = webstore.search || '*';
            let searchURL = webstore.URL + "/lessons/search/" + serachKeyword + "/20/" + sortField.toLowerCase() + "/" + selectedSortOrder.toLowerCase()
            fetch(searchURL).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            var data = json;
                            if (data.length > 0) {
                                let lessonsArray = data.slice(0);
                                webstore.lessons = lessonsArray;
                            }
                        }
                    );
                })
        },
        getImageSrc(imagePath) {
            return this.URL + "/lesson/images/" + imagePath;
        },
        addItemToCart(aLesson) {
            this.cart.push(aLesson.id);
        },
        removeFromCart(aLesson) {
            var index = this.cart.indexOf(aLesson.id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
            if (this.cart.length < 1) {
                this.showLesson = true;
                this.currentView = LessonList
            }
            return;
        },
        showCheckout() {
            this.showLesson = this.showLesson ? false : true;
            this.currentView = this.showLesson ? LessonList : Checkout;
        },
        canCheckout() {
            return this.cart.length > 0;
        },
        orderSuccess() {
            this.showLesson = true;
            this.currentView = LessonList;
            this.cart = [];
            this.searchLessons();
        },
    },
    computed: {
        cartItemCount() {
            return this.cart.length || '';
        }
    },
    created: function () {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-worker.js");
        }
        let webstore = this;
        fetch(this.URL + "/lessons/20/subject/asc").then(
            function (response) {
                response.json().then(
                    function (json) {
                        console.log(json);
                        webstore.lessons = json;
                    }
                )
            }
        );
    }
};
</script>