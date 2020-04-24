import React from 'react';
import {create} from 'react-test-renderer';
import Notification from '../../components/Notification/Notification';
import Typography from '@material-ui/core/Typography';

import getNotificationTest from '../../utilities/notification/notification-messages';

let notificationJson;
let notificationComponent;

describe('Notification component', () => {

    beforeEach(() => {
        notificationJson = {
            id: '12345something',
            timestamp: new Date(),
            type: 'success',
            body: {
                category: 'user',
                object_id: '666object',
                message: {
                    message_key: 'COIN_CREATED',
                    params: {
                        ticker: 'gigi'
                    }
                }
            },
            delivered: true,
            read: false,
        }
    });

    afterEach(() => {
        notificationComponent = null;
    });

    it('fails to initialize without the correct notification json object passed as prop', () => {
        console.error = jest.fn(); //suppressing just for readibility purposes
        expect(() => { //should throw without a notification json object
            notificationComponent = create(<Notification/>);
        }).toThrow();

        expect(() => {
            notificationComponent = create(<Notification {...notificationJson} />);
        }).not.toThrow();

        delete notificationJson.body; //should throw without some required parts (except whatever it's inside message)
        expect(() => {
            notificationComponent = create(<Notification {...notificationJson}/>);
        }).toThrow();
    });


    it('initializes correctly with the right json object passed as prop', () => {

        notificationComponent = create(<Notification {...notificationJson} />);
        let componentTree = notificationComponent.toJSON(); //json tree of the component

        let expectedNotificationText = getNotificationTest(
            notificationJson.body.message.message_key,
            notificationJson.body.message.params
        );
        //tree respects the positional order of the components
        expect(componentTree.children[1].children[0].children[0]).toEqual(expectedNotificationText);

        notificationJson.body.message.message_key = 'DAO_COIN_RECEIVED';
        notificationJson.body.message.params = {
            ticker: 'TrumpCoin',
            sender: 'Trump',
            receiver: 'USA DAO',
            amount: '992341'
        };
        expectedNotificationText = getNotificationTest(
            notificationJson.body.message.message_key,
            notificationJson.body.message.params
        );

        notificationComponent = create(<Notification {...notificationJson} />);
        componentTree = notificationComponent.toJSON();
        expect(componentTree.children[1].children[0].children[0]).toEqual(expectedNotificationText);

    });

    it('returns an error message inside the component when there is a mismatch params-message_key', () => {

        notificationJson.body.message.message_key = 'CROWDSALE_CREATED';
        notificationComponent = create(<Notification {...notificationJson} />);
        let componentTree = notificationComponent.toJSON();
        let expectedNotificationText;
        try{
            getNotificationTest(
                notificationJson.body.message.message_key,
                notificationJson.body.message.params
            );
        }catch(error){
            expectedNotificationText = error.message;
        }

        expect(componentTree.children[1].children[0].children[0]).toEqual(expectedNotificationText);
    });
});