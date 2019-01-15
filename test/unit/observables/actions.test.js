/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>
 - Shashikant Hirugade <shashikant.hirugade@modusbox.com>
 --------------
 ******/

'use strict'

const test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const ActionObservable = require('../../../src/observables/actions').actionObservable
const ActionModel = require('../../../src/models/action').actionModel
const NotificationModel = require('../../../src/models/notificationEndpoint').notificationEndpointModel
const LimitModel = require('../../../src/models/limits').limitModel
const SinonMongoose =  require('sinon-mongoose')

test('RxJs Observable Tests (Action Observable) : ', async actionTest => {
  Sinon.config = {
    useFakeTimers: false
  }

  let sandbox
  let dfspNotificationEndpointModelJSON = {
    name: 'dfsp2',
    type: 'NET_DEBIT_CAP_ADJUSTMENT_EMAIL',
    value: 'dfsp.knows@gmail.com',
    action: 'sendEmail'
  }

  actionTest.beforeEach(test => {
    sandbox = Sinon.createSandbox()
    sandbox.stub(NotificationModel, 'findOne').returns({
      populate: Sinon.stub().callsFake(function fakeFn() {
        return new Promise((resolve,reject)=>{
          resolve('a value')
        })
      })
    })

    sandbox.stub(ActionModel, 'findOne').returns({
      populate: Sinon.stub().callsFake(function fakeFn() {
        return new Promise((resolve,reject)=>{
          resolve('a value')
        })
      })
    })

    test.end()
  })

  actionTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  await actionTest.test('Should return completed when the action is "finish"', async assert => {
    let mockMessage = {
      'value': {
        'from': 'SYSTEM',
        'to': 'dfsp1',
        'id': '694dd040-a315-4427-bcf0-e29229c4defe',
        'content': {
          'header': {},
          'payload': {
            'from': 'SYSTEM',
            'to': 'dfsp1',
            'recepientDetails': {
              '_id': '5bf5480aa305f9801a6d59db',
              'name': 'dfsp1',
              'type': 'NET_DEBIT_CAP_ADJUSTMENT',
              'value': 'dean.bothma@modusbox.com',
              'action': 'sendEmail',
              'createdAt': '2018-11-21T11:56:58.919Z',
              'updatedAt': '2018-11-21T14:00:38.993Z',
              '__v': 0
            },
            'hubDetails': {
              '_id': '5bf5480aa305f9801a6d59dd',
              'name': 'Hub',
              'type': 'NET_DEBIT_CAP_ADJUSTMENT',
              'value': 'dean.bothma@modusbox.com',
              'action': 'sendEmail',
              'createdAt': '2018-11-21T11:56:58.950Z',
              'updatedAt': '2018-11-21T14:00:39.077Z',
              '__v': 0
            },
            'messageDetails': {
              'dfsp': 'dfsp1',
              'limitType': 'NET_DEBIT_CAP',
              'value': 1000,
              'currency': 'USD',
              'triggeredBy': '5bf5480ba305f9801a6d59e0',
              'repetitionsAllowed': 3,
              'fromEvent': '5bf5480ba305f9801a6d59e4',
              'action': 'sendEmail',
              'notificationEndpointType': 'NET_DEBIT_CAP_ADJUSTMENT',
              'templateType': 'adjustment',
              'language': 'en',
              'messageSubject': 'NET_DEBIT_CAP LIMIT ADJUSTMENT',
              'notificationInterval': 3,
              'resetPeriod': 60
            }
          }
        },
        'type': 'application/json',
        'metadata': {
          'event': {
            'id': '4276f87a-0a17-485f-acb8-f2d582a1f608',
            'responseTo': '88d15b71-ae0d-4e31-a285-c3fdd5982180',
            'type': 'notification',
            'action': 'event',
            'createdAt': '2018-12-11T13:36:58.225Z',
            'state': { 'status': 'success', 'code': 0, 'description': 'action successful' }
          },
          'protocol.createdAt': 1544535418447
        },
        'pp': ''
      },
      'size': 1363,
      'key': {
        'type': 'Buffer',
        'data': [51, 48, 55, 54, 50, 51, 49, 55, 45, 54, 48, 97, 48, 45, 52, 98, 102, 52, 45, 98, 98, 97, 97, 45, 100, 50, 49, 50, 53, 101, 49, 100, 54, 52, 50, 97]
      },
      'topic': 'topic-notification-event',
      'offset': 4,
      'partition': 0,
      'timestamp': 1544535418448
    }
    let params = { fromEvent: '7d4f2a70' }
    let action = 'finish'

    ActionObservable({ action, params, mockMessage }).subscribe(
      result => {
        assert.deepEqual(result, { actionResult: true })
        assert.end()
      },

      err => {
        assert.fail(`test failed with error ${err}`)
        assert.end()
      },

      () => {
        assert.ok('Observer completed')
        assert.end()
      })
  })

  await actionTest.test('Should return ?????', async assert => {

    /*let actionModelJSON = {
      timesTriggered: 1,
      isActive: false,
      triggeredBy: '5bf5480ba305f9801a6d59df',
      fromEvent: '5bf5480ba305f9801a6d59e3'
    }

    let hubNotificationEndpointModelJSON = {
      name: 'Hub',
      type: 'NET_DEBIT_CAP_ADJUSTMENT_EMAIL',
      value: 'hub.knows@gmail.com',
      action: 'sendEmail'
    }*/

    let params = {
      fromEvent: '51bb793aca2ab77a3200000d',
      dfsp: 'dfsp2',
      action: 'sendmail',
      notificationEndpointType: 'NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL',
      repetitionsAllowed: 3
    }

    /*let limitModelJSON = {
      oldValue: '1000',
      repetitions: '3',
      threshold: '10',
      name: 'dfsp2',
      currency: 'USD',
      type: 'NET_DEBIT_CAP',
      value: '500'
    }*/

    /*Sinon.mock(ActionModel)
      .expects('findOne')
      .resolves(actionModelJSON)*/

    /*Sinon.mock(NotificationModel)
      .expects('findOne')
      .withArgs({ name: params.dfsp, action: params.action, type: params.notificationEndpointType })
      .resolves(dfspNotificationEndpointModelJSON)*/

    /*Sinon.mock(NotificationModel)
      .expects('findOne')
      .withArgs({ name: 'Hub', action: params.action, type: params.notificationEndpointType })
      .resolves(hubNotificationEndpointModelJSON)*/

    let action = ''
    let mockMessage = {
      'value': {
        'from': 'SYSTEM',
        'to': 'dfsp1',
        'id': '694dd040-a315-4427-bcf0-e29229c4defe',
        'content': {
          'header': {},
          'payload': {
            'from': 'SYSTEM',
            'to': 'dfsp1',
            'recepientDetails': {
              '_id': '5bf5480aa305f9801a6d59db',
              'name': 'dfsp1',
              'type': 'NET_DEBIT_CAP_ADJUSTMENT',
              'value': 'dean.bothma@modusbox.com',
              'action': 'sendEmail',
              'createdAt': '2018-11-21T11:56:58.919Z',
              'updatedAt': '2018-11-21T14:00:38.993Z',
              '__v': 0
            },
            'hubDetails': {
              '_id': '5bf5480aa305f9801a6d59dd',
              'name': 'Hub',
              'type': 'NET_DEBIT_CAP_ADJUSTMENT',
              'value': 'dean.bothma@modusbox.com',
              'action': 'sendEmail',
              'createdAt': '2018-11-21T11:56:58.950Z',
              'updatedAt': '2018-11-21T14:00:39.077Z',
              '__v': 0
            },
            'messageDetails': {
              'dfsp': 'dfsp1',
              'limitType': 'NET_DEBIT_CAP',
              'value': 1000,
              'currency': 'USD',
              'triggeredBy': '5bf5480ba305f9801a6d59e0',
              'repetitionsAllowed': 3,
              'fromEvent': '5bf5480ba305f9801a6d59e4',
              'action': 'sendEmail',
              'notificationEndpointType': 'NET_DEBIT_CAP_ADJUSTMENT',
              'templateType': 'adjustment',
              'language': 'en',
              'messageSubject': 'NET_DEBIT_CAP LIMIT ADJUSTMENT',
              'notificationInterval': 3,
              'resetPeriod': 60
            }
          }
        },
        'type': 'application/json',
        'metadata': {
          'event': {
            'id': '4276f87a-0a17-485f-acb8-f2d582a1f608',
            'responseTo': '88d15b71-ae0d-4e31-a285-c3fdd5982180',
            'type': 'notification',
            'action': 'event',
            'createdAt': '2018-12-11T13:36:58.225Z',
            'state': { 'status': 'success', 'code': 0, 'description': 'action successful' }
          },
          'protocol.createdAt': 1544535418447
        },
        'pp': ''
      },
      'size': 1363,
      'key': {
        'type': 'Buffer',
        'data': [51, 48, 55, 54, 50, 51, 49, 55, 45, 54, 48, 97, 48, 45, 52, 98, 102, 52, 45, 98, 98, 97, 97, 45, 100, 50, 49, 50, 53, 101, 49, 100, 54, 52, 50, 97]
      },
      'topic': 'topic-notification-event',
      'offset': 4,
      'partition': 0,
      'timestamp': 1544535418448
    }

    ActionObservable({ action, params, mockMessage }).subscribe(
      result => {
        assert.deepEqual(result, { actionResult: true })
        assert.end()
      },

      err => {
        assert.fail(`test failed with error ${err}`)
        assert.end()
      },

      () => {
        assert.ok('Observer completed')
        assert.end()
      })
  })
  actionTest.end()
})