// Copyright 2016 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {stateName as daemonSetStateName} from '../../../daemonsetdetail/daemonsetdetail_state';
import {stateName as deploymentStateName} from '../../../deploymentdetail/deploymentdetail_state.js';
import {stateName as jobStateName} from '../../../jobdetail/jobdetail_state';
import {stateName as replicaSetStateName} from '../../../replicasetdetail/replicasetdetail_state';
import {stateName as replicationControllerStateName} from '../../../replicationcontrollerdetail/replicationcontrollerdetail_state';
import {stateName as statefulSetStateName} from '../../../statefulsetdetail/statefulsetdetail_state';
import {StateParams} from '../../resource/resourcedetail.js';

const referenceKindToDetailStateName = {
  Deployment: deploymentStateName,
  ReplicaSet: replicaSetStateName,
  ReplicationController: replicationControllerStateName,
  DaemonSet: daemonSetStateName,
  StatefulSet: statefulSetStateName,
  Job: jobStateName,
};

/**
 * @final
 */
export default class SerializedReferenceController {
  /**
   * Constructs serialized reference controller.
   * @param {!ui.router.$state} $state
   * @param {!angular.Scope} $scope
   * @ngInject
   */
  constructor($state, $scope) {
    /** @export {string} */
    this.reference;

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    /** @export {boolean} */
    this.valid = false;

    /** @export {string|undefined} */
    this.href;

    /** @export {string|undefined} */
    this.kind;

    /** @export {string|undefined} */
    this.name;

    $scope.$watch(() => this.reference, () => this.recalculateDerivedProperties());
  }

  /**
   * Updates the derived properties of the reference bound to this control.
   * If the reference is invalid will set the valid flag to false.
   */
  recalculateDerivedProperties() {
    let parsedValue;
    try {
      parsedValue = JSON.parse(this.reference);
    } catch (e) {
      this.valid = false;
      return;
    }
    if (!parsedValue.kind || parsedValue.kind !== 'SerializedReference') {
      this.valid = false;
      return;
    }
    let reference = parsedValue.reference;
    this.href = this.state_.href(
        referenceKindToDetailStateName[reference.kind],
        new StateParams(reference.namespace, reference.name));
    this.kind = reference.kind;
    this.name = reference.name;
    this.valid = true;
  }
}
