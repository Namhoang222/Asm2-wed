window.ProductDetailController = function (
  $scope,
  $location,
  $http,
  $routeParams,
) {
  const BASE_URL = "http://localhost:3000";
  let idProduct = $routeParams.id;
  $scope.quantity = 1;
  $scope.productDetail = [];
  $scope.total = 0;
  $scope.soLuong = 1

  $http
    .get(`${BASE_URL}/sach/${$routeParams.id}`)
    .then((res) => {
      $scope.productDetail = res.data;
      $scope.total = res.data.gia;
      $scope.totalDetail = $scope.total;
    })
    .catch((err) => {
      console.log(err);
    });

  $scope.handleTru = () => {
    if ($scope.quantity == 1) {
      $scope.quantity = 1;
    }
    if ($scope.quantity > 1) {
      $scope.quantity = $scope.quantity - 1;
      $scope.totalDetail = $scope.total * $scope.quantity;
    }
  };

  $scope.handleCong = () => {
    $scope.soLuong=  $scope.soLuong + 1;
    $scope.totalDetail = $scope.total * $scope.quantity;
  };

  $scope.handleBuy = () => {
    Swal.fire({
        title: 'Xác nhận mua hàng',
        text: 'Bạn có chắc chắn muốn mua hàng không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Mua ngay',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Mua hàng thành công!',
                '',
                'success'
            );
        }
    });
};


$scope.logout = () => {
  localStorage.removeItem("username")
  localStorage.removeItem("role")
  localStorage.removeItem("id")
  window.location.reload()
}

$scope.checkUserLogin = () => {
      let userLocal = localStorage.getItem('username');
      if(userLocal){       
          $scope.username = userLocal;
          return true
      }else{
          return false
      }
  }


$scope.fetchUserData = () => {
    let idUser = localStorage.getItem('id');
    $http.get(`http://localhost:3000/user/${idUser}`)
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
  let soLuong = $scope.soLuong;

  $http.get(`http://localhost:3000/user/${idUser}`)
      .then((res) => {
          let user = res.data;
          if (user) {
              $http.get(`http://localhost:3000/sach/${idProduct}`)
                  .then((response) => {
                      let productToAdd = response.data;
                      if (productToAdd) {
                          productToAdd.soLuong = soLuong;
                          user.cart.push(productToAdd);
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

$scope.fetchUserData()
};
