window.ProductAdminController = function ($scope, $http) {

  let localGetRole = localStorage.getItem("role")
  console.log(localGetRole);
  if(localGetRole != null && localGetRole === "user"){
      $location.path("/401auth");
  }

  const BASE_URL = "http://localhost:3000";
  $scope.productList = [];

  $http
    .get(`${BASE_URL}/sach`)
    .then((res) => {
      $scope.productList = res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  $scope.deleteProduct = (id) => {
    let confirmDelete = confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này không?"
    );
    if (confirmDelete) {
      $http
        .delete(`${BASE_URL}/sach/${id}`)
        .then((res) => {
          if (res.status == 200) {
            alert("Xóa sản phẩm thành công!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  $scope.logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.reload();
  };

  $scope.checkUserLogin = () => {
    let userLocal = localStorage.getItem("username");
    if (userLocal) {
      $scope.username = userLocal;
      return true;
    } else {
      return false;
    }
  };

  $scope.fetchUserData = () => {
    let idUser = localStorage.getItem("id");
    $http
      .get(`http://localhost:3000/user/${idUser}`)
      .then((res) => {
        let user = res.data;
        console.log(user);
        if (user) {
          $scope.userCartCount = user.cart.length;
        } else {
          console.error("User not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  };

  $scope.handleMuaNgay = function(idProduct) {
    let idUser = localStorage.getItem('id');

    // Fetch user data based on user ID
    $http.get(`http://localhost:3000/user/${idUser}`)
        .then((res) => {
            let user = res.data;
            if (user) {
                // Fetch product data based on product ID
                $http.get(`http://localhost:3000/sach/${idProduct}`)
                    .then((response) => {
                        let productToAdd = response.data;
                        if (productToAdd) {
                            // Decrement quantity of the product by 1
                            productToAdd.soLuong -= 1;

                            // If quantity becomes 0 or less, remove the product
                            if (productToAdd.soLuong <= 0) {
                                // Remove the product from the list of available products
                                // Here, you might want to handle what happens when the quantity becomes 0
                                console.warn("Quantity of the product is 0 or less. Handle this case.");
                            }

                            // Add the product to the user's cart with quantity 1
                            user.cart.push({
                                id: productToAdd.id,
                                ten: productToAdd.ten,
                                gia: productToAdd.gia,
                                mota: productToAdd.mota,
                                soLuong: 1,
                                hinh: productToAdd.hinh
                            });

                            // Update the product's quantity and user's cart on the server
                            $http.put(`http://localhost:3000/user/${idUser}`, user)
                                .then((res) => {
                                    alert("Đã thêm vào giỏ hàng thành công");
                                })
                                .catch((error) => {
                                    console.error("Error adding product to cart:", error);
                                });
                        } else {
                            console.error("Product not found.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching product data:", error);
                    });
            } else {
                console.error("User not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
};

};
