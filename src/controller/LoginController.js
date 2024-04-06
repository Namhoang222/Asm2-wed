window.LoginController = function ($scope, $location, $http , $timeout) {
   
  



    $scope.handleLogin = () => {


        
        let userName = $scope.username;
        let passWord = $scope.password;


        let check = validateFormAdd();

        if(check) {
            if (userName && passWord) {
                $http.get("http://localhost:3000/user").then((response) => {
                    let users = response.data;
                    let authenticatedUser = users.find(user => user.username === userName && user.password === passWord);
    
                    if (authenticatedUser) {
                        localStorage.setItem('username', authenticatedUser.username);
                        localStorage.setItem('role', authenticatedUser.role);
                        localStorage.setItem("id" , authenticatedUser.id);
                        $scope.loginSuccess= "Đăng nhập thành công";
                        $timeout(() => {
                            $location.path('/home');
                        },1500)
                    } else {
                        $scope.loginError = "Đăng nhập không thành công. Tên đăng nhập hoặc mật khẩu không đúng.";
                    }
                }).catch((error) => {
                    $scope.loginError = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
                });
            } else {
                $scope.loginError = "Yêu cầu nhập đầy đủ thông tin. Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.";
            }

        }

   
    }


    $scope.logout = () => {
        localStorage.removeItem("username")
        localStorage.removeItem("role")
    }



    const validateFormAdd = () => {
        let check = true;
    
        $scope.errorCheck = {
          errorUsername: false,
          errorPassword: false,

        };
    
        $scope.errorMsg = {
          errorUsername: "",
          errorPassword: "",

        };
    
        if (!$scope.username) {
          $scope.errorCheck.errorUsername= true;
          check = false;
          $scope.errorMsg.errorUsername= "User name is not empty";
        }
        if (!$scope.password) {
            $scope.errorCheck. errorPassword= true;
            check = false;
            $scope.errorMsg. errorPassword = "Password is not empty";
          }

 
        return check;
      };
}
