import React from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Contacts, Permissions } from 'expo';
import { NavigationEvents, NavigationScreenProps } from 'react-navigation';
import HeaderButtons from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import ContactsList from './ContactsList';
import * as ContactUtils from './ContactUtils';

const CONTACT_PAGE_SIZE = 500;

interface State {
  contacts: Contacts.Contact[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  permission?: boolean;
  refreshing: boolean;
}

export default class ContactsScreen extends React.Component<NavigationScreenProps, State> {
  static navigationOptions = () => {
    return {
      title: 'Contacts',
      headerRight: (
        <HeaderButtons
          IconComponent={Ionicons}
          OverflowIcon={<Ionicons name="ios-more" size={23} color="blue" />}
          iconSize={23}
          color="blue"
        >
          <HeaderButtons.Item
            title="add"
            iconName="md-add"
            onPress={async () => {
              const randomContact = { note: 'Likes expo...' };

              // @ts-ignore
              ContactUtils.presentNewContactFormAsync({ contact: randomContact });
              // ContactUtils.presentUnknownContactFormAsync({
              //   contact: randomContact,
              // });
            }}
          />
        </HeaderButtons>
      ),
    };
  }

  _rawContacts: { [contactId: string]: Contacts.Contact } = {};
  readonly state: State = {
    contacts: [],
    hasPreviousPage: false,
    hasNextPage: false,
    refreshing: false,
  };

  componentDidFocus = async () => {
    await this.checkPermissionAsync();
    await this.loadAsync();
  }

  checkPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    this.setState({ permission: status === 'granted' });
  }

  loadAsync = async ({ distanceFromEnd }: { distanceFromEnd?: number } = {}, restart = false) => {
    if (!this.state.permission || this.state.refreshing) {
      return;
    }
    this.setState({ refreshing: true });

    const pageOffset = restart ? 0 : this.state.contacts.length || 0;

    const pageSize = restart ? Math.max(pageOffset, CONTACT_PAGE_SIZE) : CONTACT_PAGE_SIZE;

    const payload = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name],
      sort: Contacts.SortTypes.LastName,
      pageSize,
      pageOffset,
    });

    const { data: contacts, hasPreviousPage, hasNextPage } = payload;

    if (restart) {
      this._rawContacts = {};
    }

    for (const contact of contacts) {
      this._rawContacts[contact.id] = contact;
    }
    this.setState({
      contacts: Object.values(this._rawContacts),
      hasPreviousPage,
      hasNextPage,
      refreshing: false,
    });
  }

  onPressItem = async (id: string) => {
    // tslint:disable-next-line no-console
    console.log('onPress', id);
    this.props.navigation.navigate('ContactDetail', { id });
  }

  render() {
    const { contacts, permission } = this.state;
    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <NavigationEvents onDidFocus={this.componentDidFocus} />
          <Text>No Contact Permission</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.componentDidFocus} />
        <ContactsList
          onEndReachedThreshold={-1.5}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.loadAsync({}, true)}
            />
          }
          data={contacts}
          onPressItem={this.onPressItem}
          onEndReached={this.loadAsync}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactRow: {
    marginBottom: 12,
  },
});
