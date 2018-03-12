/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .controller('ConfirmAppConfirmCtrl', function($scope, $rootScope, Delivery, DELIVERY_CONST, Client, CLIENT_CONST) {

        $scope.getStepTemplate = getStepTemplate ;
        $scope.gotoStep = gotoStep;
        $scope.search = searchPaspor;
        $scope.currentStep = 1;
        $scope.steps = _getStep();
        $scope.client = {};
        $scope.formValid = false;
        $scope.pasportReceived = false;


        function gotoStep(newStep) {
            $scope.currentStep = newStep;
        }
        function getStepTemplate(){
            for (var i = 0; i < $scope.steps.length; i++) {
                if ($scope.currentStep == $scope.steps[i].step) {
                    return $scope.steps[i].template;
                }
            }
        }
        function searchPaspor(isValid) {
            if (isValid){
                _showLoadingBar();
                Delivery.getDeliveryByPasporAndName($scope.client)
                    .then(function (Delivery) {
                        _hideLoadingBar();
                        gotoStep(2);
                    },
                    function (err) {
                        _hideLoadingBar();
                    })
            }

        }


        // private function
        function _showLoadingBar() {
            var modalOptions = {
                backdrop : 'static',
                keyboard : false,
                show : true
            };
            angular.element('#myModal').modal(modalOptions);
        }
        function _hideLoadingBar() {
            angular.element('#myModal').modal('hide');
        }
        function _getStep() {
            return [
                {
                    step: 1,
                    name: "Cari Paspor",
                    template: "partials/confirm_search.html"
                },
                {
                    step: 2,
                    name: "Konfirmasi",
                    template: "partials/confirmation_prompt.html"
                }
            ];
        }
    });