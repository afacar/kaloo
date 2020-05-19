import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet, Button } from 'react-native';
import { DefaultButton } from './Buttons';
import TransparentStatusBar from './StatusBars/TransparentStatusBar';

const { width } = Dimensions.get('window');
//const height = width * 0.6;
const height = '100%'
const images = [
    'https://images.pexels.com/photos/2909067/pexels-photo-2909067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/3989821/pexels-photo-3989821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/4108004/pexels-photo-4108004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
]
let currentIndex;
const lastIndex = images.length - 1;
console.log('last index', lastIndex);

export default class ImageSlider extends Component {
    static navigationOptions = {
        headerShown: false,
    };
    state = {
        active: 0,
        defaultButtonTitle: 'SKIP'
    }

    change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        console.log('slide', slide)
        if (slide !== this.state.active) {
            this.setState({ active: slide })
        }
        if (slide == lastIndex) {
            this.setState({ defaultButtonTitle: 'DONE' })
        }

    }

    changeButton = () => {
        if (currentIndex == lastIndex) {
            this.setState(defaultButtonTitle, 'DONE')
            console.log('last image')
        } else {
            console.log('not yet');

        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TransparentStatusBar />
                <ScrollView
                    pagingEnabled
                    horizontal
                    onScroll={this.change}
                    showsHorizontalScrollIndicator={false} >
                    {
                        images.map((image, index) =>
                            (
                                <Image
                                    key={index}
                                    source={{ uri: image }}
                                    style={{ height, width, resizeMode: 'cover' }}
                                />
                            ))
                    }
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 55, alignSelf: 'center' }}>
                    <DefaultButton
                        title={this.state.defaultButtonTitle} onPress={this.props.onPress}
                    />
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 15, alignSelf: 'center' }}>
                    {
                        images.map((i, k) => (
                            <Text key={k} style={k == this.state.active ? styles.nonActiveText : styles.activeText}>◉</Text>
                        ))
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    nonActiveText: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 3
    },
    activeText: {
        fontSize: 20,
        color: 'gray',
        marginBottom: 3
    }
})