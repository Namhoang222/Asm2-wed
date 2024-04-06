window.ManagerController = function($scope, $http, $location) {
   

    let localGetRole = localStorage.getItem("role")
    if(localGetRole != null && localGetRole === "user"){
        $location.path("/401auth");
    }


    $scope.orders = [];

    $http.get('http://localhost:3000/order_cart')
    .then((response) => {
        let ordersData = response.data;
        ordersData.forEach((order) => {
            let totalPrice = order.cart.reduce((acc, item) => acc + item.gia * item.soLuong, 0);
            let productsInCart = [];

            // Fetch product data for each product ID in the cart
            order.cart.forEach((cartItem) => {
                $http.get(`http://localhost:3000/sach/${cartItem.id}`)
                    .then((productResponse) => {
                        let product = productResponse.data;
                        productsInCart.push({
                            ten: product.ten,
                            gia: product.gia,
                            soLuong: cartItem.soLuong
                        });

                        if (productsInCart.length === order.cart.length) {
                            $scope.orders.push({
                                id: order.id,
                                username: order.username,
                                status: order.statusName,
                                totalPrice: totalPrice,
                                products: productsInCart
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching product data:", error);
                    });
            });
        });
    })
    .catch((error) => {
        console.error("Error fetching order data:", error);
    });

    
    
    $scope.handleOrder = (orderId) => {
        $http.get(`http://localhost:3000/order_cart/${orderId}`)
            .then((response) => {
                let orderToUpdate = response.data; 
                console.log("orderToUpdate:", orderToUpdate);
    
                if (Array.isArray(orderToUpdate.cart)) { 
                    console.log(orderToUpdate.cart);
                } else {
                    console.log("orderToUpdate.cart is not an array:", orderToUpdate.cart); 
                }
                
                let oldOrderData = {
                    id: orderToUpdate.id,
                    username: orderToUpdate.username,
                    address: orderToUpdate.address,
                    phone: orderToUpdate.phone,
                    statusName: orderToUpdate.statusName,
                    cart: [...orderToUpdate.cart] 
                };
                
                orderToUpdate.statusName = "Success";
                
    
                $http.put(`http://localhost:3000/order_cart/${orderId}`, orderToUpdate)
                    .then((response) => {
                        console.log("Order status updated successfully:", response.data);
                    })
                    .catch((error) => {
                        console.error("Error updating order status:", error);
                
                        orderToUpdate.id = oldOrderData.id;
                        orderToUpdate.username = oldOrderData.username;
                        orderToUpdate.address = oldOrderData.address;
                        orderToUpdate.phone = oldOrderData.phone;
                        orderToUpdate.statusName = oldOrderData.statusName;
                        orderToUpdate.cart = [...oldOrderData.cart]; 
                });
            })
            .catch((error) => {
                console.error("Error getting order data:", error);
            });
    };
    
    
    
    
};
