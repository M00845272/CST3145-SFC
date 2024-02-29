<template>
    <div>
        <div class="lesson-list-title">
            Cart Details
        </div>
        <div class="lesson-container" v-for="lesson in cartLessons">
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
                    </div>
                </div>
                <div class="column">
                    <div class="col-md-5 col-md-offset-0">
                        <figure>
                            <img class="lesson" v-bind:src="getImageSrc(lesson.image)">
                        </figure>
                    </div>
                </div>
                <!-- end of col-md-6-->
            </div>
            <div class=" add-cart-button-container">
                <button class=" btn btn-primary btn-lg add-cart-button" v-on:click="removeFromCart(lesson)">Remove from
                    cart</button>
            </div>
            <!-- end of row-->
        </div>
        <!-- end of v-for-->
        <!-- end of cart-->
        <div>
            <div class="col-md-10 col-md-offset-1">
                <div class="panel panel-info">
                    <div class="panel-heading">Checkout</div>
                    <div class="panel-body checkout-panel">
                        <div class="form-group">
                            <div class="col-md-12">
                                <h4>
                                    <strong>Enter Your Information</strong>
                                </h4>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-6 checkout-form-column">
                                <strong>First Name:</strong>
                                <input v-model.trim="order.firstName" class="form-control" />
                                <p v-if="order.validation.firstNameInvalid == true" class="input-error">Enter Valid First
                                    Name</p>
                            </div>
                            <div class="col-md-6 checkout-form-column">
                                <strong>Last Name:</strong>
                                <input v-model.trim="order.lastName" class="form-control" />
                                <p v-if="order.validation.lastNameInvalid == true" class="input-error">Enter Valid Last Name
                                </p>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-6 checkout-form-column">
                                <strong>Email:</strong>
                                <input v-model.trim="order.email" class="form-control" />
                                <p v-if="order.validation.emailInvalid == true" class="input-error">Enter Valid Email</p>
                            </div>
                            <div class="col-md-6 checkout-form-column">
                                <strong>Phone:</strong>
                                <input v-model.trim="order.phone" type="number" class="form-control" />
                                <p v-if="order.validation.phoneInvalid == true" class="input-error">Enter Valid Phone</p>
                            </div>
                        </div>
                        <!-- end of form-group-->
                        <div class="verify-container">
                            <div class="col-md-12 verify">
                                <div>
                                    <strong>First Name:</strong> {{ order.firstName }}<br />
                                    <strong>Last Name:</strong> {{ order.lastName }}<br />
                                    <strong>Email:</strong> {{ order.email }}<br />
                                    <strong>Phone:</strong> {{ order.phone }}<br />
                                </div>
                            </div>
                            <!-- end of col-md-12 verify-->
                            <div class="form-group">
                                <div class="col-md-6">
                                    <button type="submit" class="btn btn-primary submit" v-if="canPlaceOrder()"
                                        v-on:click="submitForm">Place
                                        Order</button>
                                    <button type="submit" disabled="true" class="btn btn-primary submit" v-else
                                        v-on:click="submitForm">Place
                                        Order</button>
                                </div>
                                <!-- end of col-md-6-->
                            </div>
                        </div>
                    </div>
                    <!--end of panel-body-->
                </div>
                <!--end of panel panel-info-->
            </div>
            <!--end of col-md-10 col-md-offset-1-->
        </div>
        <!--end of row-->
    </div>
</template>
<script>
export default {
    name: "Checkout",
    props: ["lessons","getImageSrc", "cart", "loadLessons"],
    data: function () {
        return {
            order: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                validation: {
                    firstNameInvalid: false,
                    lastNameInvalid: false,
                    emailInvalid: false,
                    phoneInvalid: false
                }
            },
        }
    },
    computed: {
        cartLessons() {
            if (this.cart.length > 0) {
                let cartArray = [];
                for (var i = 0; i < this.cart.length; i++) {
                    cartArray.push(this.findLesson(this.cart[i]))
                }

                function compare(a, b) {
                    if (a.subject.toLowerCase() < b.subject.toLowerCase())
                        return -1;
                    if (a.subject.toLowerCase() > b.subject.toLowerCase())
                        return 1;
                    return 0;
                }
                return cartArray.sort(compare);
            }
        },
    },
    methods: {
        findLesson(id) {
            for (var i = 0; i < this.lessons.length; i++) {
                if (this.lessons[i].id === id) {
                    return this.lessons[i];
                }
            }
            return;
        },
        submitForm() {
            let webstore = this;
            let lessons = {};
            webstore.cart.forEach(function (lessonId) {
                // If the lesson is not already a key, initialize it with count 1
                if (!lessons[lessonId]) {
                    lessons[lessonId] = 1;
                } else {
                    // If the lesson is already a key, increment the count
                    lessons[lessonId]++;
                }
            });

            let orderDetails = {
                "firstName": webstore.order.firstName,
                "lastName": webstore.order.lastName,
                "email": webstore.order.email,
                "phoneNumber": webstore.order.phone,
                "lessons": lessons
            }
            // Send POST request using Fetch API
            fetch(webstore.URL + '/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Order created successfully:', data);
                    webstore.cart = [];
                    webstore.order = this.getDefaultOrderDetails();
                    webstore.updateAvailableSpaces(lessons);
                    alert('Order Placed Successfully');
                    webstore.showLesson = true;
                    this.currentView = LessonList;
                    this.$emit("order-success");
                })
                .catch(error => {
                    console.error('Error creating order:', error);
                    alert('Error creating order');
                });
        },
        updateAvailableSpaces(cart) {
            // Send PUT request using Fetch API
            fetch(webstore.URL + '/lesson/update_availability', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Available spaces updated successfully:', data);
                })
                .catch(error => {
                    console.error('Error updating available spaces:', error);
                });
        },
        canPlaceOrder() {
            const lettersOnlyRegex = /^[a-z]+$/i;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const phoneRgex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            var isValid = true;

            if (this.order.firstName == '' || !lettersOnlyRegex.test(this.order.firstName)) {
                this.order.validation.firstNameInvalid = true;
                isValid = false;
            } else {
                this.order.validation.firstNameInvalid = false;
            }
            if (this.order.lastName == '' || !lettersOnlyRegex.test(this.order.lastName)) {
                this.order.validation.lastNameInvalid = true;
                isValid = false;
            } else {
                this.order.validation.lastNameInvalid = false;
            }
            if (this.order.email == '' || !emailRegex.test(this.order.email)) {
                this.order.validation.emailInvalid = true;
                isValid = false;
            } else {
                this.order.validation.emailInvalid = false;
            }
            if (this.order.phone == '' || !phoneRgex.test(this.order.phone)) {
                this.order.validation.phoneInvalid = true;
                isValid = false;
            } else {
                this.order.validation.phoneInvalid = false;
            }

            return isValid;
        },
        removeFromCart (lesson) {
            this.$emit("remove-from-cart", lesson);
        },
        getDefaultOrderDetails() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                validation: {
                    firstNameInvalid: false,
                    lastNameInvalid: false,
                    emailInvalid: false,
                    phoneInvalid: false
                }
            };
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