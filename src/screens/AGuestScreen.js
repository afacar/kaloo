import React, { Component } from 'react';
import GuestView from '../components/GuestView';
import HeaderLeft from '../components/Headers/HeaderLeft';
import { connect } from 'react-redux';


class AGuestScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => null,
    headerLeft: () => <HeaderLeft onPress={navigation.goBack} />
  });

  render() {
    return (
      <GuestView
        event={this.props.event}
        ticket={this.props.ticket}
        viewers={this.props.viewers}
        navigation={this.props.navigation}
      />
    )
  }
}

const mapStateToProps = ({ joinEvent }) => {
  const { event, ticket, viewers } = joinEvent
  return { event, ticket, viewers }
}

export default connect(mapStateToProps, null)(AGuestScreen);