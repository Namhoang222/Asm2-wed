window.CartController = function( $scope , $http , $timeout , $location){
      
   let localUser = localStorage.getItem("id")
    $http.get(`http://localhost:3000/user/${localUser}`).then((res) => {
        console.log(res);
        $scope.username = res.data.username
        $scope.phone = res.data.phone
        $scope.address = res.data.address
    })



  
    $scope.localCart = () => {
        let userId = localStorage.getItem('id');
    
        $http.get(`http://localhost:3000/user/${userId}`)
            .then((res) => {
                let user = res.data;
                if (user) {
                    // Extract cart items from user data
                    $scope.cartItems = user.cart;
                    $scope.totalCost = $scope.calculateTotalCost($scope.cartItems);
                    console.log($scope.totalCost);
                } else {
                    console.error("User not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };


    $scope.handlePayment = () => {
        let idUser = localStorage.getItem('id');
        if ($scope.cartItems.length === 0) {
            alert("Không có sản phẩm nào vui lòng quay lại trang chủ để mua sắm.");
            return; 
        }
        let data = {
            id: Math.floor(Math.random() * 10000) + 1 + "",
            username: $scope.username,
            address: $scope.address,
            phone: $scope.phone,
            payment: $scope.payment,
            statusName: "Pending",
            cart: $scope.cartItems
        };
       
        $http.post('http://localhost:3000/order_cart', data)
            .then((response) => {
                $scope.buySuccess = "Đã đặt hàng thành công "
                clearCart(idUser);
            })
            .catch((error) => {
                console.error("Error placing the order:", error);
                alert("Error placing the order. Please try again later.");
            });
    };
    
    const clearCart = (userId) => {
        $http.get(`http://localhost:3000/user/${userId}`)
            .then((res) => {
                let user = res.data;
                if (user) {
                    user.cart = [];
                    $http.put(`http://localhost:3000/user/${userId}`, user)
                        .then((res) => {
                            console.log("User's cart cleared successfully.");
                            $scope.cartItems = []; 
                            console.log($scope.cartItems);
                        })
                        .catch((error) => {
                            console.error("Error clearing user's cart:", error);
                        });
                } else {
                    console.error("User not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    };
    

    
    $scope.calculateTotalCost = (cartItems) => {
        let total = 0;
        for (let i = 0; i < cartItems.length; i++) {
            total += cartItems[i].gia * cartItems[i].soLuong;
        }
        return total;
    };

    $scope.localCart()
    
}