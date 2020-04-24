import React from 'react';
import {logger} from '../../../utilities/winstonLogging/winstonInit';

//Lazy loading for Code Splitting
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import { useTranslation } from 'react-i18next';

//Custom Components
import ContactListItem from './ContactListItem/ContactListItem'
import config from "../../../containers/Coin/Send/configSend";

const ContactList = (props) => {
    const {
        selectedContact,
        handleSelect,

        hasSearched,
        currentProfile,
        searchInput,
        placeList,
        contactList,
        locatePLace
    } = props;

    const { t } = useTranslation('ContactList');

    logger.debug('CONTACT LIST, profile => ', currentProfile);

    const listSearch = (inputField, list) => { //function to filter on searchInput
        if ( inputField.length >= config.numberOfCharsToStartSearch ) {
            return list.filter( ( listItem ) => {
                return listItem.name.toLowerCase().includes((inputField.toLowerCase()).trim());
            });
        }else{
            return list;
        }
    };

    const listItemMap =  (contact, index) => { //function to create listItems from placeList and contactList

        const {
            id,
            icon,
            name,
            category,
            verified,
            near,
            favorite,
            distance,
            mostContacted,
            email,
            coordinates
        } = contact;

        const selected = selectedContact === index;

        return (
            <ContactListItem
                handleSelect={()=> handleSelect(contact)}
                key={index}
                icon={icon}
                name={name}
                category={category}
                selected={selected}
                verified={verified}
                near={near}
                favorite={favorite}
                index={id}
                email={email}
                distance={distance}
                mostContacted={mostContacted}
                coordinates={coordinates}
                locatePLace={(location) => locatePLace(location)}
            />
        )
    };

    //PLACES == DAOs
    let subheaderForPlaces = null;
    let filteredPlaceList = [];
    let placesListItems = null;
    let placesUIList = null;
    if(currentProfile.realm === 'dao') { //if present remove the DAOs == current profile (to avoid self payment)
        filteredPlaceList = placeList.filter((place) => currentProfile.id !== place.firstLifePlaceID );
    }else{
        filteredPlaceList = placeList
    }
    if(filteredPlaceList && filteredPlaceList.length !== 0){
        if(hasSearched) {
            subheaderForPlaces = <ListSubheader style={{paddingLeft: 0, paddingRight: 0}}>{t('filteredPlaces')}:</ListSubheader>;
            filteredPlaceList = listSearch(searchInput, filteredPlaceList);
        }else{ //it shows the closest places
            subheaderForPlaces = <ListSubheader style={{paddingLeft: 0, paddingRight: 0}}>{t('closePlaces')}:</ListSubheader>;
        }

        subheaderForPlaces = filteredPlaceList.length === 0 ? null : subheaderForPlaces;
        placesListItems = filteredPlaceList.map(listItemMap);

        placesUIList = (
            <>
                {subheaderForPlaces}
                {placesListItems}
            </>
        );
    }

    //CONTACTS = people
    let subheaderForPeople = null;
    let filteredPeople = [];
    let peopleListItems = null;
    let peopleUIList = null;
    if(currentProfile.realm === 'user'){//if present remove the user == currentProfile to avoid self paying
        filteredPeople = contactList.filter( (person) => person.id !== currentProfile.id);
    }else{
        filteredPeople = contactList;
    }
    if(filteredPeople && filteredPeople.length !== 0){
        if(hasSearched) {
            subheaderForPeople = <ListSubheader style={{paddingLeft: 0, paddingRight: 0}}>{t('filteredPeople')}:</ListSubheader>;
            filteredPeople = listSearch(searchInput, filteredPeople);
        }else{ //it shows the users with which the user made the most transactions
            subheaderForPeople =  <ListSubheader style={{paddingLeft: 0, paddingRight: 0}}>{t('topUsers')}:</ListSubheader>;
        }

        subheaderForPeople = filteredPeople.length ===0 ? null : subheaderForPeople;
        peopleListItems = filteredPeople.map(listItemMap);

        peopleUIList = (
            <>
                {subheaderForPeople}
                {peopleListItems}
            </>
        );

    }

    return (
        <Grid container style={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Grid item xs={12}>
                <List dense>
                    {placesUIList}
                    {peopleUIList}
                </List>
            </Grid>
        </Grid>
    );
};

export default ContactList;
