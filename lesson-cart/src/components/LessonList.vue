<template>
    <div>
        <div class="lesson-list-title">
            Lesson Catalog
        </div>
        <div class="search-wrapper">
            <input class="search-bar" autocomplete="off" type="search" v-model="search"
                placeholder="Type here to search lesson" />
        </div>
        <div class="sort-wrapper">
            <span class="sort-label">Sort: </span>
            <select v-model="sortOption" class="form-control sort-options">
                <option v-for="(option, key) in sortOptions" v-bind:value="key">
                    {{ option }}
                </option>
            </select>
            <select v-model="sortOrder" class="form-control sort-order">
                <option v-for="(option, key) in sortOrderOptions" v-bind:value="key">
                    {{ option }}
                </option>
            </select>
        </div>
        <div class="lesson-container" v-for="lesson in lessons">
            <div class="row">
                <div class="column">
                    <div class="col-md-6 col-md-offset-0 description">
                        <div class="lesson-detail-pair">
                            <p class="lesson-label">Subject: </p>
                            <p class="tab" v-text="lesson.subject"></p>
                        </div>
                        <div class="lesson-detail-pair">
                            <p class="lesson-label">Location: </p>
                            <p class="tab" v-text="lesson.location"></p>
                        </div>
                        <div class="lesson-detail-pair">
                            <p class="lesson-label">Price: </p>
                            <p class="tab price"> {{ lesson.price | formatPrice }}</p>
                        </div>
                        <div class="lesson-detail-pair">
                            <p class="lesson-label">Rating: </p>
                            <div class="tab">
                                <span v-bind:class="{ 'rating-active': checkRating(n, lesson) }" v-for="n in 5">☆
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="col-md-5 col-md-offset-0">
                        <figure>
                            <img class="lesson" v-bind:src=getImageSrc(lesson.image)>
                        </figure>
                    </div>
                </div>
                <!-- end of col-md-6-->
            </div>
            <div class=" add-cart-button-container">
                <button class=" btn btn-primary btn-lg add-cart-button" v-on:click="addItemToCart(lesson)"
                    v-if="canAddToCart(lesson)">Add to cart</button>
                <button disabled="true" class=" btn btn-primary btn-lg add-cart-button" v-else>Add to cart</button>
                <span class="inventory-message sold-out" v-if="lesson.availableInventory - cartCount(lesson.id) === 0">Sold
                    Out!
                </span>
                <span class="inventory-message few-left" v-else-if="lesson.availableInventory - cartCount(lesson.id) < 5">
                    Hurry!! Only {{ lesson.availableInventory - cartCount(lesson.id) }} left
                </span>
                <span class="inventory-message available" v-else>{{ lesson.availableInventory - cartCount(lesson.id) }}
                    lessons available
                </span>
            </div>
            <!-- end of row-->
        </div>
        <!-- end of v-for-->
    </div>
</template>
<script>
export default {
    name: "LessonList",
    props: ["lessons",
        "getImageSrc", "cart", "loadLessons"],
    data: function () {
        return {
            search : "",
            sortOption: "SUBJECT",
            sortOrder: "ASC",
            sortOptions: {
                SUBJECT: 'Subject',
                availableInventory: 'Availability',
                LOCATION: 'Location',
                PRICE: 'Price',
                RATING: 'Rating'
            },
            sortOrderOptions: {
                ASC: 'Asc',
                DES: 'Des'
            },
        }
    },
    methods: {
        addItemToCart: function (lesson) {
            this.$emit("add-item-to-cart", lesson);
        },
        checkRating(n, myLesson) {
            return myLesson.rating - n >= 0;
        },
        canAddToCart(aLesson) {
            return aLesson.availableInventory > this.cartCount(aLesson.id);
        },
        cartCount(id) {
            let count = 0;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    count++;
                }
            }
            return count;
        },
    },
    watch: {
        sortOption() {
            this.$emit("load-lessons", this.search, this.sortOption, this.sortOrder);
        },
        sortOrder() {
            this.$emit("load-lessons", this.search, this.sortOption, this.sortOrder);
        },
        search() {
            this.$emit("load-lessons", this.search, this.sortOption, this.sortOrder);
        }
    },
    filters: {
        formatPrice(price) {
            if (!parseInt(price)) { return ""; }
            if (price > 99999) {
                var priceString = (price / 100).toFixed(2);
                var priceArray = priceString.split("").reverse();
                var index = 3;
                while (priceArray.length > index + 3) {
                    priceArray.splice(index + 3, 0, ",");
                    index += 4;
                }
                return "£" + priceArray.reverse().join("");
            } else {
                return "£" + (price / 100).toFixed(2);
            }
        }
    }
}
</script>