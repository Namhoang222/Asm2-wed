window.RegisterController = function ($scope, $location, $http, $timeout) {
  
    $scope.handleSignUp = () => {
      let dataSave = {
        id: Math.floor(Math.random() * 10000) + 1 + "",
        username: $scope.username,
        password: $scope.password,
        address: $scope.address,
        role: "user",
        phone: $scope.phone,
        cart: []
      };
  
      let check = validateFormSignUp();
  
      if (check) {
        if (dataSave.username && dataSave.password) {
          $http.post("http://localhost:3000/user", dataSave).then((response) => {
            if (response.status == 201) {
              $scope.signupSuccess = "Đã đăng kí thành công";
              alert("Signup Success")
              $timeout(() => {
                $location.path('/login');
              }, 1500);
            } else {
              $scope.signupError = "Đăng kí thất bại. Vui lòng thử lại sau.";
            }
          }).catch((error) => {
            $scope.signupError = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
          });
        } else {
          $scope.signupError = "Vui lòng nhập đầy đủ thông tin.";
        }
      }
    };
  
    const validateFormSignUp = () => {
      let check = true;
  
      $scope.errorCheck = {
        errorUsername: false,
        errorPassword: false,
        errorAddress: false,
        errorPhone: false
      };
  
      $scope.errorMsg = {
        errorUsername: "",
        errorPassword: "",
        errorAddress: "",
        errorPhone: ""
      };
  
      if (!$scope.username) {
        $scope.errorCheck.errorUsername = true;
        check = false;
        $scope.errorMsg.errorUsername = "Vui lòng nhập tên đăng nhập.";
      }
      if (!$scope.password) {
        $scope.errorCheck.errorPassword = true;
        check = false;
        $scope.errorMsg.errorPassword = "Vui lòng nhập mật khẩu.";
      }
      if (!$scope.address) {
        $scope.errorCheck.errorAddress = true;
        check = false;
        $scope.errorMsg.errorAddress = "Vui lòng nhập địa chỉ.";
      }
      if (!$scope.phone) {
        $scope.errorCheck.errorPhone = true;
        check = false;
        $scope.errorMsg.errorPhone = "Vui lòng nhập số điện thoại.";
      }
  
      return check;
    };
  };
  