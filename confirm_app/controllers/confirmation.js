/**
 * Created by tekwan on 3/10/2018.
 */
angular.module('MyConfirmApp')
    .controller('ConfirmAppConfirmCtrl', function($scope, $rootScope, Delivery, DELIVERY_CONST, Client, CLIENT_CONST) {

        $scope.getStepTemplate = getStepTemplate ;
        $scope.gotoStep = gotoStep;
        $scope.search = searchPaspor;
        $scope.confirmDelivery = confirmDelivery;
        $scope.currentStep = 1;
        $scope.steps = _getStep();
        $scope.client = {};
        $scope.formValid = false;
        $scope.pasportReceived = false;
        $scope.delivery = {};


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
                Delivery.checkDeliveryByPasporAndName($scope.client)
                    .then(function (Delivery) {
                            console.log(Delivery);
                            _hideLoadingBar();
                            if (Delivery.data.exist == 1) {
                                gotoStep(2);
                                $scope.delivery.id = Delivery.data.id;
                            }
                        },
                        function (err) {
                            _hideLoadingBar();
                        })
            }

        }

        function confirmDelivery() {
            _showLoadingBar();

            $scope.delivery.status = 1;
            Delivery.confirmPasporDelivery($scope.delivery)
                .then(function (Delivery) {
                        _hideLoadingBar();
                        if (Delivery.data.success == 1) {
                            $scope.pasportReceived = true;
                        }
                    },
                    function () {
                        _hideLoadingBar();
                    })
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