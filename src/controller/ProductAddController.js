window.ProductAddController = function ($scope, $location, $http) {

  let localGetRole = localStorage.getItem("role")
  console.log(localGetRole);
  if(localGetRole != null && localGetRole === "user"){
      $location.path("/401auth");
  }

  $scope.nameImg = "";
  $scope.file = null;
  const BASE_URL = "http://localhost:3000";
  $scope.quantity = 1

  $scope.onChangefile = function (files) {
    $scope.nameImg = files?.name;
    $scope.file = files;
    if (files) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $scope.$apply(function () {
          $scope.imageSrc = e.target.result;
        });
      };
      reader.readAsDataURL(files);
    }
  };

  $scope.addProduct = () => {
    let check = validateFormAdd();

    if (check) {
      if ($scope.file) {
        var currentDate = new Date();
        var fileName =
          $scope.nameImg +
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1) +
          "-" +
          currentDate.getDate() +
          "_" +
          currentDate.getHours() +
          "-" +
          currentDate.getMinutes() +
          "-" +
          currentDate.getSeconds() +
          ".png";
        var blob = new Blob([$scope.file], { type: $scope.file.type });
        saveAs(blob, fileName);
      }
      let dataAdd = {
        id: Math.floor(Math.random() * 10000) + 1 + "",
        ten: $scope.name,
        gia: $scope.price,
        mota: $scope.description,
        hinh: fileName,
        soLuong: $scope.quantity,
      };

      $http.post(`${BASE_URL}/sach`, dataAdd)
      .then((res) => {
        if (res == 201) {
          alert("Thêm sản phẩm thành công!");         
        }
      });
    }
  };

  const validateFormAdd = () => {
    let check = true;

    $scope.errorCheck = {
      errorTen: false,
      errorGia: false,
      errorMota: false,
      errorHinh: false,
      errorSoluong: false,
    };

    $scope.errorMsg = {
      errorTen: "",
      errorGia: "",
      errorMota: "",
      errorHinh: "",
      errorSoluong: "",
    };

    if (!$scope.name) {
      $scope.errorCheck.errorTen = true;
      check = false;
      $scope.errorMsg.errorTen = "Name is not empty";
    }
    if (!$scope.nameImg) {
      $scope.errorCheck.errorHinh = true;
      check = false;
      $scope.errorMsg.errorHinh = "Image is not empty";
    }
    if (!$scope.price) {
      $scope.errorCheck.errorGia = true;
      check = false;
      $scope.errorMsg.errorGia = "Price is not empty";
    } 
     if ($scope.price < 0) {
      $scope.errorCheck.errorGia = true;
      check = false;
      $scope.errorMsg.errorGia = "Price must be greater than 0";
    }
    if(!/^\d*\.?\d+$/.test($scope.price)){
      $scope.errorCheck.errorGia = true;
      check = false;
      $scope.errorMsg.errorGia = "Price must be a number";
    }

    if (!$scope.quantity) {
      $scope.errorCheck.errorSoluong = true;
      check = false;
      $scope.errorMsg.errorSoluong = "Quantity is not empty";
    }

    if ($scope.quantity < 0) {
      $scope.errorCheck.errorSoluong = true;
      check = false;
      $scope.errorMsg.errorSoluong = "Quantity must be greater than 0";
    }
    if (!$scope.description) {
      $scope.errorCheck.errorMota = true;
      check = false;
      $scope.errorMsg.errorMota = "Description is not empty";
    }

    return check;
  };

  $scope.handelResetForm = () => {
    $scope.name = "";
    $scope.price = "";
    $scope.description = "";
    $scope.quantity = "";
    $scope.nameImg = "";
    $scope.imageSrc = "";
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


  $scope.handleMuaNgay = function (idProduct) {
    let idUser = localStorage.getItem('id');

    $http.get(`http://localhost:3000/user/${idUser}`)
        .then((res) => {
            let user = res.data;
            if (user) {
                $http.get(`http://localhost:3000/sach/${idProduct}`)
                    .then((response) => {
                        let productToAdd = response.data;
                        if (productToAdd) {

                            user.cart.push(productToAdd);

                            $http.put(`http://localhost:3000/user/${idUser}`, user)
                                .then((res) => {
                                  alert("Đã thêm vào giỏ hàng thành công")
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
