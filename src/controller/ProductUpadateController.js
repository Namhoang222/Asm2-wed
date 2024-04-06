window.ProductUpdateController = function (
  $scope,
  $location,
  $http,
  $routeParams,
  $window
) {

  let localGetRole = localStorage.getItem("role")
  if(localGetRole != null && localGetRole === "user"){
      $location.path("/401auth");
  }

  $scope.nameImg = "";
  $scope.file = null;
  const BASE_URL = "http://localhost:3000";
  const idProduct = $routeParams.id;

  $scope.productUpdate = [];
  $http
    .get(`${BASE_URL}/sach/${idProduct}`)
    .then((res) => {
      $scope.name = res.data.ten;
      $scope.image = res.data.hinh;
      $scope.quantity = res.data.soLuong;
      $scope.price = res.data.gia;
      $scope.description = res.data.mota;
    })
    .catch((err) => {
      console.log(err);
    });

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

  $scope.handleUpdate = ($event) => {
    let check = validateFormAdd();

    if (check) {
      $event.preventDefault();

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

        let dataUpdate = {
          id: idProduct + "",
          ten: $scope.name,
          gia: $scope.price,
          mota: $scope.description,
          hinh: $scope.image,
          soLuong: $scope.quantity,
        };

        $http.put(`${BASE_URL}/sach/${idProduct}`, dataUpdate).then((res) => {
          if (res.status === 201) {
            console.log("Image updated successfully");
          }
        });
      } else {
        let dataUpdate = {
          id: idProduct + "",
          ten: $scope.name,
          gia: $scope.price,
          mota: $scope.description,
          soLuong: $scope.quantity,
          hinh: $scope.image,
        };
        let confirm = $window.confirm("Are you sure you want to update?");

        if (confirm) {
            $http.put(`${BASE_URL}/sach/${idProduct}`, dataUpdate)
                .then((res) => {
                    if (res.status === 200) {
                        alert("Update successfully");
                    }
                });
        }
      }
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
    if (!/^\d*\.?\d+$/.test($scope.price)) {
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
