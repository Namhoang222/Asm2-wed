window.ProductController = function ($scope, $location, $http) {

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
    let soLuong = 1;
  
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






  const BASE_URL = "http://localhost:3000";
  $scope.search=''
  
  $scope.product = [];
  $http
    .get(`${BASE_URL}/sach`)
    .then((res) => {
      $scope.product = res.data;
    })
    .catch((err) => {
      console.log(err);
    });


    $scope.fetchUserData()
};


